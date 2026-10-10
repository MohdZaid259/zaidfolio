import { buildSystemPrompt } from "@/lib/chat-context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_URL = process.env.MESH_API_BASE_URL ?? "https://api.meshapi.ai/v1";
const MODEL = process.env.MESH_API_MODEL ?? "openai/gpt-4o-mini";

// Request-shape limits (not usage caps): keep prompts small and well-formed
const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;
const MAX_ANSWER_TOKENS = 500;

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_MESSAGES);
  const messages: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (text) messages.push({ role, content: text });
  }
  return messages.length && messages[messages.length - 1].role === "user" ? messages : null;
}

const json = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { "Content-Type": "application/json" } });

export async function POST(req: Request) {
  const apiKey = process.env.MESH_API_KEY;
  if (!apiKey) return json(503, "The assistant isn't configured yet.");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, "Invalid JSON.");
  }
  const messages = parseMessages(body);
  if (!messages) return json(400, "Send at least one user message.");

  const upstream = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      temperature: 0.3,
      max_tokens: MAX_ANSWER_TOKENS,
      messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
    }),
    signal: req.signal,
  }).catch((err) => {
    console.error("[chat] upstream request failed", err);
    return null;
  });

  if (!upstream?.ok || !upstream.body) {
    const detail = upstream ? await upstream.text().catch(() => "") : "";
    console.error("[chat] upstream error", upstream?.status, detail.slice(0, 500));
    return json(502, "The assistant is unavailable right now. Please try again shortly.");
  }

  // Convert the OpenAI-style SSE stream into a plain text stream of answer tokens
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    // Keep reading until this pull emits some text or the stream ends, so a
    // chunk with only keep-alives can't leave the consumer waiting
    async pull(controller) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        let emitted = false;
        for (const line of lines) {
          const data = line.trim();
          if (!data.startsWith("data:")) continue;
          const payload = data.slice(5).trim();
          if (payload === "[DONE]") {
            controller.close();
            await reader.cancel();
            return;
          }
          try {
            const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) {
              controller.enqueue(encoder.encode(delta));
              emitted = true;
            }
          } catch {
            // Ignore keep-alive comments and partial/non-JSON lines
          }
        }
        if (emitted) return;
      }
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
