---
title: "The WHERE clause you'll forget: multi-tenant isolation with Postgres Row-Level Security"
description: "Every multi-tenant app is one missing filter away from showing one customer another customer's data. Here's how I let PostgreSQL enforce tenant isolation instead, with Fastify and Drizzle, and the traps that quietly switch it off."
date: 2026-10-11
tags: ["Backend", "Security"]
draft: false
---

Picture a Friday evening. A customer emails support: *"Why can I see candidates from a company I've never heard of?"*

Someone digs in and finds it fast. A new export endpoint shipped on Wednesday. It was reviewed, tested, and it worked perfectly, except that it fetched rows by `job_id` and never checked which tenant the job belonged to. One missing `WHERE tenant_id = ?`. That's all it takes.

The scary part isn't that someone made a mistake. It's that the mistake was **invisible**. Code review is great at spotting what's wrong in the code in front of you. It's terrible at spotting what isn't there.

If your SaaS keeps every customer's data in shared tables (and most do, because it's the cheapest model to run), your isolation is only as strong as the most tired developer on the most rushed day. I'd rather it were as strong as the database.

That's what PostgreSQL Row-Level Security (RLS) gives you. You write the rule once, and Postgres enforces it on every query from your application, including the ones nobody has written yet.

This is the setup I use on a multi-service platform built with Fastify, Drizzle and Postgres, plus the gotchas that switch RLS off without telling you.

## Why "just be careful" doesn't scale

The usual approach looks harmless:

```ts
const rows = await db
  .select()
  .from(candidates)
  .where(and(eq(candidates.tenantId, req.tenantId), eq(candidates.jobId, jobId)));
```

Now multiply that by every query in every service, every developer, every hotfix and every script someone writes to "quickly check something in prod". You aren't writing one security rule; you're writing it hundreds of times and hoping each copy is right.

Helpers help: a `tenantScoped()` wrapper, a lint rule, a custom repository layer. But they all share the same weakness: they're opt-in. The query that bypasses the helper is exactly the one that leaks.

RLS flips the default. Without the right tenant context, the database returns **nothing**, not everything.

## The mental model

Four pieces work together, and you need all four:

1. **Tables** carry a `tenant_id` and have RLS enabled *and forced*.
2. **Policies** compare each row's `tenant_id` to a setting called `app.tenant_id`.
3. **The API** sets `app.tenant_id` at the start of every transaction, taken from the user's verified token.
4. **Database roles** make sure your app connects as a user that RLS actually applies to.

Skip any one of these and you get the *feeling* of isolation without the guarantee, which is arguably worse than having none, because now you've stopped worrying.

## Step 1: Put the tenant first in your schema

Every tenant-owned table gets a non-null `tenant_id`, and the indexes **lead** with it. Every query is about to be filtered by tenant, so that's the first column your indexes need.

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
    // Unique per tenant, not globally (more on why below)
    uniqueIndex("candidates_tenant_email_uq").on(t.tenantId, t.email),
    index("candidates_tenant_created_idx").on(t.tenantId, t.createdAt),
  ],
);
```

## Step 2: Turn it on, and turn it on properly

This goes in a migration:

```sql
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON candidates
  USING      (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid);
```

Five lines, and almost every word is doing a job:

- **`ENABLE`** switches RLS on. If RLS is enabled and no policy matches, the default is *deny*.
- **`FORCE`** is the one people skip. Without it, the **table owner bypasses every policy**. The role that runs your migrations usually owns the tables, and in a surprising number of setups the app connects as that same role. Your policies exist, your tests pass, and none of it applies.
- **`USING`** decides which existing rows are visible to `SELECT`, `UPDATE` and `DELETE`.
- **`WITH CHECK`** validates rows being written. It's what stops an `INSERT` into another tenant, and an `UPDATE` that quietly moves a row to someone else.
- **`current_setting('app.tenant_id', true)`**: the `true` means "give me NULL if this isn't set, don't throw".

### The `nullif` that saves your Monday

That `nullif(..., '')` looks like paranoia. It isn't.

Once a custom setting like `app.tenant_id` has been set on a connection, even transaction-locally, later transactions on that same connection don't see NULL. They see an **empty string**. And `''::uuid` doesn't return NULL; it throws `invalid input syntax for type uuid`.

So without `nullif`, the first time a pooled connection is reused without tenant context, you get a crash instead of an empty result. With it, "no tenant" becomes NULL, `tenant_id = NULL` is never true, and the query safely returns zero rows.

That's the behavior you want: **no context means no data.** Not an error page, and definitely not all the data.

## Step 3: Set the tenant per transaction (not per connection)

This is where most homegrown RLS setups leak.

Your API uses a connection pool. If you run a session-level `SET app.tenant_id = '...'`, that value **stays on the connection** after it's returned to the pool. The next request that borrows the connection, possibly from a different tenant, inherits it. You've rebuilt the bug RLS was meant to prevent, just one layer deeper.

The fix is to make the setting transaction-local with `set_config(name, value, is_local => true)`. As a bonus, `set_config` accepts bind parameters, which `SET LOCAL` doesn't:

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

When the transaction ends, the setting is gone. It also plays nicely with PgBouncer in transaction-pooling mode.

One subtle thing: outside an explicit transaction, every statement is its own transaction. A local `set_config` would vanish before your next query even ran. That's why the helper always opens one.

### Where the tenant comes from matters more than anything else

The tenant ID must come from something the client **can't forge**: a claim in a verified access token, or a server-side lookup keyed on the authenticated user.

Never read it from a request header or body the client controls. If you do, RLS faithfully isolates tenants... from everyone except an attacker who changes one header.

```ts
// routes/candidates.ts
app.get("/candidates", async (req) => {
  // req.auth is populated by the auth hook after the JWT signature is verified
  return withTenant(req.auth.tenantId, (tx) =>
    tx.select().from(candidates).orderBy(desc(candidates.createdAt)).limit(50),
  );
});
```

Look at what's missing: there's no tenant filter in that query at all. You can still add one as defense in depth (it also helps the query planner), but correctness no longer depends on someone remembering it.

## Step 4: Make sure RLS actually applies to you

Here's the part that catches experienced people: **superusers and roles with `BYPASSRLS` skip every policy.** If your app connects as `postgres`, as many Docker setups and tutorials do, everything above is decoration.

A minimal, sane role split:

```sql
-- Owns tables, runs migrations. The app never logs in as this.
CREATE ROLE app_owner NOLOGIN;

-- What the API uses for reads and writes
CREATE ROLE app_rw LOGIN PASSWORD '...' NOBYPASSRLS;

-- Read-only services, reporting, dashboards
CREATE ROLE app_ro LOGIN PASSWORD '...' NOBYPASSRLS;
ALTER ROLE app_ro SET default_transaction_read_only = on;

GRANT USAGE ON SCHEMA public TO app_rw, app_ro;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_rw;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_ro;
```

The read-only role gets two independent locks: it *can't* write because of its grants, and it *won't* because its transactions are read-only by default. Belt and braces.

### What about support staff and admin tools?

Sooner or later someone asks, "how does support look at a customer's account?" Resist the urge to hand your admin panel the owner credentials. Give support its own role and an explicit, read-only policy:

```sql
CREATE ROLE support_ro LOGIN PASSWORD '...' NOBYPASSRLS;
GRANT SELECT ON candidates TO support_ro;

-- Policies are OR'ed together, so this adds visibility for this role only
CREATE POLICY support_read_all ON candidates FOR SELECT TO support_ro USING (true);
```

Now cross-tenant access is a deliberate, auditable decision with a name, not an accident.

## The traps that switch RLS off quietly

These deserve a slow read, because none of them produces an error.

### 1. Tests that pass for the wrong reason

If your test database user is a superuser, every RLS test passes, because the policies never run. You'll feel great right up until production. **Run integration tests as the same role your app uses.** Better still, write a test that asserts the current role can't bypass RLS (there's one at the end).

### 2. Views run as their owner

By default, a view executes with its *owner's* privileges, not the caller's. On PostgreSQL 15+, create views with `WITH (security_invoker = true)` so the caller's role and policies apply.

### 3. `SECURITY DEFINER` functions

Same story: they run as the function's owner. Keep them rare, and filter explicitly inside them.

### 4. Global unique constraints leak

Say `email` is unique across the whole table. Tenant B tries to add `jane@acme.com`, gets a duplicate-key error, and now knows tenant A has a candidate called Jane. RLS hid the row; the constraint gave it away. Make uniqueness per tenant: `UNIQUE (tenant_id, email)`.

### 5. Foreign keys ignore RLS entirely

This one surprises almost everyone. **Referential integrity checks bypass row security.** If a client sends a `job_id` that belongs to another tenant, a normal foreign key happily accepts it, and you've just linked tenant B's application to tenant A's job.

The fix is to make the reference carry the tenant:

```sql
ALTER TABLE jobs ADD CONSTRAINT jobs_tenant_id_id_uq UNIQUE (tenant_id, id);

ALTER TABLE applications
  ADD CONSTRAINT applications_job_fk
  FOREIGN KEY (tenant_id, job_id) REFERENCES jobs (tenant_id, id);
```

Now the database itself refuses cross-tenant links, no matter what the API sends.

### 6. Background jobs with no tenant

Your queue worker isn't handling an HTTP request, so there's no token. Put the tenant ID in the job payload when your server enqueues it (that payload is server-created, so it's trustworthy), and have the worker call `withTenant` like any route. A worker with no context will see nothing, which is noisy but safe.

## "Won't this be slow?"

Mostly, no. The policy adds a `tenant_id = ...` predicate to every query, and with indexes that lead on `tenant_id`, that's what you'd have written anyway. Run `EXPLAIN` on a hot query and you'll see the policy condition right there in the plan.

Where it *can* hurt is a policy that runs a subquery for each row, like "is this user a member of this tenant?". Wrap lookups like that in `(select ...)` so Postgres evaluates them once per query instead of once per row.

## Moving an existing app over

You don't need a big-bang migration:

1. Move the app off the owner/superuser role first. This is often the hardest step, because something always turns out to depend on it.
2. Add `withTenant` and route all tenant-scoped queries through it. Keep your existing `WHERE` clauses for now.
3. Enable RLS table by table in staging, starting with the most sensitive data, and let the test suite tell you what breaks.
4. Once a table is stable, `FORCE` it, and fix uniques and foreign keys to include `tenant_id`.

## Prove it with tests

Run these as the app role, against a real Postgres:

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
    ).rejects.toThrow();
  });

  it("returns nothing without tenant context", async () => {
    expect(await db.select().from(candidates)).toHaveLength(0);
  });

  it("is not running as a role that bypasses RLS", async () => {
    const { rows } = await db.execute<{ bypass: boolean }>(
      sql`select rolbypassrls or rolsuper as bypass from pg_roles where rolname = current_user`,
    );
    expect(rows[0].bypass).toBe(false);
  });
});
```

That last test looks paranoid. It's the one that keeps the other three honest.

## The short version

- [ ] Every tenant table has `tenant_id NOT NULL`, indexes lead on it
- [ ] `ENABLE` **and** `FORCE ROW LEVEL SECURITY`
- [ ] Policies have both `USING` and `WITH CHECK`, with the `nullif` fix
- [ ] Tenant set with `set_config(..., true)` inside a transaction
- [ ] Tenant comes from the verified token, never from client input
- [ ] App connects as a non-owner role without `BYPASSRLS`
- [ ] Uniques and foreign keys include `tenant_id`
- [ ] Views use `security_invoker`; `SECURITY DEFINER` is rare and audited
- [ ] Tests run as the app role and assert cross-tenant access fails

RLS won't replace authorization in your API. Whether a user may *do* something is still your code's job. What it removes is the most dangerous bug in multi-tenant software: the `WHERE` clause that someone, someday, will forget.
