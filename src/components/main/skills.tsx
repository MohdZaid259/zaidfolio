import type { IconType } from "react-icons";
import {
  SiAmazons3,
  SiAnthropic,
  SiDocker,
  SiDrizzle,
  SiExpress,
  SiFastify,
  SiGithubactions,
  SiGooglegemini,
  SiJsonwebtokens,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiRedux,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import {
  FileSearch,
  KeyRound,
  ListOrdered,
  Lock,
  Network,
  Plug,
  Route,
  ShieldCheck,
  UsersRound,
  Waypoints,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { SKILL_GROUPS } from "@/constants";
import { SectionHeading } from "../ui/section-heading";

const ICONS: Record<string, { icon: IconType | LucideIcon; color: string }> = {
  OpenAI: { icon: SiOpenai, color: "#ffffff" },
  Claude: { icon: SiAnthropic, color: "#d97757" },
  Gemini: { icon: SiGooglegemini, color: "#8e75ff" },
  RAG: { icon: FileSearch, color: "#c4b5fd" },
  Embeddings: { icon: Waypoints, color: "#c4b5fd" },
  OpenRouter: { icon: Route, color: "#c4b5fd" },
  MCP: { icon: Plug, color: "#c4b5fd" },
  "Node.js": { icon: SiNodedotjs, color: "#5fa04e" },
  TypeScript: { icon: SiTypescript, color: "#3178c6" },
  Fastify: { icon: SiFastify, color: "#ffffff" },
  "Express.js": { icon: SiExpress, color: "#ffffff" },
  Python: { icon: SiPython, color: "#ffd43b" },
  "REST APIs": { icon: Network, color: "#93c5fd" },
  BullMQ: { icon: ListOrdered, color: "#f87171" },
  PostgreSQL: { icon: SiPostgresql, color: "#699eca" },
  Drizzle: { icon: SiDrizzle, color: "#c5f74f" },
  MongoDB: { icon: SiMongodb, color: "#47a248" },
  Redis: { icon: SiRedis, color: "#ff4438" },
  MySQL: { icon: SiMysql, color: "#4479a1" },
  Docker: { icon: SiDocker, color: "#2496ed" },
  "GitHub Actions": { icon: SiGithubactions, color: "#2088ff" },
  Azure: { icon: VscAzure, color: "#0089d6" },
  "AWS S3": { icon: SiAmazons3, color: "#569a31" },
  Vercel: { icon: SiVercel, color: "#ffffff" },
  "CI/CD": { icon: Workflow, color: "#93c5fd" },
  "Azure Entra ID": { icon: ShieldCheck, color: "#0089d6" },
  "OAuth 2.0 / OIDC": { icon: KeyRound, color: "#fbbf24" },
  JWT: { icon: SiJsonwebtokens, color: "#fb7185" },
  RBAC: { icon: UsersRound, color: "#a5b4fc" },
  "PostgreSQL RLS": { icon: Lock, color: "#699eca" },
  "Next.js": { icon: SiNextdotjs, color: "#ffffff" },
  React: { icon: SiReact, color: "#61dafb" },
  Redux: { icon: SiRedux, color: "#764abc" },
};

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="container mx-auto scroll-mt-20 px-4 py-10">
      <SectionHeading id="skills-heading" emoji="⚓" eyebrow="The Stack" title="What I" highlight="Build With" />

      <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map(({ group, items }) => (
          <div key={group} className="spotlight reveal rounded-2xl border border-white/10 bg-[#0a0720]/70 p-5 backdrop-blur-sm">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-purple-300">{group}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {items.map((name) => {
                const entry = ICONS[name];
                const Icon = entry?.icon;
                return (
                  <li
                    key={name}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-sm text-gray-200 transition hover:-translate-y-0.5 hover:border-purple-400/50 hover:bg-purple-500/10"
                  >
                    {Icon && <Icon aria-hidden className="size-4 shrink-0" style={{ color: entry.color }} />}
                    {name}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
