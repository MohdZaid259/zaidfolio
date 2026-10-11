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


