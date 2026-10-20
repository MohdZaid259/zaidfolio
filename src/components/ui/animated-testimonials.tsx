"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Testimonial } from "@/data/testimonials";
import { Flag, countryName } from "./flag";

// Deterministic tilt so server and client render the same markup
const tilt = (i: number) => ((i * 7) % 21) - 10;

/** Stacked testimonial cards; CSS transitions only. */
export const AnimatedTestimonials = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = testimonials.length;
  const next = () => setActive((i) => (i + 1) % count);
  const prev = () => setActive((i) => (i - 1 + count) % count);
  const current = testimonials[active]!;

  return (
    <div className="mx-auto max-w-sm px-4 py-10 md:max-w-5xl md:px-8 md:py-20 lg:px-12">
      <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-32">
        <div
          className="relative mx-auto h-40 w-40 md:h-80 md:w-full"
          onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            const start = touchX.current;
            const end = e.changedTouches[0]?.clientX;
            if (start == null || end == null) return;
            if (end - start < -50) next();
            if (end - start > 50) prev();
          }}
        >
          {testimonials.map((t, i) => {
            const isActive = i === active;
            return (
              <div
                key={t.name}
                aria-hidden
                className="absolute inset-0 origin-bottom transition-[transform,opacity] duration-500 ease-out"
                style={{
                  transform: isActive ? "rotate(0deg) scale(1)" : `rotate(${tilt(i)}deg) scale(0.95)`,
                  opacity: isActive ? 1 : 0.6,
                  zIndex: isActive ? 40 : count + 2 - i,
                }}
              >
                {t.src && (
                  <img
                    src={t.src}
                    alt=""
                    width={900}
                    height={675}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover shadow-2xl shadow-black/50"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-between py-4">
          <div key={active} aria-live="polite" className="quote-in">
            <h3 className="text-xl font-bold tracking-tight text-white max-sm:text-center sm:text-2xl">{current.name}</h3>
            <p className="text-sm text-gray-400 max-sm:text-center">
              {current.designation}
              {current.linkedin && (
                <>
                  {" · "}
                  <a href={current.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                    LinkedIn
                  </a>
                </>
              )}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-300 max-sm:justify-center">
              <Flag code={current.country} />
              {countryName(current.country)}
            </p>
            <Link
              href={`/work/${current.projectSlug}`}
              className="mt-1 inline-flex min-h-11 items-center text-sm text-purple-300 hover:text-purple-200 hover:underline max-sm:flex max-sm:justify-center"
            >
              See the project →
            </Link>
            <blockquote className="mt-6 text-pretty text-[15px] leading-relaxed text-gray-300 max-sm:text-center sm:text-base md:text-xl">
              {current.quote.split(" ").map((word, index) => (
                <span key={index} className="word-in inline-block" style={{ animationDelay: `${index * 20}ms` }}>
                  {word}&nbsp;
                </span>
              ))}
            </blockquote>
          </div>
          <div className="flex gap-4 self-end pt-6 max-sm:self-center md:pt-0">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="group/button flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:border-white/50"
            >
              <ArrowLeft className="h-5 w-5 text-white transition-transform duration-300 group-hover/button:-translate-x-0.5" />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="group/button flex h-11 w-11 items-center justify-center rounded-full bg-white hover:bg-gray-200"
            >
              <ArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
