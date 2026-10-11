import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  SiAmazonwebservices,
  SiAnthropic,
  SiDocker,
  SiFastify,
  SiGithubactions,
  SiGooglegemini,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiReact,
  SiRedis,
  SiTypescript,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

type Item = { icon: IconType; label: string; color: string };

// The ellipse every orbit uses, in the atom's 460x460 coordinate space
const ELLIPSE = { cx: 230, cy: 230, rx: 200, ry: 74 };

// Collision-free choreography. Every icon moves at the same speed in the same
// direction, so the pattern repeats exactly. With 5 icons per orbit, starting
// icon i of orbit o at (i / 5 - o / 30) of the loop keeps every pair of icons at
// least ~62px apart (40px icons), even where the orbits cross. Found by simulating
// one full period and verified against the browser's rendered positions; changing
// counts, speeds, tilts or the ellipse path needs a re-check.
const LOOP_SECONDS = 30;
const ORBIT_OFFSET = -1 / 30;

const ORBITS: { tilt: number; items: Item[] }[] = [
  {
    tilt: 0,
    items: [
      { icon: SiOpenai, label: "OpenAI", color: "#ffffff" },
      { icon: SiAnthropic, label: "Claude", color: "#d97757" },
      { icon: SiGooglegemini, label: "Gemini", color: "#8e75ff" },
      { icon: SiNextdotjs, label: "Next.js", color: "#ffffff" },
      { icon: SiReact, label: "React", color: "#61dafb" },
    ],
  },
  {
    tilt: 60,
    items: [
      { icon: SiPostgresql, label: "PostgreSQL", color: "#699eca" },
      { icon: SiNodedotjs, label: "Node.js", color: "#5fa04e" },
      { icon: SiFastify, label: "Fastify", color: "#ffffff" },
      { icon: SiRedis, label: "Redis", color: "#ff4438" },
      { icon: SiMongodb, label: "MongoDB", color: "#47a248" },
    ],
  },
  {
    tilt: 120,
    items: [
      { icon: SiDocker, label: "Docker", color: "#2496ed" },
      { icon: VscAzure, label: "Azure", color: "#0089d6" },
      { icon: SiAmazonwebservices, label: "AWS", color: "#ff9900" },
      { icon: SiGithubactions, label: "GitHub Actions", color: "#2088ff" },
      { icon: SiTypescript, label: "TypeScript", color: "#3178c6" },
    ],
  },
];

/**
 * Decorative atom: three tilted orbits with tools travelling along them like
 * electrons, choreographed so they never touch. CSS animation only; the same
 * tools are listed accessibly in the Skills section.
 */
export function TechOrbit() {
  return (
    // 460px artwork, scaled down on small screens
    <div aria-hidden className="relative size-[322px] shrink-0 sm:size-[460px]">
      <div className="absolute left-0 top-0 size-[460px] origin-top-left scale-[0.7] sm:scale-100">
        <div className="absolute inset-[28%] rounded-full bg-violet-600/30 blur-3xl" />

        {ORBITS.map((orbit, o) => (
          <div key={orbit.tilt} className="atom-plane" style={{ "--tilt": `${orbit.tilt}deg` } as CSSProperties}>
            {/* The visible orbit line */}
            <svg viewBox="0 0 460 460" className="absolute inset-0 size-full overflow-visible">
              <ellipse
                cx={ELLIPSE.cx}
                cy={ELLIPSE.cy}
                rx={ELLIPSE.rx}
                ry={ELLIPSE.ry}
                fill="none"
                stroke="rgb(129 140 248 / 0.45)"
                strokeWidth="1.5"
                style={{ filter: "drop-shadow(0 0 6px rgb(129 140 248 / 0.8))" }}
              />
            </svg>

            {orbit.items.map(({ icon: Icon, label, color }, i) => (
              <div
                key={label}
                className="electron"
                style={
                  {
                    "--start": `${(((i / orbit.items.length + o * ORBIT_OFFSET) % 1) + 1) % 1 * 100}%`,
                    "--speed": `${LOOP_SECONDS}s`,
                  } as CSSProperties
                }
              >
                <div
                  title={label}
                  className="flex size-10 items-center justify-center rounded-full border border-indigo-300/30 bg-[#0d0a24] shadow-[0_0_16px_rgb(129_140_248/0.55)]"
                >
                  <Icon className="size-5" style={{ color }} />
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Nucleus */}
      </div>
    </div>
  );
}
