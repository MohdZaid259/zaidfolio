---
title: "Multi-tenant isolation with PostgreSQL Row-Level Security, Fastify and Drizzle"
description: "Stop relying on every query remembering WHERE tenant_id = ?. A production pattern for RLS policies, per-transaction tenant context, least-privilege roles, and the gotchas that quietly bypass it all."
date: 2026-10-11
tags: ["PostgreSQL", "Multi-tenancy", "Security", "Fastify", "Drizzle"]
draft: true
---

Most multi-tenant SaaS apps keep every customer's data in the same tables and separate it with a `tenant_id` column. The isolation then lives in application code: every query has to remember `WHERE tenant_id = ?`.

That works until the one query that forgets. A new endpoint, a hurried bug fix, a report someone wrote at midnight. One missing clause and tenant A can read tenant B's candidates. Code review doesn't reliably catch it, because the bug is something that *isn't* there.

PostgreSQL Row-Level Security (RLS) moves that rule into the database. You write the policy once, and Postgres applies it to every query from the application role, including the ones nobody has written yet.

This is the pattern I use on a multi-service platform built on Fastify, Drizzle and PostgreSQL. It also covers the gotchas that silently turn RLS off.

## The shape of the solution

Four pieces work together:

1. **Tables** carry a `tenant_id` and have RLS enabled *and forced*.
2. **Policies** compare `tenant_id` to a per-transaction setting, `app.tenant_id`.
3. **The API** sets `app.tenant_id` at the start of every transaction, using the tenant from the verified token.
4. **Roles** make sure the application connects as a user that RLS actually applies to.

If any one of these is missing, you have the appearance of isolation without the guarantee.

## 1. Schema: tenant first

Every tenant-owned table gets a non-null `tenant_id`, and the indexes lead with it. Every query will now filter on `tenant_id`, so that's the column your indexes need first.

```ts
// db/schema.ts
import { pgTable, uuid, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";

export const candidates = pgTable(
  "candidates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull(),
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Unique per tenant, not globally (see "gotchas" below)
    uniqueIndex("candidates_tenant_email_uq").on(t.tenantId, t.email),
    index("candidates_tenant_created_idx").on(t.tenantId, t.createdAt),
  ],
);
```

## 2. Enable, force, and write the policy

Put this in a migration:

```sql
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON candidates
  USING      (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid);
```

Each line is there for a reason:

- **`ENABLE`** turns RLS on. With RLS enabled and no matching policy, the default is *deny*: queries return zero rows.
- **`FORCE`** applies the policies to the table *owner* too. Without it, the owner bypasses RLS. That matters because the role that runs migrations usually owns the tables, and in many setups the app connects as that same role.
- **`USING`** filters which existing rows are visible to `SELECT`, `UPDATE` and `DELETE`.
- **`WITH CHECK`** validates rows being written. It stops an `INSERT` into another tenant, and an `UPDATE` that moves a row to another tenant.
- **`current_setting('app.tenant_id', true)`**: the second argument means "return NULL instead of erroring if it's not set".
- **`nullif(..., '')`** is the subtle one. Once a custom setting has been set locally in a transaction, later transactions on the same connection see it as an *empty string*, not NULL. `''::uuid` throws `invalid input syntax for type uuid`. With `nullif`, an unset tenant becomes NULL, `tenant_id = NULL` is never true, and the query safely returns nothing.

That last behavior is exactly what you want: **no tenant context means no data**, not an error page and definitely not all data.

## 3. Set the tenant per transaction

The setting must be **transaction-local**. With a connection pool, a session-level `SET app.tenant_id = ...` stays on the connection after it's returned to the pool, and the next request that borrows it inherits the previous tenant. That's precisely the leak RLS was supposed to prevent.

`set_config(name, value, is_local => true)` scopes the value to the current transaction. It also accepts bind parameters, which `SET LOCAL` does not:

```ts
// db/with-tenant.ts
import { sql } from "drizzle-orm";
import { db } from "./client";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export function withTenant<T>(tenantId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.tenant_id', ${tenantId}, true)`);
    return fn(tx);
  });
}
```

Because the value is transaction-scoped, it also works behind PgBouncer in transaction pooling mode.

Outside an explicit transaction, every statement is its own transaction, so a local `set_config` would vanish before your next query ran. That's why the helper always opens one.

### Where the tenant comes from

The tenant ID must come from something the client can't forge: a claim in the verified access token, or a lookup keyed on the authenticated user. **Never** take it from a request header or body the client controls. Otherwise a user just changes the header.

```ts
// routes/candidates.ts
app.get("/candidates", async (req) => {
  // req.auth is populated by the auth hook after the JWT signature is verified
  return withTenant(req.auth.tenantId, (tx) =>
    tx.select().from(candidates).orderBy(desc(candidates.createdAt)).limit(50),
  );
});
```

The route has no `where(eq(candidates.tenantId, ...))` at all, and it doesn't need one. You can still add it as defense in depth and as a hint to the planner, but correctness no longer depends on it.

## 4. Roles: make sure RLS applies to you

Superusers and roles with `BYPASSRLS` skip every policy. If your app connects as `postgres`, none of the above does anything.

A minimal split:

```sql
-- Owns tables, runs migrations. The application never logs in as this role.
CREATE ROLE app_owner NOLOGIN;

-- What the API uses for reads and writes
CREATE ROLE app_rw LOGIN PASSWORD '...' NOBYPASSRLS;

-- What read-only services and reporting use
CREATE ROLE app_ro LOGIN PASSWORD '...' NOBYPASSRLS;
ALTER ROLE app_ro SET default_transaction_read_only = on;

GRANT USAGE ON SCHEMA public TO app_rw, app_ro;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_rw;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_ro;

-- Apply the same grants to tables created by future migrations
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA public
  GRANT SELECT ON TABLES TO app_ro;
```

Read-only services get two independent guarantees. They *can't* write because of the grants, and they *won't* because the transaction is read-only by default. RLS still scopes what they can read.

If you use serial or identity columns, `app_rw` also needs `USAGE` on the sequences. With `gen_random_uuid()` defaults it doesn't.

## Gotchas that quietly bypass RLS

These are the ones worth checking in an existing codebase.

### Tests that pass for the wrong reason

If your test database user is a superuser, which is the default in most Docker setups, **every RLS test passes trivially** because the policies never run. Run integration tests as `app_rw`.

### Views

By default a view runs with its *owner's* privileges, not the caller's. On PostgreSQL 15+, create views with `WITH (security_invoker = true)` so the caller's role and policies apply.

### `SECURITY DEFINER` functions

Same idea: they run as the function owner. Keep them rare, and filter explicitly inside them.

### Unique constraints are global

`UNIQUE (email)` across all tenants leaks information. Tenant B tries to add `jane@acme.com`, gets a duplicate-key error, and now knows tenant A has that candidate. Make uniqueness per tenant: `UNIQUE (tenant_id, email)`.

### Foreign keys ignore RLS

Referential integrity checks bypass row security. If a client sends `job_id` for a job in another tenant, a plain foreign key happily accepts it. Make the reference carry the tenant:

```sql
ALTER TABLE jobs ADD CONSTRAINT jobs_tenant_id_id_uq UNIQUE (tenant_id, id);

ALTER TABLE applications
  ADD CONSTRAINT applications_job_fk
  FOREIGN KEY (tenant_id, job_id) REFERENCES jobs (tenant_id, id);
```

Now the database itself refuses a cross-tenant link.

### Expensive policies

The policy predicate is added to every query. A simple column comparison is cheap with the right index. A policy that runs a subquery for each row, such as "is this user a member of this tenant", can be slow. Wrap the lookup in `(select ...)` so Postgres evaluates it once per query instead of once per row.

## Prove it with tests

These four tests catch most regressions. Run them as `app_rw`, against a real Postgres:

```ts
// test/rls.test.ts
import { describe, it, expect } from "vitest";
import { sql } from "drizzle-orm";
import { withTenant } from "../db/with-tenant";
import { db } from "../db/client";
import { candidates } from "../db/schema";

const A = "00000000-0000-0000-0000-00000000000a";
const B = "00000000-0000-0000-0000-00000000000b";

describe("tenant isolation", () => {
  it("hides other tenants' rows", async () => {
    await withTenant(A, (tx) =>
      tx.insert(candidates).values({ tenantId: A, email: "a@x.io", fullName: "A" }),
    );
    const seenByB = await withTenant(B, (tx) => tx.select().from(candidates));
    expect(seenByB.find((c) => c.email === "a@x.io")).toBeUndefined();
  });

  it("rejects writes into another tenant", async () => {
    await expect(
      withTenant(B, (tx) =>
        tx.insert(candidates).values({ tenantId: A, email: "sneaky@x.io", fullName: "S" }),
      ),
    ).rejects.toThrow(/row-level security/);
  });

  it("returns nothing without tenant context", async () => {
    const rows = await db.select().from(candidates);
    expect(rows).toHaveLength(0);
  });

  it("is not running as a role that bypasses RLS", async () => {
    const { rows } = await db.execute<{ bypass: boolean }>(
      sql`select rolbypassrls or rolsuper as bypass from pg_roles where rolname = current_user`,
    );
    expect(rows[0].bypass).toBe(false);
  });
});
```

The last test looks paranoid, but it's the one that guards the other three.

## Checklist

- [ ] Every tenant-owned table has `tenant_id NOT NULL`, with indexes leading on it
- [ ] `ENABLE` **and** `FORCE ROW LEVEL SECURITY` on each of those tables
- [ ] Policies have both `USING` and `WITH CHECK`, and handle the empty-string case with `nullif`
- [ ] Tenant context is set with `set_config(..., true)` inside a transaction
- [ ] The tenant comes from the verified token, never from client input
- [ ] The app connects as a non-owner role without `BYPASSRLS`; read-only services use a read-only role
- [ ] Uniqueness and foreign keys include `tenant_id`
- [ ] Views use `security_invoker`, and `SECURITY DEFINER` functions are audited
- [ ] Integration tests run as the app role and assert cross-tenant reads and writes fail

## Try it

Everything above is packaged as a runnable, MIT-licensed starter with 20 isolation tests: [fastify-drizzle-rls-starter](https://github.com/MohdZaid259/fastify-drizzle-rls-starter). Clone it, run `npm test`, then switch the connection to a superuser and watch the isolation tests fail.

RLS doesn't replace authorization in your API. Whether a user can *do* something is still your code's job. What it removes is the most dangerous class of multi-tenant bug: one forgotten `WHERE` clause.
