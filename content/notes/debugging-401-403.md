---
title: "Debugging 401 and 403 end to end: browser, gateway, API, database"
description: "A layer-by-layer method for auth errors in a distributed app with Azure Entra ID: what each status really means, where it actually came from, and the checks that find the cause in minutes."
date: 2026-10-10
tags: ["Auth", "Azure Entra", "CORS", "Fastify", "Debugging"]
draft: true
---

"I'm getting a 401" is one of the least useful bug reports in a distributed system. In a typical setup, a request passes through:

1. the browser and its CORS rules,
2. the identity provider that issued the token (Azure Entra ID here),
3. an API gateway,
4. the service that validates the token and authorizes the action,
5. the database, which may have its own permissions and row-level security.

Any of them can be the reason the user sees an error, and several of them *report* the problem somewhere other than where it happened. This note is the method I use to find the real layer quickly.

## First, be precise about the status

- **401 Unauthorized** really means *unauthenticated*: "I don't know who you are." The token is missing, malformed, expired, signed by the wrong key, or issued for a different audience. The fix is on the token side.
- **403 Forbidden** means *authenticated but not allowed*: "I know who you are, and you can't do this." The token is valid. The fix is in roles, scopes or authorization logic.
- **A CORS error in the console** often isn't about CORS at all. It can be a 401 or 500 that came back without CORS headers (more below).
- **An empty list or a 404** for something that exists can be row-level security working as designed, with the wrong tenant context.

Getting this first classification right halves the search space.

## Step 1: take the browser out of the equation

Copy the exact token the frontend sends, from the request's `Authorization` header in DevTools → Network, and replay the call with curl:

```bash
curl -i https://api.example.com/v1/me -H "Authorization: Bearer $TOKEN"
```

- **curl works but the browser fails:** the problem is browser-side. That means CORS, how the frontend attaches the header, or which token it requested.
- **curl fails too:** the problem is the token or the server. Keep going.

## Step 2: read the token

Decode the payload. It's base64url, not encrypted. You don't need a website for this, and you shouldn't paste production tokens into one:

```bash
node -e "console.log(JSON.parse(Buffer.from(process.argv[1].split('.')[1], 'base64url')))" "$TOKEN"
```

Check these claims against what your API expects:

| Claim | What to check | Typical mistake |
| --- | --- | --- |
| `aud` | Your API's client ID or App ID URI | Token was issued for Microsoft Graph, not your API |
| `iss` | Matches the issuer your API validates | v1 vs v2 token mismatch |
| `exp` / `nbf` | Current time is inside the window | Expired token cached in the frontend; server clock skew |
| `tid` | Expected Entra tenant | User signed in to a different directory |
| `scp` | Delegated scopes, e.g. `access_as_user` | Scope never requested or never consented |
| `roles` | App roles assigned to the user or app | Role defined but not assigned |

### The two Entra mistakes behind most 401s

**Requesting the wrong scope.** If the frontend asks for `User.Read`, it gets a token for Microsoft Graph (`aud` is Graph), and your API correctly rejects it. Request your API's own scope, e.g. `api://<api-client-id>/access_as_user`, when acquiring the token you send to your API.

**v1 vs v2 tokens.** The token version follows the *API's* app registration (`accessTokenAcceptedVersion` in its manifest), not the client's. The two versions have different issuers:

- v1: `https://sts.windows.net/<tenant-id>/`
- v2: `https://login.microsoftonline.com/<tenant-id>/v2.0`

They also usually have different audience formats: the App ID URI in v1, the client ID GUID in v2. Validate against the version you actually receive. Pinning the version in the manifest is better than accepting both.

## Step 3: make the API say *why*

A bare `401` with no body costs everyone time. Validate the token in one place, log the specific reason on the server, and return a standard `WWW-Authenticate` header (RFC 6750):

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
    // The exact reason (expired, bad audience, unknown kid...) stays in your logs
    req.log.warn({ err, reqId: req.id }, "access token rejected");
    return reply
      .code(401)
      .header("WWW-Authenticate", 'Bearer error="invalid_token"')
      .send({ error: "invalid_token" });
  }
});
```

`createRemoteJWKSet` caches the signing keys and refetches when it sees an unknown `kid`, so Entra's key rotation doesn't turn into a wave of 401s.

Keep **authorization separate** and make it return 403 with an equally clear reason:

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

## Step 4: the gateway can lie to you

If a service behind a gateway or reverse proxy rejects a token that curl proves is valid, look at what the gateway forwards:

- **Is `Authorization` forwarded at all?** Some proxies strip it, or move it to a different header after doing their own validation.
- **Do the gateway and the service expect the same audience and issuer?** A gateway configured for v1 in front of a service expecting v2 produces errors that bounce between layers.
- **Header size.** Tokens with many claims can exceed proxy header limits. You'll see `400` or `431` before your service ever runs.
- **Path rewriting.** `/api/v1/jobs` at the edge becomes `/v1/jobs` at the service. An authorization rule keyed on the original path then never matches.

The single most useful thing here is a **correlation ID**. Generate it at the edge, forward it as a header through every hop, and log it everywhere. Then "a 401 at 14:02" turns into one search across gateway and service logs.

## Step 5: when "CORS error" is really an auth error

The browser enforces CORS on the *response*. If your API, or the gateway in front of it, returns a 401 or 500 **without** `Access-Control-Allow-Origin`, the browser hides the status from your JavaScript and reports a CORS failure instead. The console points at CORS while the real cause is an expired token.

Check, in order:

1. **The preflight.** The `OPTIONS` request has no `Authorization` header. If your auth runs before CORS handling and rejects it, every real request fails. Let `OPTIONS` through (as in the hook above).
2. **Allowed headers.** Sending `Authorization` or a custom header like `X-Tenant-Id` requires them in `Access-Control-Allow-Headers`.
3. **Credentials.** With `credentials: "include"`, `Access-Control-Allow-Origin: *` is invalid. Echo the specific allowed origin.
4. **Error responses.** Make sure CORS headers are added to 4xx and 5xx responses too, not just successful ones, so the frontend can see the real status.

## Step 6: the database layer doesn't speak HTTP

Databases don't return 403. They fail in ways your API translates:

- **`permission denied for table ...`** (SQLSTATE `42501`): the database role lacks a grant. That's a server misconfiguration, so return **500** and alert, not 403. Telling the client "forbidden" sends everyone looking at user roles.
- **Row-level security** doesn't error on reads. It returns fewer rows. A missing or wrong tenant context shows up as an empty list or a 404, which looks like a data bug. Log the tenant your API set for the transaction alongside the request ID.
- **RLS on writes** does error: `new row violates row-level security policy`. That usually means the tenant from the token and the tenant in the payload disagree, which is a real authorization failure. A 403 is reasonable there.

(I wrote up the RLS side in detail in [Multi-tenant isolation with PostgreSQL Row-Level Security](/notes/postgres-rls-multi-tenancy).)

## Symptom → layer cheat sheet

| What you see | Most likely layer | First check |
| --- | --- | --- |
| CORS error in console, request has a status in Network tab | API/gateway error response missing CORS headers | Response headers of the failing call |
| Preflight `OPTIONS` fails | Auth running before CORS | Let `OPTIONS` skip auth |
| 401, curl also 401 | Token | `aud`, `iss`, `exp` in the decoded token |
| 401 only behind the gateway | Gateway | Is `Authorization` forwarded? Same issuer/audience config? |
| 401 after working for an hour | Token lifetime | Frontend refresh / silent token acquisition |
| 403 with a valid token | Authorization | `roles` / `scp` vs. what the endpoint requires |
| 400 / 431 before reaching the service | Proxy header limits | Token size, claims included |
| Empty list / 404 for data that exists | RLS tenant context | Tenant set for the transaction vs. data's `tenant_id` |
| 500 with `42501` in logs | DB grants | Role privileges after the last migration |

## What I'd set up on day one

- One auth hook per service that logs the *reason* for every rejection, keyed by request ID.
- A correlation ID that flows from the edge to the database logs.
- CORS headers on error responses, not just successful ones.
- A `/v1/me` endpoint that returns the claims the API saw: the fastest debugging tool there is. (Behind auth, and never in a public response for tokens that contain sensitive claims.)

With those in place, most auth errors become: read the log line, fix the one thing it names.
