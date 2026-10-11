"use client";

import { type CSSProperties, useEffect, useState } from "react";

const NAME = "MOHD ZAID";
const TAGLINE = "AI Full-Stack Engineer";

// Runs while the HTML is parsed (before first paint): show the intro only on the
// first load of a browser session, and never for reduced-motion users.
const DECIDE = `try{var d=document.documentElement;if(sessionStorage.getItem("splash-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.splash="seen"}else{sessionStorage.setItem("splash-seen","1");d.dataset.splash="show"}}catch(e){document.documentElement.dataset.splash="seen"}`;

/** Intro on first load: name animates in letter by letter, then the screen blurs away. CSS only. */
export function SplashScreen() {
  const [phase, setPhase] = useState<"show" | "exit" | "gone">("show");

  useEffect(() => {
    if (document.documentElement.dataset.splash !== "show") {
      setPhase("gone");
      return;
    }
    const exit = setTimeout(() => setPhase("exit"), 2400);
    const gone = setTimeout(() => setPhase("gone"), 3200);
    return () => {
      clearTimeout(exit);
      clearTimeout(gone);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      id="splash"
      aria-hidden
      className={`fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-black ${phase === "exit" ? "splash-exit" : ""}`}
    >
      <script dangerouslySetInnerHTML={{ __html: DECIDE }} />
      <div className="splash-glow absolute inset-0 opacity-20" />

      <div className="splash-content relative z-10 text-center">
        <div className="mb-6 overflow-hidden">
          <p className="text-5xl font-bold tracking-tighter md:text-8xl">
            {NAME.split("").map((letter, i) => (
              <span key={i} className="splash-letter tracking-wider text-white" style={{ "--i": i } as CSSProperties}>
                {letter === " " ? " " : letter}
              </span>
            ))}
          </p>
        </div>
        <div className="splash-line mx-auto mb-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <p className="splash-tagline text-base uppercase text-gray-400 md:text-xl">{TAGLINE}</p>
        <div className="splash-dots mt-12 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="splash-dot size-2 rounded-full bg-white" style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
      </div>

      <div className="splash-corner absolute left-10 top-10">
        <div className="size-20 border-l-2 border-t-2 border-white/30" />
      </div>
      <div className="splash-corner absolute bottom-10 right-10">
        <div className="size-20 border-b-2 border-r-2 border-white/30" />
      </div>
    </div>
  );
}
