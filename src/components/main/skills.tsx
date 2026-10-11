import type { CSSProperties } from "react";
import Image from "next/image";
import type { IconType } from "react-icons";
import {
  SiAnthropic,
  SiDocker,
  SiDrizzle,
  SiFastify,
  SiGithubactions,
  SiGooglegemini,
  SiOpenai,
  SiPostgresql,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { LazyVideo } from "../ui/lazy-video";
import { SectionHeading } from "../ui/section-heading";

// Brand PNG logo, or a brand-colored SVG icon for tools without a PNG
type Logo =
  | { name: string; png: string; width: number; invert?: boolean }
  | { name: string; icon: IconType; color: string };

// Rows narrow toward the bottom, forming the funnel over the background video
const ROWS: Logo[][] = [
  [
    { name: "Next.js", png: "next.png", width: 110 },
    { name: "TypeScript", png: "ts.png", width: 64 },
    { name: "React", png: "react.png", width: 56 },
    { name: "Node.js", png: "node.png", width: 56 },
    { name: "Fastify", icon: SiFastify, color: "#ffffff" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#699eca" },
    { name: "Docker", icon: SiDocker, color: "#2496ed" },
    { name: "OpenAI", icon: SiOpenai, color: "#ffffff" },
    { name: "Redis", png: "redis.png", width: 70 },
    { name: "MongoDB", png: "mongodb.png", width: 48 },
  ],
  [
    { name: "Claude", icon: SiAnthropic, color: "#d97757" },
    { name: "Gemini", icon: SiGooglegemini, color: "#8e75ff" },
    { name: "Azure", icon: VscAzure, color: "#0089d6" },
    { name: "GitHub Actions", icon: SiGithubactions, color: "#2088ff" },
    { name: "Drizzle", icon: SiDrizzle, color: "#c5f74f" },
    { name: "Express", png: "express.png", width: 64 },
    { name: "Python", png: "python.png", width: 60 },
  ],
  [
    { name: "AWS", png: "aws.png", width: 80, invert: true },
    { name: "Vercel", png: "vercel.png", width: 50 },
    { name: "Redux", png: "redux.png", width: 60 },
    { name: "MySQL", png: "mysql.png", width: 96 },
  ],
  [
    { name: "Git", png: "git.png", width: 60 },
    { name: "Postman", png: "postman.png", width: 60 },
  ],
  [{ name: "GitHub", png: "github.png", width: 62 }],
];

// Natural width/height of each PNG, so the rendered box keeps the real aspect ratio
const RATIO: Record<string, number> = {
  "next.png": 80 / 394,
  "ts.png": 118 / 119,
  "node.png": 442 / 374,
  "redis.png": 2148 / 2500,
  "aws.png": 2400 / 4000,
  "vercel.png": 444 / 448,
  "redux.png": 1691 / 1798,
};

function LogoItem({ logo, delay }: { logo: Logo; delay: number }) {
  return (
    <li
      className="skill-logo group relative flex h-16 items-center justify-center"
      style={{ "--i": delay } as CSSProperties}
    >
      {"png" in logo ? (
        <Image
          src={`/skills/${logo.png}`}
          alt={logo.name}
          width={logo.width}
          height={Math.round(logo.width * (RATIO[logo.png] ?? 1))}
          className={`h-auto transition duration-300 group-hover:scale-110 ${logo.invert ? "invert" : ""}`}
          style={{ width: logo.width }}
        />
      ) : (
        <logo.icon
          role="img"
          aria-label={logo.name}
          className="size-14 transition duration-300 group-hover:scale-110"
          style={{ color: logo.color }}
        />
      )}
      <span className="pointer-events-none absolute -bottom-6 whitespace-nowrap rounded-md bg-black/70 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100">
        {logo.name}
      </span>
    </li>
  );
}

export default function Skills() {
  let index = 0;
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="container relative mx-auto flex scroll-mt-20 flex-col items-center gap-3 overflow-hidden px-4 py-10"
    >
      <SectionHeading id="skills-heading" emoji="⚓" eyebrow="The Tech Stack" title="Building with" highlight="Modern Technologies" />

      <div className="relative mt-8 w-full">
        {/* Background video behind the logos (desktop), loaded when the section is near */}
        <div aria-hidden className="absolute inset-0 -z-10 hidden items-center justify-center opacity-30 md:flex">
          <LazyVideo src="/videos/skills-bg.webm" className="h-auto w-full" />
        </div>

        <div className="flex flex-col items-center gap-8 md:gap-10">
          {ROWS.map((row, r) => (
            <ul key={r} className="flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12">
              {row.map((logo) => (
                <LogoItem key={logo.name} logo={logo} delay={index++ % 10} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
