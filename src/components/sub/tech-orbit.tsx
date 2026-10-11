import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  SiAmazonwebservices,
  SiAnthropic,
  SiDocker,
  SiDrizzle,
  SiExpress,
  SiFastify,
  SiGit,
  SiGithubactions,
  SiGooglegemini,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

type Item = { icon: IconType; label: string; color: string };

// The ellipse every orbit uses, in the atom's 460x460 coordinate space
const ELLIPSE = { cx: 230, cy: 230, rx: 200, ry: 74 };

const ORBITS: { tilt: number; speed: string; reverse?: boolean; items: Item[] }[] = [
  {
    tilt: 0,
    speed: "26s",
    items: [
      { icon: SiOpenai, label: "OpenAI", color: "#ffffff" },
      { icon: SiAnthropic, label: "Claude", color: "#d97757" },
      { icon: SiGooglegemini, label: "Gemini", color: "#8e75ff" },
      { icon: SiPython, label: "Python", color: "#ffd43b" },
      { icon: SiNextdotjs, label: "Next.js", color: "#ffffff" },
      { icon: SiReact, label: "React", color: "#61dafb" },
    ],
  },
  {
    tilt: 60,
    speed: "32s",
    reverse: true,
    items: [
      { icon: SiPostgresql, label: "PostgreSQL", color: "#699eca" },
      { icon: SiFastify, label: "Fastify", color: "#ffffff" },
      { icon: SiRedis, label: "Redis", color: "#ff4438" },
      { icon: SiMongodb, label: "MongoDB", color: "#47a248" },
      { icon: SiDrizzle, label: "Drizzle", color: "#c5f74f" },
      { icon: SiNodedotjs, label: "Node.js", color: "#5fa04e" },
      { icon: SiExpress, label: "Express", color: "#ffffff" },
    ],
  },
  {
    tilt: 120,
    speed: "29s",
    items: [
      { icon: SiDocker, label: "Docker", color: "#2496ed" },
      { icon: VscAzure, label: "Azure", color: "#0089d6" },
      { icon: SiGithubactions, label: "GitHub Actions", color: "#2088ff" },
      { icon: SiAmazonwebservices, label: "AWS", color: "#ff9900" },
      { icon: SiVercel, label: "Vercel", color: "#ffffff" },
      { icon: SiGit, label: "Git", color: "#f05032" },
      { icon: SiTypescript, label: "TypeScript", color: "#3178c6" },
    ],
  },
];

/**
 * Decorative atom: a glowing nucleus with three tilted orbits, tools travelling
 * along them like electrons (alternating directions). CSS animation only; the
 * same tools are listed accessibly in the Skills section.
 */
export function TechOrbit() {
  return (
    // 460px artwork, scaled down on small screens
    <div aria-hidden className="relative size-[322px] shrink-0 sm:size-[460px]">
      <div className="absolute left-0 top-0 size-[460px] origin-top-left scale-[0.7] sm:scale-100">
        <div className="absolute inset-[28%] rounded-full bg-violet-600/30 blur-3xl" />

        {ORBITS.map((orbit) => (
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
                    "--start": `${(100 / orbit.items.length) * i}%`,
                    "--speed": orbit.speed,
                    "--dir": orbit.reverse ? "reverse" : "normal",
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
