"use client";

import { useEffect, useState } from "react";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * The black-hole video is a desktop enhancement. It loads only after the page has
 * finished loading, on wide screens, without Save-Data, reduced motion or a slow
 * connection. Everyone else sees the CSS glow (.blackhole) underneath.
 */
export function HeroVideo() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const allowed =
      window.matchMedia("(min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !conn?.saveData &&
      !/(^|-)(2g|3g)$/.test(conn?.effectiveType ?? "");
    if (!allowed) return;

    const start = () => setTimeout(() => setEnabled(true), 1500);
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
      className={`absolute left-0 top-[-290px] h-full w-full rotate-180 object-cover transition-opacity duration-[1500ms] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <source src="/videos/blackhole.webm" type="video/webm" />
    </video>
  );
}
