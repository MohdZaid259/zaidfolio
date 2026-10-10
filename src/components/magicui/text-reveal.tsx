"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string;
  heading?: ReactNode;
  badge?: ReactNode;
}

export const TextReveal: FC<TextRevealProps> = ({ children, className, heading, badge }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start center", "end end"],
  });

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string");
  }

  const words = children.split(" ");

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[140vh] cursor-default", className)}>
      {/* Sticky wrapper keeps content pinned in middle */}
      <div className="sticky top-[45%] -translate-y-[45%] mx-auto flex flex-col items-center justify-center w-full">
        {/* Badge that scrolls with content */}
        {badge && (
          <div className="text-center text-sm">
            {badge}
          </div>
        )}
        
        {/* Title that scrolls with text */}
        {heading && (
          <div className="text-center">
            {heading}
          </div>
        )}
        
        {/* Text reveal content */}
        <span className="flex flex-wrap p-0 md:p-5 font-baloo-bhai-2 text-base md:text-xl leading-relaxed text-white/50 dark:text-white/20 text-center">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </span>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mx-1 lg:mx-1.5">
      <span className="absolute opacity-30">{children}</span>
      <motion.span
        style={{ opacity }}
        className="text-white dark:text-black"
      >
        {children}
      </motion.span>
    </span>
  );
};