'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/data/projects';

export type CarouselProject = Pick<
  Project,
  'slug' | 'name' | 'kind' | 'role' | 'summary' | 'image' | 'technologies' | 'live' | 'github' | 'githubLabel'
>;

/**
 * Auto-advancing project carousel (CSS animations, no animation library).
 * A progress bar fills under the active project and advances to the next one;
 * it runs only on screen and pauses on hover, keyboard focus and reduced motion.
 */
export default function ProjectCarousel({ projects }: { projects: CarouselProject[] }) {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const touchX = useRef<number | null>(null);
  const count = projects.length;

  const go = (next: number, dir: number) => setState([(next + count) % count, dir]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // The active indicator's fill animation is the timer: when it finishes, the next
  // project shows. Pausing the animation (hover, focus, off-screen) pauses autoplay.
  const autoplay = inView && !paused && !reducedMotion;

  const project = projects[index]!;
  const linkClass = 'inline-flex min-h-11 items-center px-1 text-purple-300 hover:text-purple-200 hover:underline';

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      className="container relative mx-auto max-sm:mt-2 md:p-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        if (end - start < -60) go(index + 1, 1);
        if (end - start > 60) go(index - 1, -1);
      }}
    >
      <div className="relative min-h-[400px] overflow-hidden rounded-2xl md:min-h-[500px]">
        {/* Decorative watermark number, drawn via CSS content so it isn't treated as page text */}
        <div
          key={`n-${index}`}
          aria-hidden
          data-n={String(index + 1).padStart(2, '0')}
          className="rise-in absolute left-0 top-0 z-10 font-mono text-4xl font-extrabold text-purple-700/25 before:content-[attr(data-n)] max-sm:hidden md:left-8 md:top-8 md:text-8xl"
        />

        <div className="flex min-h-[350px] items-center overflow-hidden p-4 md:min-h-[450px] md:p-8">
          <div
            key={index}
            aria-live="polite"
            className={`${direction > 0 ? 'slide-from-right' : 'slide-from-left'} flex w-full flex-col items-center gap-6 text-center md:flex-row md:text-left`}
          >
            <div className="order-2 mt-6 w-full md:order-1 md:w-2/5">
              <p className="mb-2 text-xs uppercase tracking-widest text-purple-300">{project.kind}</p>
              <h3 className="mb-1 text-xl font-bold leading-tight text-white md:text-3xl">{project.name}</h3>
              <p className="mb-3 text-sm text-gray-400">My role: {project.role}</p>
              <p className="mb-3 text-base leading-relaxed text-gray-300 md:text-lg">{project.summary}</p>
              <ul className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start" aria-label="Stack">
                {project.technologies.map((tech) => (
                  <li key={tech} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-200">
                    {tech}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium md:justify-start">
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full bg-purple-700/70 px-5 text-white transition hover:bg-purple-600"
                >
                  Read case study
                </Link>
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Live site ↗
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {project.githubLabel ?? 'GitHub'} ↗
                  </a>
                )}
              </div>
            </div>

            <div className="order-1 flex w-full items-center justify-center md:order-2 md:w-3/5">
              <Image
                src={project.image}
                alt={`${project.name} screenshot`}
                width={800}
                height={500}
                sizes="(max-width: 768px) 92vw, 60vw"
                unoptimized={project.image.endsWith('.svg')}
                className="h-auto w-auto rounded-md object-contain"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden flex-row gap-2 lg:flex">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`Show ${p.name}`}
              className={`relative h-14 w-20 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:opacity-80 ${
                i === index ? 'opacity-100 ring-2 ring-purple-400/70' : 'opacity-40'
              }`}
            >
              <Image src={p.image} alt="" fill sizes="80px" unoptimized={p.image.endsWith('.svg')} className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar: aligned with the project text on desktop */}
      <div className="absolute -bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 lg:bottom-16 lg:left-16 lg:translate-x-0">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => go(i, i > index ? 1 : -1)}
            aria-label={`Show ${p.name}`}
            aria-current={i === index}
            className="flex h-11 w-8 cursor-pointer items-center sm:w-10"
          >
            <span className="relative h-1 w-full overflow-hidden rounded-full bg-white/20">
              {i < index && <span className="absolute inset-0 bg-white/70" />}
              {i === index && (
                <span
                  key={index}
                  className={reducedMotion ? 'absolute inset-0 bg-white' : 'carousel-progress absolute inset-y-0 left-0 bg-white'}
                  style={{ animationPlayState: autoplay ? 'running' : 'paused' }}
                  onAnimationEnd={() => go(index + 1, 1)}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
