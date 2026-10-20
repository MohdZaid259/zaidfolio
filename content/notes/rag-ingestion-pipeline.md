---
title: "Your RAG demo works. Then someone uploads a 240-page PDF."
description: "Chat-with-your-docs is magic with a 2-page file and falls apart with a real one. The fix isn't a better model; it's the boring pipeline around it."
date: 2026-10-09
tags: ["AI", "Backend"]
draft: false
---

Every "chat with your PDF" project has the same magical first afternoon. Upload a two-page doc, ask a question, get the right answer. You show a friend.

Then a real user uploads a 240-page contract.

The request times out at 40 seconds. Or the embeddings API hiccups at chunk 180, leaving half a document in your database. They retry. Now you have **one and a half** copies, and the model starts quoting clauses twice.

None of that is an AI problem. It's plumbing. Here's how I built it in [Docly](/work/docly).

## Split it in two

**Ingestion** runs in the background: upload → queue → process → `ready`.
**Chat** stays fast and only reads documents that are `ready`.

Neither ever waits on the other.

```
Browser ──► S3 ──► queue("ingest") ──► worker: extract → chunk → embed → store → ready
```

## Assume every job runs twice

Queues deliver *at least once*. Workers crash and deploys restart them. So make re-running harmless:

```ts
await ingestQueue.add("ingest", { documentId }, {
  jobId: documentId,                              // same doc twice = one job
  attempts: 5,
  backoff: { type: "exponential", delay: 5_000 }, // ride out rate limits
});

// in the worker: clear old output first, so a retry never duplicates
await deleteChunks(documentId);
```

Three lines, and double-clicks, retries and crashes stop corrupting your data.

## Chunk for answers, not storage

- **Too big** and the one sentence that matters drowns in noise.
- **Too small** and "it shall terminate after 30 days" forgets what "it" is.

Start around **500–800 tokens**, split on paragraphs, with **10–15% overlap**. Keep the page number on every chunk; you'll want it for citations.

## Batch the embeddings

Embedding APIs take arrays. One chunk per request is slow and burns your rate limit. Send 64 at a time, and use **the same model** for documents and questions, or the vectors aren't comparable.

## Teach it to say "I don't know"

This one line matters as much as everything above:

> Answer using ONLY the sources below. If the answer isn't there, say you couldn't find it.

Without it, the model fills gaps from its training data, and sounds exactly as confident as when it's right. On a contract, a confident wrong answer is worse than none.

Add citations like `[2] p.31` so users can check for themselves. Trust comes from being verifiable.

## Before you ship

- [ ] Files go straight to storage, never through your API
- [ ] Jobs are idempotent, retried with backoff, and failures are visible
- [ ] Scanned PDFs with no text are flagged, not silently indexed as empty
- [ ] Deleting a document deletes its vectors too

---

The model call is the easy part. Everything that makes RAG *trustworthy* lives in the boring pipeline around it, and that's the part entirely in your control.
