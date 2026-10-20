"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/** Shows the first `visible` points; "N more" reveals the rest in the same list and disappears. */
export function ExpandablePoints({ points, visible = 3 }: { points: string[]; visible?: number }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? points : points.slice(0, visible);
  const hidden = points.length - visible;

  return (
    <>
      <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-gray-300 sm:text-base md:text-lg">
        {shown.map((point, i) => (
          <li key={point} className={`flex gap-3 ${i >= visible ? "rise-in" : ""}`}>
            <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-purple-500" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      {!expanded && hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 inline-flex min-h-9 items-center gap-1 text-sm text-purple-300 hover:text-purple-200"
        >
          {hidden} more <ChevronDown aria-hidden className="size-4" />
        </button>
      )}
    </>
  );
}
