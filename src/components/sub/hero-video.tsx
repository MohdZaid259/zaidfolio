"use client";

import { useEffect, useState } from "react";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * The black-hole video loads right after the page itself has loaded, so it never
 * delays first paint. It's skipped only for Save-Data or reduced motion; the CSS
 * ring (.blackhole) underneath shows until the video starts playing.
 */
export function HeroVideo() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    // Skip only when the visitor asked for less data or less motion
    const allowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !conn?.saveData;
    if (!allowed) return;

    // Fade the video in a couple of seconds after load, once the page is idle and
    // interactive; the CSS ring covers the gap
    const start = () =>
      setTimeout(() => {
        const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 0));
        idle(() => setEnabled(true), { timeout: 1500 });
      }, 2500);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  if (!enabled) return null;
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      onPlaying={() => setVisible(true)}
      className={`absolute left-0 top-[-450px] h-full w-full rotate-180 object-cover md:top-[-290px] transition-opacity duration-[1500ms] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <source src="/videos/blackhole.webm" type="video/webm" />
    </video>
  );
}
