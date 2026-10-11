"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Send, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What do you work on at PGC Digital?",
  "What's your experience with AI and RAG?",
  "Have you built multi-tenant systems?",
  "Which projects show your backend skills?",
];

const URL_RE = /(https?:\/\/[^\s)]+[^\s).,!?])/g;

// Answers are plain text; turn URLs into links without rendering any HTML
function linkify(text: string): ReactNode[] {
  return text.split(URL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="break-all text-purple-300 underline">
        {part.replace(/^https?:\/\/(www\.)?/, "")}
      </a>
    ) : (
      part
    ),
  );
}

export default function AskChatPanel({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || pending) return;

    const history: Message[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }
      if (!answer.trim()) throw new Error("No answer came back. Please try again.");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setMessages(history.slice(0, -1));
      setInput(text);
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <>
      {/* Stays mounted while closed so the conversation survives closing the panel */}
      {open && (
          <div
            role="dialog"
            aria-label="Ask about Me"
            className="chat-in fixed inset-x-3 bottom-3 z-[60] flex max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0620]/95 shadow-2xl shadow-black/60 backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[400px]"
          >
            <header className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div>
                <p className="font-semibold text-white">Ask about Me</p>
                <p className="text-xs text-gray-400">AI answers from my resume, projects and notes.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.length === 0 && (
                <div>
                  <p className="text-sm text-gray-300">Hi! Ask me anything about my experience, projects or skills.</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => ask(s)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-gray-200 transition hover:border-purple-400/50 hover:bg-purple-500/10"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === "user" ? "bg-purple-600 text-white" : "bg-white/[0.06] text-gray-200"
                    }`}
                  >
                    {m.content ? linkify(m.content) : <span className="animate-pulse text-gray-400">Thinking…</span>}
                  </div>
                </div>
              ))}

              {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
            </div>

            <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-white/10 p-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                rows={1}
                maxLength={1000}
                placeholder="Ask a question…"
                aria-label="Your question"
                className="max-h-32 flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-purple-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                aria-label="Send"
                className="rounded-xl bg-purple-600 p-2.5 text-white transition hover:bg-purple-500 disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </form>
            <p className="px-4 pb-2 text-[11px] text-gray-400">
              AI can make mistakes. For anything important, email{" "}
              <a href="mailto:razvizaid259@gmail.com" className="underline">razvizaid259@gmail.com</a>.
            </p>
          </div>
        )}
    </>
  );
}
