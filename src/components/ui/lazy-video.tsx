"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Background video that only downloads when it's about to scroll into view,
 * and pauses while off-screen. Skipped for Save-Data and reduced motion.
 */
export function LazyVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setLoad(true);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // A <source> added after mount isn't fetched until load() is called
  useEffect(() => {
    if (!load || !ref.current) return;
    ref.current.load();
    ref.current.play().catch(() => {});
  }, [load]);

  return (
    <video ref={ref} className={className} muted loop playsInline preload="none" aria-hidden>
      {load && <source src={src} type="video/webm" />}
    </video>
  );
}
