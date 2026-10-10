---
title: "A RAG ingestion pipeline that doesn't fall over: S3, BullMQ and embeddings"
description: "Why document chat breaks when ingestion runs inside the request, and the queue-based pipeline I used for Docly: presigned uploads, idempotent jobs, chunking, batched embeddings and grounded answers."
date: 2026-10-09
tags: ["AI", "RAG", "BullMQ", "Node.js", "AWS S3"]
draft: true
---

The first version of most "chat with your documents" apps does everything in one request. The file is uploaded to the API, parsed, chunked, embedded and stored while the user waits.

It works in a demo with a two-page PDF. With a 200-page contract it times out, holds a request open for a minute, and if the embeddings API hiccups halfway through, you're left with half a document and no record of what happened.

When I built [Docly](/work/docly), I split the system into two paths that never wait on each other:

- **Ingestion** is asynchronous. Uploads land in object storage, a queue job processes them, and the document's status moves from `uploaded` to `processing` to `ready` (or `failed`).
- **Chat** is synchronous and fast. It only reads documents that are `ready`.

## The shape of it

```
Browser ──(presigned PUT)──► S3
   │
   └─► POST /documents ──► DB row (status: uploaded) ──► queue.add("ingest", { documentId })
                                                                │
                                         Worker ◄───────────────┘
                                           1. download from S3
                                           2. extract text
                                           3. chunk
                                           4. embed in batches
                                           5. store chunks + vectors
                                           6. status: ready
```

The code below is simplified to show the pattern; adapt names and storage to your stack.

## 1. Upload straight to S3

Your API shouldn't proxy file bytes. Give the client a short-lived presigned URL and let it upload directly:

```ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({});

export async function createUpload(userId: string, fileName: string, contentType: string) {
  const key = `uploads/${userId}/${crypto.randomUUID()}-${fileName}`;
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: process.env.BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: 300 },
  );
  return { key, url };
}
```

When the browser reports that the upload finished, the API creates the document row and enqueues the job. The request returns in milliseconds, whatever the file size.

## 2. Make the job idempotent

Queues deliver jobs **at least once**. Workers crash, deploys restart them, and retries happen. Design every step so running it twice is harmless:

```ts
import { Queue, Worker } from "bullmq";

const connection = { url: process.env.REDIS_URL };
export const ingestQueue = new Queue("ingest", { connection });

// jobId = documentId: enqueueing the same document twice is a no-op
await ingestQueue.add(
  "ingest",
  { documentId },
  {
    jobId: documentId,
    attempts: 5,
    backoff: { type: "exponential", delay: 5_000 },
    removeOnComplete: 1_000,
    removeOnFail: 5_000,
  },
);

new Worker(
  "ingest",
  async (job) => {
    const { documentId } = job.data;
    await markStatus(documentId, "processing");
    // Delete partial output from a previous failed attempt before writing again
    await deleteChunks(documentId);
    const text = await extractText(await downloadFromS3(documentId));
    const chunks = chunk(text);
    await embedAndStore(documentId, chunks, (done) => job.updateProgress(Math.round((done / chunks.length) * 100)));
    await markStatus(documentId, "ready");
  },
  { connection, concurrency: 4 },
).on("failed", async (job, err) => {
  if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
    await markStatus(job.data.documentId, "failed", err.message);
  }
});
```

Three details matter here:

- **`jobId: documentId`** deduplicates. A double-click or a client retry doesn't process the file twice.
- **Delete-then-write** means a retry after a half-finished attempt doesn't leave duplicate chunks.
- **Mark `failed` only after the last attempt.** Transient errors, such as embeddings rate limits, get retried with backoff. Permanent ones surface to the user with a reason.

`job.updateProgress` also gives the UI a real progress bar instead of a spinner.

## 3. Chunk for retrieval, not for storage

Chunk size is a retrieval decision. Chunks that are too big dilute the match: one relevant sentence is buried in 3,000 tokens of unrelated text. Chunks that are too small lose context: "it" no longer says what "it" refers to.

A reasonable starting point:

- **~500–800 tokens per chunk**, split on paragraph or heading boundaries rather than mid-sentence.
- **10–15% overlap** between neighbours, so a fact that straddles a boundary still appears whole in one chunk.
- **Metadata on every chunk:** document id, page or section, position. You'll need it for citations and for filtering by document.

```ts
function chunk(text: string, maxChars = 3000, overlap = 400): string[] {
  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";
  for (const p of paragraphs) {
    if ((current + "\n\n" + p).length > maxChars && current) {
      chunks.push(current);
      current = current.slice(-overlap); // carry the tail forward as overlap
    }
    current = current ? `${current}\n\n${p}` : p;
  }
  if (current.trim()) chunks.push(current);
  return chunks;
}
```

(Characters are a rough proxy for tokens, at about 4 characters per token for English. Use a real tokenizer if your limits are tight.)

## 4. Embed in batches

Embedding APIs accept arrays. Sending one chunk per request is slow and burns rate limit:

```ts
import OpenAI from "openai";
const openai = new OpenAI();

async function embedAndStore(documentId: string, chunks: string[], onProgress: (n: number) => void) {
  const BATCH = 64;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const { data } = await openai.embeddings.create({ model: "text-embedding-3-small", input: batch });
    await saveChunks(
      batch.map((content, j) => ({ documentId, position: i + j, content, embedding: data[j]!.embedding })),
    );
    onProgress(i + batch.length);
  }
}
```

`text-embedding-3-small` returns 1536-dimensional vectors. Whatever model you pick, use the **same model for documents and queries**: vectors from different models aren't comparable.

## 5. Answer only from what you retrieved

At question time:

1. Embed the question.
2. Retrieve the top *k* chunks (5–8 is a good start), filtered to the user's documents.
3. Build a prompt that contains those chunks, labelled, and an explicit rule to answer only from them.

```ts
const system = `Answer using ONLY the numbered sources below.
If the answer isn't in them, say you couldn't find it in the documents.
Cite sources like [2].

${chunks.map((c, i) => `[${i + 1}] (${c.documentName}, p.${c.page})\n${c.content}`).join("\n\n")}`;
```

The "say you couldn't find it" line matters as much as the retrieval. Without it, the model fills gaps from its general knowledge, and the answer sounds equally confident either way.

### Follow-up questions

"What about the second one?" is a terrible search query. Docly sends the latest 5 messages along with the question so the model has conversational context. A further improvement worth adding is to **rewrite the follow-up into a standalone question** with a cheap model call before embedding it, e.g. "What are the termination terms in the second contract?". Retrieval quality on follow-ups improves noticeably.

## What I'd check before calling it production-ready

- [ ] Uploads go directly to object storage; the API never streams file bytes
- [ ] Jobs are idempotent (`jobId`), retried with backoff, and failures are visible to the user
- [ ] Partial results are cleaned up before a retry writes again
- [ ] Chunks carry document, position and page metadata
- [ ] Embedding calls are batched, and the same model embeds documents and queries
- [ ] Retrieval is filtered to documents the user is allowed to see
- [ ] The prompt forbids answering beyond the sources, and answers cite them

The model call is the easy part. Most of the reliability in a RAG product comes from the boring pipeline around it.
