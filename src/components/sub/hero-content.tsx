import { ChevronRight } from "lucide-react";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { ShimmerLink } from "../magicui/shimmer-button";
import { TechOrbit } from "./tech-orbit";
import { MorphingText } from "../magicui/morphing-text";

export const HeroContent = () => {
  return (
    <div className="container z-[20] mx-auto mt-28 flex flex-col items-center gap-10 px-6 md:mt-40 lg:flex-row lg:justify-between">
      <div className="hero-in flex max-w-[620px] flex-col items-start gap-5">
        <div className="relative flex items-center rounded-full px-3 py-1 shadow-[inset_0_-8px_10px_#8fdfff1f] md:px-4 md:py-1.5">
          <span aria-hidden className="pill-border absolute inset-0 rounded-[inherit]" />
          <span aria-hidden>⚡</span>
          <hr className="mx-2 h-4 w-px shrink-0 border-0 bg-neutral-500" />
          <AnimatedGradientText className="text-xs font-medium md:text-sm">
            AI Full-Stack Engineer · DevOps
          </AnimatedGradientText>
          <ChevronRight aria-hidden className="ml-1 size-4 stroke-neutral-500" />
        </div>

        <h1 className="w-full text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          Hello, I&apos;m
          <span className="sr-only"> Mohd Zaid, AI full-stack engineer</span>
          <span aria-hidden>
            <MorphingText texts={["Mohd Zaid", "Freelancer", "Developer"]} />
          </span>
        </h1>

        <p className="max-w-[560px] text-base leading-relaxed text-gray-300 md:text-xl">
          I build backend systems, multi-tenant SaaS and AI-powered products, and ship them with Docker, CI/CD and
          the cloud. Currently at PGC Digital, building 10xTA.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <ShimmerLink href="/resumeFull.pdf" target="_blank" rel="noopener noreferrer" className="shadow-2xl">
            <span className="text-sm font-medium leading-none tracking-tight text-white lg:text-base">View Resume</span>
          </ShimmerLink>
        </div>
      </div>

      <TechOrbit />
    </div>
  );
};
