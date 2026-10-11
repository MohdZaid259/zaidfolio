---
title: "Your RAG demo works. Your RAG product won't (yet): building an ingestion pipeline that survives real documents"
description: "Chat-with-your-documents is easy to demo and hard to ship. What I learned building Docly: why ingestion must leave the request, idempotent queue jobs, chunking that helps retrieval, batched embeddings, and answers that admit when the documents don't say."
date: 2026-5-19
tags: ["AI", "Backend"]
draft: true
---

Every "chat with your PDFs" project starts the same way, and it's magical.

You upload a two-page document. Behind the scenes it's parsed, chunked, embedded and stored, all inside the same request, in about three seconds. You ask a question and the answer is right. You show a friend. It's the best afternoon of the month.

Then a real user arrives with a 240-page contract.

The upload spinner turns for forty seconds, and then the request times out. Or the embeddings API hiccups at chunk 180 of 300, and you're left with half a document in your database and no record of what happened. The user retries, and now you have *one and a half* copies of the contract, and the model starts quoting clauses twice.

None of this is an AI problem. It's a plumbing problem, and it's the part of RAG most tutorials skip.

When I built [Docly](/work/docly), an AI document-chat app, I designed around this from the start. Here's how it works, and why each piece is there.

## The core idea: two paths that never wait on each other

The single most important decision is to split the system in two:

- **Ingestion** is asynchronous. A file lands in object storage, a background job processes it, and the document moves through clear states: `uploaded` → `processing` → `ready` (or `failed`, with a reason).
- **Chat** is synchronous and fast. It only ever touches documents that are `ready`.

The chat path never waits on a 200-page PDF, and the ingestion path never holds a user's HTTP request hostage.

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

## Step 1: Don't let your API carry the files

Your API server shouldn't be a pipe for file bytes. It ties up memory and connections, and it's the first thing to fall over when three people upload big files at once.

Instead, give the browser a short-lived presigned URL and let it upload straight to S3:

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

When the browser says "done", the API creates the document row and enqueues a job. That request returns in milliseconds, whether the file is 2 pages or 2,000.

## Step 2: Assume every job will run twice

Here's the uncomfortable truth about queues: they deliver jobs **at least once**. Workers crash. Deploys restart them mid-job. Retries happen. If running a job twice corrupts your data, it's only a matter of time.

So every step has to be safe to repeat:

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
    // Clear partial output from a previous failed attempt before writing again
    await deleteChunks(documentId);
    const text = await extractText(await downloadFromS3(documentId));
    const chunks = chunk(text);
    await embedAndStore(documentId, chunks, (done) =>
      job.updateProgress(Math.round((done / chunks.length) * 100)),
    );
    await markStatus(documentId, "ready");
  },
  { connection, concurrency: 4 },
).on("failed", async (job, err) => {
  if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
    await markStatus(job.data.documentId, "failed", err.message);
  }
});
```

Three small choices do a lot of work here:

- **`jobId: documentId`** deduplicates. A double-click, a flaky network retry or an impatient user can't trigger two parallel ingestions of the same file.
- **Delete, then write.** If attempt one died halfway, attempt two starts from a clean slate instead of stacking duplicate chunks on top.
- **Only mark `failed` after the last attempt.** Rate limits and timeouts are usually temporary, so retry them with backoff. When something is permanently broken, the user sees a clear reason instead of a spinner that never stops.

And `job.updateProgress` gives the UI a *real* progress bar. That small honesty makes long uploads feel far less broken.

## Step 3: Text extraction is messier than you think

Nobody warns you about this part. "Extract text from the PDF" sounds like one line of code. In practice:

- **Scanned PDFs have no text at all.** They're pictures of pages. You'll need OCR, or at least a clear "we couldn't read this document" message instead of silently indexing nothing.
- **Tables turn into soup.** Columns get flattened into a stream of numbers that no model can make sense of.
- **Headers and footers repeat on every page.** "Confidential — Page 14 of 240" ends up in every chunk and quietly pollutes retrieval.

You don't have to solve all of this on day one. But detect the empty-text case and strip repeating headers early. Both are cheap and save a lot of confusion.

## Step 4: Chunk for retrieval, not for storage

Chunk size isn't a storage decision; it's a **retrieval** decision, and it involves a real trade-off:

- **Too big**, and the one relevant sentence is buried in 3,000 tokens of unrelated text. The match gets diluted and the model gets distracted.
- **Too small**, and you lose context. A chunk that says "it shall terminate after 30 days" no longer says what "it" is.

A reasonable starting point:

- **About 500–800 tokens per chunk**, split on paragraph or heading boundaries, never mid-sentence.
- **10–15% overlap** between neighbouring chunks, so a fact that straddles a boundary still appears whole somewhere.
- **Metadata on every chunk:** document ID, page or section, position. You'll need it for citations, filtering and deletion.

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

(Characters are a rough stand-in for tokens, at about four characters per token in English. If your limits are tight, use a real tokenizer.)

## Step 5: Embed in batches, and keep one model

Embedding APIs accept arrays. Sending one chunk per request is slow, and it burns through your rate limit for nothing:

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

`text-embedding-3-small` produces 1536-dimensional vectors. Whichever model you choose, the golden rule is: **use the same model for your documents and your questions.** Vectors from different models live in different spaces, and comparing them is like measuring in centimetres against inches without converting.

## Step 6: Teach the model to say "I don't know"

At question time, the flow is simple:

1. Embed the user's question.
2. Retrieve the top *k* most similar chunks (5–8 is a good start), filtered to documents this user is allowed to see.
3. Build a prompt containing those chunks, numbered, with a clear instruction to answer **only** from them.

```ts
const system = `Answer using ONLY the numbered sources below.
If the answer isn't in them, say you couldn't find it in the documents.
Cite sources like [2].

${chunks.map((c, i) => `[${i + 1}] (${c.documentName}, p.${c.page})\n${c.content}`).join("\n\n")}`;
```

The line about not finding the answer matters as much as the retrieval itself. Without it, the model fills gaps from general knowledge, sounding exactly as confident as when it's quoting your document. For a contract or a medical report, a confident made-up answer is worse than no answer.

Citations help in a second way: users can click through and check. Trust in a RAG product comes from people being able to verify it.

### Follow-up questions are a retrieval trap

"What about the second one?" is a perfectly natural thing to ask, and a terrible search query.

Docly sends the latest five messages along with each question, so the model knows what "the second one" refers to. A further improvement worth adding is **query rewriting**: before retrieval, a cheap model call turns the follow-up into a standalone question, such as "What are the termination terms in the second contract?". Retrieval on follow-ups gets noticeably better.

## How do you know it's actually good?

This is where many RAG projects stall: they "feel" good, until they don't.

The cheapest useful evaluation is a list of 30–50 real questions, each paired with the chunk that *should* answer it. Run retrieval over the list and measure how often the right chunk appears in the top *k*. It's crude, but now every change to chunk size, overlap or model gives you a number instead of a vibe.

If retrieval keeps fetching related but wrong passages, a **reranking** step helps: retrieve the top 20, then let a cross-encoder model pick the best 5 to send to the LLM.

## Don't forget the boring operations

- **Deleting a document must delete its vectors.** Otherwise "deleted" content keeps showing up in answers, which is a privacy problem, not just a bug.
- **Re-embedding is a migration.** If you switch embedding models, every stored vector must be regenerated. Plan for it like a database migration.
- **Watch your costs where they actually are.** Embedding is usually cheap; the chat calls with large retrieved contexts are where the money goes.

## The checklist

- [ ] Uploads go straight to object storage; the API never streams file bytes
- [ ] Jobs are idempotent (`jobId`), retried with backoff, and failures are visible to users
- [ ] Partial results are cleaned up before a retry writes again
- [ ] Empty-text (scanned) documents are detected, not silently indexed
- [ ] Chunks carry document, position and page metadata
- [ ] Embedding calls are batched; the same model embeds documents and queries
- [ ] Retrieval is filtered to documents the user may see
- [ ] The prompt forbids answering beyond the sources, and answers cite them
- [ ] A small question set measures retrieval quality over time

The model call is honestly the easy part. Everything that makes a RAG product trustworthy lives in the unglamorous pipeline around it. That's good news, because unlike the model, the pipeline is entirely yours to get right.
