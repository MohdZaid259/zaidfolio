import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { Sparkles } from "lucide-react";
import {
  SiAnthropic,
  SiDocker,
  SiFastify,
  SiGithubactions,
  SiNextdotjs,
  SiOpenai,
  SiPostgresql,
  SiRedis,
  SiTypescript,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

type Item = { icon: IconType; label: string; color: string };

const inner: Item[] = [
  { icon: SiOpenai, label: "OpenAI", color: "#ffffff" },
  { icon: SiAnthropic, label: "Claude", color: "#d97757" },
  { icon: SiNextdotjs, label: "Next.js", color: "#ffffff" },
  { icon: SiTypescript, label: "TypeScript", color: "#3178c6" },
];

const outer: Item[] = [
  { icon: SiPostgresql, label: "PostgreSQL", color: "#4169e1" },
  { icon: SiDocker, label: "Docker", color: "#2496ed" },
  { icon: VscAzure, label: "Azure", color: "#0089d6" },
  { icon: SiFastify, label: "Fastify", color: "#ffffff" },
  { icon: SiRedis, label: "Redis", color: "#ff4438" },
  { icon: SiGithubactions, label: "GitHub Actions", color: "#2088ff" },
];

function Ring({ items, radius, inset, speed }: { items: Item[]; radius: string; inset: string; speed: string }) {
  return (
    <div className="orbit" style={{ "--inset": inset, "--speed": speed } as CSSProperties}>
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
      className="relative size-[300px] shrink-0 [--r1:78px] [--r2:140px] sm:size-[440px] sm:[--r1:115px] sm:[--r2:205px]"
    >
      <div className="absolute inset-[30%] rounded-full bg-violet-600/25 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-400/40 bg-gradient-to-br from-violet-600/70 to-sky-600/50 shadow-[0_0_50px_rgb(139_92_246/0.6)] sm:size-24">
        <Sparkles className="size-9 text-white" />
      </div>
      <Ring items={inner} radius="var(--r1)" inset="calc(50% - var(--r1))" speed="38s" />
      <Ring items={outer} radius="var(--r2)" inset="calc(50% - var(--r2))" speed="60s" />
    </div>
  );
}
