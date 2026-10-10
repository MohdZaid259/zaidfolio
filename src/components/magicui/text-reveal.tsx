import type { FC } from "react";

/**
 * Words brighten from gray to white as they scroll into view, using CSS
 * scroll-driven animations. Browsers without support show the text in white.
 * Server-rendered, no JavaScript.
 */
export const TextReveal: FC<{ children: string; className?: string }> = ({ children, className }) => (
  <p className={`flex max-w-4xl flex-wrap justify-center text-center text-lg leading-relaxed text-white md:text-2xl ${className ?? ""}`}>
    {children.split(/\s+/).map((word, i) => (
      <span key={i} className="reveal-word mx-1 lg:mx-1.5">
        {word}
      </span>
    ))}
  </p>
);
