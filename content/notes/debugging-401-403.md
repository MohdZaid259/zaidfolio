---
title: "\"It says 401\": a field guide to debugging auth from browser to database"
description: "In a distributed app, an auth error can start in five places and show up in a sixth. A calm, layer-by-layer method for 401s, 403s and fake CORS errors with Azure Entra ID, plus the logging that turns hour-long hunts into five-minute fixes."
date: 2026-9-10
tags: ["Security"]
draft: true
---

"I'm getting a 401."

Few messages in a team chat carry less information. It's like a patient saying "it hurts". True, important, and almost no help in deciding where to look.

In a modern app, one click travels through a surprising number of places before it reaches your data:

1. the **browser**, with its CORS rules,
2. the **identity provider** that issued the token (Azure Entra ID, in my case),
3. an **API gateway** or reverse proxy,
4. the **service** that validates the token and decides what you're allowed to do,
5. the **database**, which may have its own permissions and row-level security.

Any of them can reject the request. Worse, several of them *report* the failure somewhere other than where it happened. The browser blames CORS for an expired token. The service blames the token for a gateway that dropped a header. The database returns an empty list and everyone suspects a data bug.

After enough of these hunts, I stopped guessing and started following a method. Here it is.

## First, the vocabulary (it really matters)

Two status codes, constantly confused:

- **401 Unauthorized** is badly named. It really means **unauthenticated**: "I don't know who you are." The token is missing, malformed, expired, signed with the wrong key, or issued for someone else. *Fix it on the token side.*
- **403 Forbidden** means **authenticated but not allowed**: "I know exactly who you are, and you can't do this." The token is fine. *Fix it in roles, scopes or business rules.*

And two impostors:

- **A CORS error in the console** is often not a CORS problem. It's frequently a 401 or 500 that came back *without CORS headers*, so the browser hid the real status from your JavaScript.
- **An empty list or a 404** for something that definitely exists can be row-level security doing its job with the wrong tenant context.

Getting this first classification right cuts the search space in half before you open a single log.

## Step 1: Take the browser out of the picture

The browser is the noisiest layer, so remove it first.

Open DevTools → Network, find the failing request, copy the exact `Authorization` header, and replay the call from your terminal:

```bash
curl -i https://api.example.com/v1/me -H "Authorization: Bearer $TOKEN"
```

This one command splits the world in two:

- **curl works, browser fails** → the problem lives in the browser: CORS, how the frontend attaches the header, or *which* token it requested.
- **curl fails too** → the browser is innocent. The problem is the token, the gateway or the service. Keep going.

It takes ten seconds, and it's the single most useful thing on this page.

## Step 2: Actually read the token

A JWT isn't encrypted; it's just base64url-encoded JSON. You can read it with a one-liner, and you should, rather than pasting production tokens into a random website:

```bash
node -e "console.log(JSON.parse(Buffer.from(process.argv[1].split('.')[1], 'base64url')))" "$TOKEN"
```

Now compare what's inside with what your API expects:

| Claim | What to check | The classic mistake |
| --- | --- | --- |
| `aud` | Your API's client ID or App ID URI | The token was issued for Microsoft Graph, not your API |
| `iss` | Matches the issuer your API validates | v1 vs v2 token mismatch |
| `exp` / `nbf` | "Now" falls inside the window | A stale token cached in the frontend; clock skew |
| `tid` | The Entra tenant you expect | User signed in to a different directory |
| `scp` | Delegated scopes, e.g. `access_as_user` | Scope never requested, or never consented |
| `roles` | App roles assigned to the user | Role defined in the app registration, never assigned |

Nine times out of ten, the answer is sitting right there in the token.

### The two Entra mistakes behind most 401s

**Mistake one: asking for the wrong token.** The frontend calls something like:

```ts
const result = await msal.acquireTokenSilent({ scopes: ["User.Read"], account });
```

That returns a perfectly valid token... **for Microsoft Graph**. Its `aud` is Graph, and your API is right to reject it. The fix is to request your own API's scope when getting the token you send to your API:

```ts
const result = await msal.acquireTokenSilent({
  scopes: ["api://<your-api-client-id>/access_as_user"],
  account,
});
```

**Mistake two: v1 vs v2 tokens.** This one is sneaky, because the token version is decided by the *API's* app registration (`accessTokenAcceptedVersion` in its manifest), not the client's. The two versions carry different issuers:

- v1: `https://sts.windows.net/<tenant-id>/`
- v2: `https://login.microsoftonline.com/<tenant-id>/v2.0`

They usually differ in audience format too: the App ID URI in v1, the client ID GUID in v2. If your validator expects one and receives the other, every request fails with a perfectly reasonable-looking token. Pin the version in the manifest and validate exactly that.

## Step 3: Make your API say *why*

A bare `401` with an empty body helps nobody, and the person debugging it at 2 a.m. might be you.

Validate tokens in one place, log the **specific** reason server-side, and return a standard `WWW-Authenticate` header (RFC 6750) so clients know what kind of failure it was:

```ts
// plugins/auth.ts
import { createRemoteJWKSet, jwtVerify } from "jose";

const TENANT = process.env.ENTRA_TENANT_ID!;
const JWKS = createRemoteJWKSet(
  new URL(`https://login.microsoftonline.com/${TENANT}/discovery/v2.0/keys`),
);

app.addHook("onRequest", async (req, reply) => {
  // CORS preflights never carry credentials; let them through
  if (req.method === "OPTIONS") return;

  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return reply.code(401).header("WWW-Authenticate", "Bearer").send({ error: "missing_token" });
  }

  try {
    const { payload } = await jwtVerify(header.slice(7), JWKS, {
      issuer: `https://login.microsoftonline.com/${TENANT}/v2.0`,
      audience: process.env.API_CLIENT_ID,
      clockTolerance: 60, // seconds of allowed clock skew
    });
    req.auth = payload;
  } catch (err) {
    // The exact reason (expired, wrong audience, unknown key...) stays in your logs
    req.log.warn({ err, reqId: req.id }, "access token rejected");
    return reply
      .code(401)
      .header("WWW-Authenticate", 'Bearer error="invalid_token"')
      .send({ error: "invalid_token" });
  }
});
```

Two small things here prevent big outages:

- `createRemoteJWKSet` caches Entra's signing keys and refetches when it sees an unknown key ID. Key rotation then happens without a wave of mysterious 401s.
- `clockTolerance` absorbs the few seconds of drift between your servers and Microsoft's. Without it, freshly issued tokens can be "not yet valid".

Keep **authorization** separate, and make it just as clear when it fails:

```ts
const requireRole = (role: string) => async (req, reply) => {
  const roles = (req.auth.roles as string[] | undefined) ?? [];
  if (!roles.includes(role)) {
    req.log.info({ role, roles, reqId: req.id }, "forbidden: missing role");
    return reply.code(403).send({ error: "forbidden", required: role });
  }
};

app.delete("/v1/jobs/:id", { preHandler: requireRole("Jobs.Admin") }, deleteJob);
```

Now a 403 tells you which role was missing, and the log tells you which roles the user actually had.

## Step 4: Suspect the gateway

Here's a scenario I've seen in many shapes. curl against the service directly works. The same request through the gateway gets a 401. The token is identical.

When that happens, the gateway is lying to you, or at least changing the request on the way through:

- **Is the `Authorization` header forwarded at all?** Some proxies strip it, or swap it for their own header after validating the token themselves.
- **Do the gateway and the service agree on issuer and audience?** A gateway configured for v1 tokens in front of a service expecting v2 creates errors that bounce between teams for days.
- **Is the token simply too big?** Tokens stuffed with group claims can exceed proxy header limits, and you'll see a `400` or `431` before your service even runs.
- **Is the path being rewritten?** `/api/v1/jobs` at the edge becomes `/v1/jobs` at the service, and an authorization rule keyed on the original path never matches.

The single most valuable thing you can add here is a **correlation ID**. Generate it at the edge, forward it as a header through every hop, and log it everywhere. Then "a 401 at 14:02" stops being archaeology and becomes one search across the gateway and service logs.

## Step 5: When "CORS error" is a costume

Browsers enforce CORS on the *response*. If your API or gateway sends a 401 or 500 **without** `Access-Control-Allow-Origin`, the browser hides the status from your JavaScript and reports a CORS failure instead. The console points at CORS; the real culprit is an expired token wearing a disguise.

Check these, in order:

1. **The preflight.** The `OPTIONS` request has no `Authorization` header. If your auth runs before CORS handling and rejects it, every real request fails. Let `OPTIONS` through (as in the hook above).
2. **Allowed headers.** Sending `Authorization` or a custom header like `X-Tenant-Id` requires listing them in `Access-Control-Allow-Headers`.
3. **Credentials.** With `credentials: "include"`, `Access-Control-Allow-Origin: *` is invalid. Echo the specific allowed origin.
4. **Error responses.** Make sure CORS headers are added to 4xx and 5xx responses too, not only to successful ones. This one change unmasks a huge number of "CORS bugs".

## Step 6: The database doesn't speak HTTP

Databases don't return 403s. They fail in their own ways, which your API then translates:

- **`permission denied for table ...`** (SQLSTATE `42501`) means the database role is missing a grant. That's a deployment bug, so return **500** and alert. Answering "forbidden" sends everyone off to check user roles that were never the problem.
- **Row-level security doesn't error on reads.** It just returns fewer rows. A missing or wrong tenant context shows up as an empty list or a 404, which looks like a data bug. Log the tenant your API set for the transaction next to the request ID.
- **RLS on writes does error:** `new row violates row-level security policy`. That usually means the tenant in the token and the tenant in the payload disagree, which is a genuine authorization failure, so a 403 is fair.

(I wrote up the row-level security side in detail in [The WHERE clause you'll forget](/notes/postgres-rls-multi-tenancy).)

## The cheat sheet I wish I'd had

| What you see | Most likely layer | Check first |
| --- | --- | --- |
| CORS error, but Network tab shows a status | API/gateway error response missing CORS headers | Response headers on the failing call |
| Preflight `OPTIONS` fails | Auth running before CORS | Let `OPTIONS` skip auth |
| 401, and curl is also 401 | The token | `aud`, `iss`, `exp` in the decoded token |
| 401 only behind the gateway | The gateway | Is `Authorization` forwarded? Same issuer/audience? |
| 401 after working for about an hour | Token lifetime | Silent refresh in the frontend |
| 403 with a valid token | Authorization | `roles` / `scp` vs. what the endpoint requires |
| 400 / 431 before reaching the service | Proxy header limits | Token size, claims included |
| Empty list / 404 for existing data | RLS tenant context | Tenant set for the transaction vs. the row's tenant |
| 500 with `42501` in logs | Database grants | Role privileges after the last migration |

## What I'd set up on day one, next time

- **One auth hook per service** that logs the *reason* for every rejection, keyed by request ID.
- **A correlation ID** that flows from the edge all the way to database logs.
- **CORS headers on error responses**, not only on happy paths.
- **A `/v1/me` endpoint** that returns the claims the API actually saw. It's the fastest debugging tool there is. (Keep it behind auth, and don't echo sensitive claims publicly.)

None of this is glamorous. But with it in place, most auth bugs go from "can someone look at this?" to *read the log line, fix the one thing it names.* That's a much better Friday.
