"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MessageCircle } from "lucide-react";

// The panel (and its animation library) loads on first open, not with every page
const AskChatPanel = dynamic(() => import("./ask-chat-panel"), { ssr: false });

export function AskChat() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => {
            setLoaded(true);
            setOpen(true);
          }}
          onPointerEnter={() => setLoaded(true)}
          className="menu-in fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full border border-purple-400/40 bg-[#120a2e]/90 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-purple-900/40 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-purple-300"
        >
          <MessageCircle aria-hidden className="size-5 text-purple-300" />
          Ask about Zaid
        </button>
      )}
      {loaded && <AskChatPanel open={open} setOpen={setOpen} />}
    </>
  );
}
