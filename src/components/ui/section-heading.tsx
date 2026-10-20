import type { ReactNode } from "react";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { AuroraText } from "../magicui/aurora-text";

interface SectionHeadingProps {
  id?: string;
  emoji: string;
  eyebrow: string;
  title: ReactNode;
  highlight: string;
}

/** Gradient-bordered eyebrow pill + section title, shared by every home section. */
export function SectionHeading({ id, emoji, eyebrow, title, highlight }: SectionHeadingProps) {
  return (
    <div className="reveal flex flex-col items-center text-center">
      <div className="relative flex items-center rounded-full px-3 py-1 shadow-[inset_0_-8px_10px_#8fdfff1f] md:px-4 md:py-1.5">
        <span aria-hidden className="pill-border absolute inset-0 rounded-[inherit]" />
        <span aria-hidden>{emoji}</span>
        <hr className="mx-2 h-4 w-px shrink-0 border-0 bg-neutral-500" />
        <AnimatedGradientText className="text-xs font-medium md:text-sm">{eyebrow}</AnimatedGradientText>
      </div>
      <h2 id={id} className="mt-3 text-[28px] font-semibold tracking-tight text-white sm:text-[32px] md:text-[40px] md:tracking-wide">
        {title} <AuroraText>{highlight}</AuroraText>
      </h2>
    </div>
  );
}
