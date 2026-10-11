"use client";

import { useEffect, useRef, useState } from "react";

type NetworkInfo = { saveData?: boolean };

const POSTER = "/videos/blackhole-poster.webp";

/**
 * The black-hole video, server-rendered with its own first frame as the poster so
 * the hero looks final from the first paint. The 750 KB video attaches after the
 * page has loaded and starts on that same frame, so the switch is invisible.
 * Save-Data and reduced-motion visitors keep the still poster.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;

    const attach = () => setSrc("/videos/blackhole.webm");
    if (document.readyState === "complete") attach();
    else window.addEventListener("load", attach, { once: true });
    return () => window.removeEventListener("load", attach);
  }, []);

  // A <source> added after mount isn't fetched until load() is called
  useEffect(() => {
    if (!src || !ref.current) return;
    ref.current.load();
    ref.current.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      autoPlay={Boolean(src)}
      muted
      loop
      playsInline
      preload="none"
      onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
      poster={POSTER}
      className="absolute left-0 top-[-450px] h-full w-full rotate-180 object-cover md:top-[-290px]"
    >
      {src && <source src={src} type="video/webm" />}
    </video>
  );
}
