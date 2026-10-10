---
title: "CI/CD for TypeScript services with GitHub Actions: a setup that stays fast"
description: "Typecheck, lint, test against a real database, build, and deploy per environment, with caching, concurrency limits, path filters for multi-service repos and approval gates for production."
date: 2026-10-08
tags: ["DevOps", "GitHub Actions", "CI/CD", "Docker", "TypeScript"]
draft: true
---

A CI pipeline earns its keep when people trust it: when it's green, the code works, and it's fast enough that nobody is tempted to skip it. Here's the structure I use for TypeScript services, from a single API up to a repo with several services.

## The order of checks

Run the cheapest checks first, so a typo fails in 30 seconds rather than 5 minutes:

1. **Install** (cached)
2. **Typecheck**: `tsc --noEmit`
3. **Lint**
4. **Test**, against a real database in a service container
5. **Build**: compile or build the Docker image
6. **Deploy**, only from `main` or release branches, per environment

## The CI workflow

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

# A new push to the same branch cancels the run that's now outdated
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: postgres
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 2s
          --health-retries 30

    env:
      DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run db:migrate
      - run: npm test
      - run: npm run build
```

A few choices worth explaining:

- **`concurrency` with `cancel-in-progress`.** Pushing three commits in a row runs CI once, not three times.
- **`timeout-minutes`.** A hung test shouldn't burn six hours of runner time, which is the default limit.
- **A real Postgres, not mocks.** Migrations, constraints and query behavior are exactly what mocks can't test. A service container adds about 10 seconds.
- **`cache: npm`** on `setup-node` caches the npm download cache, keyed on the lockfile. `npm ci` then installs mostly from cache.

## Tests that match production

The database in CI should behave like the one in production:

- Same **major version** (`postgres:16` in both).
- Run **migrations** in CI exactly as you do on deploy, not a schema dump.
- Connect as the **same kind of role** the app uses in production. If production relies on grants or Row-Level Security, tests running as a superuser will pass while production fails (more on that in [Multi-tenant isolation with Row-Level Security](/notes/postgres-rls-multi-tenancy)).

## Multi-service repos: only test what changed

In a repo with several services, running everything on every change gets slow. Path filters keep each workflow scoped:

```yaml
on:
  pull_request:
    paths:
      - "services/api/**"
      - "packages/shared/**"   # shared code affects this service too
      - ".github/workflows/api.yml"
```

Give each service its own workflow file with its own paths. Include shared packages in every service that depends on them, or a change to shared code merges untested.

## Deploying per environment

Keep deployment in a separate workflow (or job) that runs only after CI passes on `main`, and use **GitHub Environments** for configuration and approvals:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}   # resolved from the "staging" environment

  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production   # configure "required reviewers" on this environment
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}   # same name, production value
```

What Environments give you:

- **Secrets with the same name and different values per environment.** The deploy script doesn't need `if staging … else …`.
- **Required reviewers** on `production`. The job pauses until someone approves, with a record of who did.
- **Deployment history** in the repo's sidebar, per environment.

## Building Docker images in CI

If you ship containers, build them once and promote the same image through environments. Rebuilding for production can produce a different image.

- Tag images with the **commit SHA** (`api:3f2c1ab`), and optionally also `staging` / `production` pointers.
- Use **multi-stage Dockerfiles**: install and build in one stage, copy only `dist/` and production `node_modules` into a slim runtime stage.
- Cache layers in CI (`docker/build-push-action` with `cache-from` / `cache-to: type=gha`), so unchanged dependency layers aren't rebuilt.

## Keeping it trustworthy

- **Flaky tests get fixed or deleted the day they flake.** A pipeline that's "usually green" trains people to re-run instead of read.
- **Required checks** on the `main` branch protection rule, so a red pipeline can't be merged around.
- **Fail with a message.** A step like "migrations missing for schema change" with the exact command to fix it saves everyone a log dive:

```yaml
- name: Check migrations match the schema
  run: |
    npx drizzle-kit generate
    if [ -n "$(git status --porcelain drizzle)" ]; then
      echo "Schema changed without a migration. Run: npm run db:generate"
      exit 1
    fi
```

## Checklist

- [ ] Cheap checks first: typecheck and lint before tests
- [ ] `concurrency` cancels superseded runs; jobs have timeouts
- [ ] Tests run against a real database, migrated the same way production is
- [ ] Path filters per service in multi-service repos, including shared packages
- [ ] Deploys use Environments: scoped secrets, and approvals for production
- [ ] Images are built once, tagged by commit, and promoted
- [ ] Required status checks protect `main`

None of this is clever. Done consistently, it makes "is it safe to merge?" a question the pipeline answers, not a person.
