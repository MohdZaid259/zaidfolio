import type { FC } from "react";

/**
 * Words brighten from gray to white as they scroll into view, using CSS
 * scroll-driven animations. Browsers without support show the text in white.
 * Server-rendered, no JavaScript.
 */
export const TextReveal: FC<{ children: string; className?: string }> = ({ children, className }) => (
  <p
    className={`max-w-4xl text-pretty text-center text-[17px] leading-[1.7] text-white sm:text-lg md:text-2xl md:leading-relaxed md:[word-spacing:0.15em] ${className ?? ""}`}
  >
    {children
      .trim()
      .split(/\s+/)
      .map((word, i) => (
        <span key={i}>
          {i > 0 && " "}
          <span className="reveal-word">{word}</span>
        </span>
      ))}
  </p>
);
