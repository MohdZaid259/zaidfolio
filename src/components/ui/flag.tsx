import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// SVG flags (emoji flags render as plain letters on Windows). Add countries as needed.
const FLAGS = {
  AE: {
    name: "United Arab Emirates",
    // Red hoist band with green / white / black horizontal stripes (proportions 1:2)
    svg: (
      <>
        <rect width="12" height="2" fill="#00732f" />
        <rect y="2" width="12" height="2" fill="#ffffff" />
        <rect y="4" width="12" height="2" fill="#000000" />
        <rect width="3" height="6" fill="#ff0000" />
      </>
    ),
    // Same flag as a CSS background, used by the waving flag strips
    background:
      "linear-gradient(to right, #e4002b 0 25%, transparent 25%), linear-gradient(to bottom, #00843d 0 33.34%, #f5f5f5 33.34% 66.67%, #111 66.67%)",
  },
} as const;

export type CountryCode = keyof typeof FLAGS;

export const countryName = (code: CountryCode) => FLAGS[code].name;

/** Small rectangular flag for inline use. */
export function Flag({ code, className = "" }: { code: CountryCode; className?: string }) {
  return (
    <svg
      viewBox="0 0 12 6"
      role="img"
      aria-label={FLAGS[code].name}
      className={cn("inline-block h-3 w-6 shrink-0 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-white/20", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      {FLAGS[code].svg}
    </svg>
  );
}


const STRIPS = 72;

/**
 * Large flag waving in the wind: the flag is cut into vertical strips that rise and
 * fall in sequence, with light and shade moving across them like fabric folds.
 * CSS animation only. Decorative.
 */
export function WavingFlag({
  code,
  className = "",
  paused = false,
}: {
  code: CountryCode;
  className?: string;
  paused?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn("flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-white to-slate-200", className)}
    >
      <div className={cn("waving-flag", paused && "waving-flag-paused")} style={{ "--flag-bg": FLAGS[code].background, "--n": STRIPS } as CSSProperties}>
        {Array.from({ length: STRIPS }, (_, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}
