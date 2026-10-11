"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// The Spline runtime (~1 MB with the scene) loads only once the globe is about to be seen
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

const SCENE = "https://prod.spline.design/2FG51UXgwhoh7A2y/scene.splinecode";

export function LazyGlobe() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none relative size-[420px] overflow-hidden lg:size-[520px]">
      {/* Glow placeholder while the 3D scene streams in */}
      <div
        className={`absolute inset-[18%] rounded-full bg-gradient-to-br from-violet-600/60 via-fuchsia-700/40 to-indigo-900/60 blur-2xl transition-opacity duration-1000 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
      {show && (
        // Canvas is oversized and clipped so the corner watermark falls outside the frame
        <div className={`absolute -inset-[14%] transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <Spline scene={SCENE} onLoad={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
