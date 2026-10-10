"use client";

import { useRef, useState } from "react";

/** Outlined footer text that draws itself in, with a gradient revealed under the pointer. CSS + SVG only. */
export const TextHoverEffect = ({ text }: { text: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mask, setMask] = useState({ cx: "50%", cy: "50%" });

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 -10 300 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        setMask({
          cx: `${((e.clientX - rect.left) / rect.width) * 100}%`,
          cy: `${((e.clientY - rect.top) / rect.height) * 100}%`,
        });
      }}
      className="select-none"
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>
        <radialGradient id="revealMask" gradientUnits="userSpaceOnUse" r="20%" cx={mask.cx} cy={mask.cy}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.06"
        className="draw-in fill-transparent stroke-neutral-200 font-[helvetica] text-6xl font-bold"
      >
        {text}
      </text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.06"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-6xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};
