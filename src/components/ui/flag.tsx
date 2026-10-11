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
  },
  SA: {
    name: "Saudi Arabia",
    // Green field; the shahada is suggested by white strokes (unreadable at this size anyway) above the sword
    svg: (
      <>
        <rect width="12" height="6" fill="#006c35" />
        <g fill="#ffffff">
          <rect x="3" y="1.7" width="1.6" height="0.45" rx="0.2" />
          <rect x="4.9" y="1.5" width="2.2" height="0.45" rx="0.2" />
          <rect x="7.4" y="1.7" width="1.6" height="0.45" rx="0.2" />
          <rect x="3.6" y="2.5" width="4.8" height="0.4" rx="0.2" />
          <rect x="3" y="3.9" width="5.6" height="0.3" rx="0.15" />
          <rect x="8.4" y="3.6" width="0.3" height="0.9" />
          <rect x="8.7" y="3.95" width="0.6" height="0.2" />
        </g>
      </>
    ),
  },
  IN: {
    name: "India",
    // Saffron / white / green with the navy Ashoka Chakra
    svg: (
      <>
        <rect width="12" height="2" fill="#ff9933" />
        <rect y="2" width="12" height="2" fill="#ffffff" />
        <rect y="4" width="12" height="2" fill="#138808" />
        <circle cx="6" cy="3" r="0.75" fill="none" stroke="#000080" strokeWidth="0.16" />
        <circle cx="6" cy="3" r="0.15" fill="#000080" />
      </>
    ),
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


