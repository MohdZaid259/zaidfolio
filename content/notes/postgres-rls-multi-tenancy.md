---
title: "One missing WHERE clause away from a data leak"
description: "Every multi-tenant app trusts developers to remember tenant_id on every query. Here's how to make Postgres enforce it instead, in about 15 lines of SQL."
date: 2026-10-11
tags: ["Backend", "Security"]
draft: false
---

A customer emails support: *"Why can I see candidates from a company I've never heard of?"*

The cause takes five minutes to find. A new endpoint fetched rows by `job_id` and forgot `WHERE tenant_id = ?`. It passed review, because **nobody reviews code that isn't there**.

If your SaaS keeps every customer in the same tables, your isolation is only as strong as your most tired developer. I'd rather it were as strong as the database.

## Let Postgres say no

Row-Level Security (RLS) moves the rule into the database. Write it once, and it applies to every query, including the ones nobody has written yet.

```sql
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON candidates
  USING      (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid);
```

- **`FORCE`**: without it, the table owner skips every policy. The owner is often the very role your app connects as.
- **`WITH CHECK`**: stops writes into another tenant, not just reads.
- **`nullif(..., '')`**: on a reused pooled connection, an unset value comes back as `''`, not NULL, and `''::uuid` crashes. This turns "no tenant" into "no rows".

## Set the tenant per transaction, not per connection

This is where most setups quietly leak. A plain `SET` sticks to the pooled connection, and the next request inherits someone else's tenant.

```ts
export function withTenant<T>(tenantId: string, fn: (tx: Tx) => Promise<T>) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.tenant_id', ${tenantId}, true)`);
    return fn(tx);
  });
}
```

That `true` means "this transaction only". Gone the moment it commits.

And take the tenant from the **verified token**, never from a header the client controls.

## The traps nobody warns you about

1. **Superusers bypass RLS.** If your app connects as `postgres`, none of this runs. Use a role without `BYPASSRLS`.
2. **Your tests lie.** A superuser test database passes every isolation test. Run tests as the app's role.
3. **Foreign keys ignore RLS.** Tenant B can link to tenant A's row if it knows the ID. Make references `(tenant_id, id)`.
4. **Global unique constraints leak.** "Email already exists" tells tenant B that tenant A has that customer. Make them `UNIQUE (tenant_id, email)`.

## One test to keep everyone honest

```ts
it("cannot bypass RLS", async () => {
  const { rows } = await db.execute(
    sql`select rolsuper or rolbypassrls as bypass from pg_roles where rolname = current_user`,
  );
  expect(rows[0].bypass).toBe(false);
});
```

It looks paranoid. It's the one that proves every other test means something.

---

RLS won't decide what a user may *do*; that's still your code's job. What it removes is the scariest bug in multi-tenant software: the `WHERE` clause someone, someday, will forget.
