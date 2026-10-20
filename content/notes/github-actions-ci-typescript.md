---
title: "\"Just re-run it, it's flaky\" is how bugs reach production"
description: "A CI pipeline is only useful if green means safe and it's fast enough that nobody skips it. Here's the GitHub Actions setup that does both."
date: 2026-10-08
tags: ["DevOps"]
draft: true
---

"CI is red." *"Oh, that test is flaky. Just re-run it."* Green. Merged.

The moment that becomes normal, your pipeline stops answering "is this safe to merge?". It becomes a slot machine you pull until it pays out. And one day, the red everyone ignored was real.

A good pipeline needs two things: **green means safe**, and **it's fast enough that nobody skips it**.

## Cheapest checks first

Fail a typo in 30 seconds, not after a 5-minute test suite:

1. Install (cached)
2. Typecheck
3. Lint
4. Test, against a **real** database
5. Build

## The workflow

```yaml
on: [pull_request]

concurrency:                     # new push? cancel the outdated run
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 15          # a hung test can't burn 6 hours
    services:
      postgres:
        image: postgres:16-alpine
        env: { POSTGRES_PASSWORD: postgres }
        ports: ["5432:5432"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run typecheck && npm run lint
      - run: npm run db:migrate && npm test
      - run: npm run build
```

## "Can't we just mock the database?"

You can. Your tests will be fast and green, and miss exactly the bugs that hurt: a migration that fails on real data, a forgotten unique constraint.

A Postgres container adds about **10 seconds**. It's the cheapest insurance you'll ever buy.

## Fail with instructions

Don't just fail. Tell people how to fix it:

```yaml
- run: |
    npx drizzle-kit generate
    test -z "$(git status --porcelain drizzle)" || { echo "::error::Schema changed without a migration. Run: npm run db:generate"; exit 1; }
```

Thirty seconds of YAML saves every future teammate a log dive.

## Deploys without stored passwords

Use **GitHub Environments**: per-environment secrets, plus a required reviewer before production. Then log in to the cloud with **OIDC** (`azure/login` with `id-token: write`) instead of a stored service-principal secret. There's nothing long-lived left to leak.

## The human part

- **Fix or delete a flaky test the day it flakes.**
- **Make checks required** on `main`.
- **Watch the clock.** Past 10 minutes, people start working around CI.

---

None of this is clever, and that's the point. Done consistently, "is it safe to merge?" becomes a question the robot answers.
