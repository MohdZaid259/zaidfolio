"use client";

import { useState } from "react";
import { Check, Rss } from "lucide-react";

const FEED_URL = "https://www.zaidfolio.space/notes/rss.xml";

/** Copies the feed URL for pasting into a reader; falls back to opening the feed. */
export function RssButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(FEED_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.open("/notes/rss.xml", "_blank", "noopener");
    }
  };

  return (
    <button
      onClick={copy}
      className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm text-purple-300 transition hover:border-purple-400 hover:text-purple-200"
      aria-live="polite"
    >
      {copied ? <Check className="size-4" /> : <Rss className="size-4" />}
      {copied ? "Feed link copied, paste it into your RSS reader" : "Copy RSS feed link"}
    </button>
  );
}
