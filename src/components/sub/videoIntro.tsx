"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function VideoIntro({
  onlyOnHome = true,
}: {
  readonly onlyOnHome?: boolean;
}) {
  const [visible, setVisible] = useState(true); // start as true to block SSR flash
  const [showVideo, setShowVideo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Decide whether to play intro
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setVisible(false);
      return;
    }

    // @ts-expect-error Optional NetworkInformation
    if (navigator?.connection?.saveData) {
      setVisible(false);
      return;
    }

    if (onlyOnHome && window.location?.pathname !== "/") {
      setVisible(false);
      return;
    }

    // Show video after checks
    setShowVideo(true);
  }, [onlyOnHome]);

  // Track video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [showVideo]);

  const handleHide = () => {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
    }, 500);
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!showVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleHide();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showVideo]);

  const bgTo = useMemo(() => "var(--background, #ffffff)", []);

  // If not visible at all, remove from DOM
  if (!visible) return null;

  // SSR initial block (black screen) before checks run
  if (!showVideo) {
    return <div className="fixed inset-0 bg-black z-[9999]" />;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="md:hidden absolute inset-0 bg-[#000b13] -z-[20]" />
      {/* Video */}
      <video
        ref={videoRef}
        src="/video.webm"
        // poster="/intro-poster.png"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleHide}
        className="w-full h-full md:object-cover object-contain max-md:shadow-none"
      />

      {/* Overlay instructions */}
      <div className="max-md:hidden pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-12">
        <div className="rounded-full border border-white/15 bg-white/10 backdrop-blur px-3 py-1 text-white/90 text-xs">
          Press S or Esc to skip
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/10">
        <div
          className="h-full bg-[var(--primary,#0c4377)] transition-[width] duration-200 ease-linear"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      {/* Fade overlay */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          fadeOut ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `radial-gradient(60% 60% at 50% 50%, ${bgTo} 0%, ${bgTo} 35%, rgba(255,255,255,0) 100%)`,
        }}
      />
    </div>
  );
}
