---
title: "\"It says 401.\" Here's where it actually broke."
description: "In a distributed app, an auth error can start in five places and show up in a sixth. A 60-second method to find the real culprit."
date: 2026-10-10
tags: ["Security"]
draft: true
---

"I'm getting a 401" is the auth equivalent of "it hurts". True, urgent, and no help at all deciding where to look.

One click passes through the **browser, identity provider, gateway, API and database**. Any of them can say no, and several of them blame someone else when they do.

Here's the method that turns hours of guessing into minutes.

## 401 vs 403 (they're not the same)

- **401**: "I don't know who you are." Fix the **token**.
- **403**: "I know who you are, and no." Fix **roles or permissions**.
- **"CORS error"**: often a 401 in disguise (more below).

Getting this right halves the search before you open a single log.

## Step 1: remove the browser

Copy the exact token from DevTools and replay the request:

```bash
curl -i https://api.example.com/v1/me -H "Authorization: Bearer $TOKEN"
```

- **curl works, browser fails**: it's CORS or the frontend.
- **curl fails too**: it's the token or the server.

Ten seconds. The single most useful step.

## Step 2: read the token

It's not encrypted; it's base64. Decode it locally (don't paste production tokens into websites):

```bash
node -e "console.log(JSON.parse(Buffer.from(process.argv[1].split('.')[1],'base64url')))" "$TOKEN"
```

Check `aud`, `iss` and `exp`. Nine times out of ten the answer is right there.

**The classic Azure Entra mistake:** the frontend asks for `User.Read` and gets a token for *Microsoft Graph*. Your API rightly rejects it. Request your own API's scope instead: `api://<your-api-id>/access_as_user`.

## Step 3: the CORS costume

If an error response comes back **without** CORS headers, the browser hides the real status and shows "CORS error" instead. The console blames CORS; the real culprit is an expired token.

Fix it once: **add CORS headers to error responses too**, and let `OPTIONS` preflights skip auth.

## Step 4: when only the gateway fails

Same token works directly but fails through the gateway? Then the gateway is changing the request:

- It strips or renames the `Authorization` header
- It expects a different issuer or audience
- The token is too big for its header limit (`400` / `431`)

## Day-one habits

- One auth hook that **logs why** it rejected a request
- A **correlation ID** from the edge all the way to the database
- A `/me` endpoint that shows the claims the API actually received

---

With those in place, most auth bugs go from "can someone look at this?" to *read the log line, fix the one thing it names.*
