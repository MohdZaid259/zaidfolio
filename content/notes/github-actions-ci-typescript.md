---
title: "A CI pipeline people actually trust: GitHub Actions for TypeScript services"
description: "Green should mean 'safe to merge', and it should get there fast. A practical GitHub Actions setup for TypeScript APIs: check order, real databases in CI, caching, multi-service repos, environment approvals, keyless cloud deploys, and the habits that keep it trustworthy."
date: 2026-10-08
tags: ["DevOps"]
draft: true
---

Every team has had this conversation.

"CI is red." "Oh, that test is flaky, just re-run it." *(re-runs, goes green)* "See? Merging."

The moment that becomes normal, your pipeline has stopped doing its job. It's no longer answering "is this safe to merge?". It's a slot machine you pull until it pays out. And sooner or later, the red that everyone re-ran past was real.

A good CI pipeline has two properties, and they pull against each other:

1. **When it's green, the code works.** People trust it enough not to second-guess it.
2. **It's fast.** Fast enough that nobody is tempted to skip it, batch changes to avoid it, or merge "just this once" without it.

Here's the structure I use for TypeScript services, from a single API up to a repo with several services, and the reasoning behind each choice.

## Order your checks like a funnel

Run the cheapest checks first, so a typo fails in thirty seconds rather than after a five-minute test suite:

1. **Install** (cached)
2. **Typecheck**: `tsc --noEmit`
3. **Lint**
4. **Test**, against a real database
5. **Build**: compile, or build the Docker image
6. **Deploy**, only from `main`, environment by environment

Typecheck and lint take seconds and catch a surprising share of mistakes. There's no reason to spin up a database to discover a missing import.

## The workflow

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

# A newer push to the same branch cancels the now-outdated run
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

It's short, but a few lines carry a lot of weight:

- **`concurrency` with `cancel-in-progress`.** Push three commits in a row and CI runs once, for the latest, not three times in parallel burning minutes on code that's already outdated.
- **`timeout-minutes`.** The default job limit is six hours. One hung test shouldn't be allowed to eat that.
- **`cache: npm`** caches the npm download cache, keyed on your lockfile, so `npm ci` mostly installs from cache.
- **A real Postgres.** More on that next, because it's the line people most want to delete.

## "Can't we just mock the database?"

You can, and your tests will be fast and green, and they'll miss exactly the bugs that hurt in production: a migration that fails on real data, a unique constraint you forgot, a query that behaves differently from how you assumed.

A Postgres service container adds roughly ten seconds to the job, which is about the cheapest insurance you'll ever buy. To make it count:

- **Use the same major version as production.** `postgres:16` in both places.
- **Run migrations in CI exactly as you do on deploy.** Not a schema dump, not `sync()`, the real migration files in order.
- **Connect as the kind of role your app uses in production.** If production relies on grants or row-level security, tests running as a superuser will pass while production fails. (I explain why in [The WHERE clause you'll forget](/notes/postgres-rls-multi-tenancy).)

## Fail with instructions, not just a red X

The most underrated improvement to any pipeline: **when a check fails, tell people how to fix it.**

For example, if someone changes the database schema but forgets to generate a migration, don't let it fail mysteriously three steps later. Catch it explicitly:

```yaml
- name: Check migrations match the schema
  run: |
    npx drizzle-kit generate
    if [ -n "$(git status --porcelain drizzle)" ]; then
      echo "::error::Schema changed without a migration. Run: npm run db:generate"
      exit 1
    fi
```

The `::error::` prefix makes GitHub highlight the message right in the pull request. Thirty seconds of YAML saves every future developer a log dive.

## Several services in one repo

Once a repo holds several services, running everything on every change gets slow and noisy. Path filters keep each workflow focused:

```yaml
on:
  pull_request:
    paths:
      - "services/api/**"
      - "packages/shared/**"   # shared code affects this service too
      - ".github/workflows/api.yml"
```

Give each service its own workflow file with its own paths. The trap to avoid: forgetting that **shared packages belong in every dependent service's paths**. Otherwise a change to shared code merges with none of its consumers tested.

## Deploying: environments, approvals and no stored cloud passwords

Keep deployment separate from CI, triggered only after `main` is green, and use **GitHub Environments**:

```yaml
name: Deploy

on:
  push:
    branches: [main]

permissions:
  id-token: write   # lets the job request an OIDC token for the cloud login below
  contents: read

jobs:
  staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      - run: ./scripts/deploy.sh staging

  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production   # configure "required reviewers" on this environment
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      - run: ./scripts/deploy.sh production
```

What this buys you:

- **Secrets scoped per environment.** Same secret names, different values for staging and production, so the deploy script doesn't need an `if staging ... else ...` tangle.
- **Human approval for production.** With "required reviewers" on the `production` environment, the job pauses until someone approves, and there's a record of who did.
- **No long-lived cloud passwords in GitHub.** With OIDC federation (`id-token: write` plus `azure/login`), the workflow exchanges a short-lived token for cloud access. There's no service-principal secret sitting in your repo settings waiting to leak. AWS and GCP support the same pattern.

## If you ship containers: build once, promote everywhere

Rebuilding the image for production means production runs something staging never tested, and builds aren't always perfectly reproducible.

- **Tag images with the commit SHA** (`api:3f2c1ab`). Point `staging` and `production` tags at whichever SHA is deployed.
- **Use multi-stage Dockerfiles**: install and build in one stage, then copy only `dist/` and production dependencies into a slim runtime image.
- **Cache layers in CI** (`docker/build-push-action` with `cache-from` / `cache-to: type=gha`), so an unchanged dependency layer isn't rebuilt on every push.

## Keeping it trustworthy (the human part)

The YAML is the easy bit. Trust comes from habits:

- **Fix or delete flaky tests the day they flake.** A test that's "usually green" teaches everyone to re-run instead of read, and that habit eventually lets a real failure through.
- **Make checks required** in the branch protection rules for `main`, so red can't be merged around.
- **Watch the clock.** If CI creeps past ten minutes, people start working around it. Treat pipeline speed as a feature with an owner.
- **Keep the pipeline in code review.** Workflow changes deserve the same scrutiny as application code. They hold the keys to production, after all.

## The checklist

- [ ] Cheap checks first: typecheck and lint before tests
- [ ] `concurrency` cancels outdated runs; every job has a timeout
- [ ] Tests run against a real database, migrated the way production is
- [ ] Failures explain how to fix them
- [ ] Path filters per service, including shared packages
- [ ] Deploys use Environments: scoped secrets, approvals for production
- [ ] Cloud access via OIDC, with no stored passwords
- [ ] Images built once, tagged by commit, promoted between environments
- [ ] Flaky tests are fixed immediately; checks are required on `main`

None of this is clever, and that's the point. A pipeline earns trust by being boringly reliable, so "is this safe to merge?" becomes a question the robot answers instead of a person.
