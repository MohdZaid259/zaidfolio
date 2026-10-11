import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { Sparkles } from "lucide-react";
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

// Inner ring: AI + core languages/frameworks (clockwise)
const inner: Item[] = [
  { icon: SiOpenai, label: "OpenAI", color: "#ffffff" },
  { icon: SiAnthropic, label: "Claude", color: "#d97757" },
  { icon: SiGooglegemini, label: "Gemini", color: "#8e75ff" },
  { icon: SiNextdotjs, label: "Next.js", color: "#ffffff" },
  { icon: SiTypescript, label: "TypeScript", color: "#3178c6" },
  { icon: SiReact, label: "React", color: "#61dafb" },
  { icon: SiNodedotjs, label: "Node.js", color: "#5fa04e" },
];

// Outer ring: backend, data, cloud and DevOps (anticlockwise)
const outer: Item[] = [
  { icon: SiPostgresql, label: "PostgreSQL", color: "#699eca" },
  { icon: SiDocker, label: "Docker", color: "#2496ed" },
  { icon: VscAzure, label: "Azure", color: "#0089d6" },
  { icon: SiFastify, label: "Fastify", color: "#ffffff" },
  { icon: SiRedis, label: "Redis", color: "#ff4438" },
  { icon: SiGithubactions, label: "GitHub Actions", color: "#2088ff" },
  { icon: SiMongodb, label: "MongoDB", color: "#47a248" },
  { icon: SiDrizzle, label: "Drizzle", color: "#c5f74f" },
  { icon: SiAmazonwebservices, label: "AWS", color: "#ff9900" },
  { icon: SiPython, label: "Python", color: "#ffd43b" },
  { icon: SiExpress, label: "Express", color: "#ffffff" },
  { icon: SiVercel, label: "Vercel", color: "#ffffff" },
  { icon: SiGit, label: "Git", color: "#f05032" },
];

function Ring({
  items,
  radius,
  inset,
  speed,
  counterClockwise = false,
}: {
  items: Item[];
  radius: string;
  inset: string;
  speed: string;
  counterClockwise?: boolean;
}) {
  return (
    <div
      className={counterClockwise ? "orbit orbit-ccw" : "orbit"}
      style={{ "--inset": inset, "--speed": speed } as CSSProperties}
    >
      {items.map(({ icon: Icon, label, color }, i) => (
        <div
          key={label}
          style={{ "--angle": `${(360 / items.length) * i}deg`, "--radius": radius } as CSSProperties}
        >
          <div
            title={label}
            className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-[#0d0a24] shadow-[0_0_18px_rgb(124_58_237/0.25)]"
          >
            <Icon className="size-[22px]" style={{ color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Decorative: the same tools are listed (accessibly) in the Skills section. */
export function TechOrbit() {
  return (
    <div
      aria-hidden
      className="relative size-[320px] shrink-0 [--r1:84px] [--r2:150px] sm:size-[460px] sm:[--r1:120px] sm:[--r2:215px]"
    >
      <div className="absolute inset-[30%] rounded-full bg-violet-600/25 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-400/40 bg-gradient-to-br from-violet-600/70 to-sky-600/50 shadow-[0_0_50px_rgb(139_92_246/0.6)] sm:size-24">
        <Sparkles className="size-9 text-white" />
      </div>
      <Ring items={inner} radius="var(--r1)" inset="calc(50% - var(--r1))" speed="40s" />
      <Ring items={outer} radius="var(--r2)" inset="calc(50% - var(--r2))" speed="70s" counterClockwise />
    </div>
  );
}
