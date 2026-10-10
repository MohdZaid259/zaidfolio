import { AuroraText } from "../magicui/aurora-text";
import { TextReveal } from "../magicui/text-reveal";
import { SectionHeading } from "../ui/section-heading";

const STATS = [
  { value: "10+", label: "Projects Delivered" },
  { value: "5+", label: "International Clients" },
  { value: "3", label: "AI Workflows Integrated" },
];

export default function AboutMe() {
  return (
    <section
      id="about-me"
      aria-labelledby="about-heading"
      className="container relative mx-auto flex scroll-mt-20 flex-col items-center gap-8 px-4 py-24 md:px-20"
    >
      <SectionHeading id="about-heading" emoji="😎" eyebrow="Who Am I?" title="Meet the" highlight="Engineer" />
      <TextReveal>
        I'm Zaid, a full-stack software engineer at PGC Digital working on 10xTA, a multi-service recruitment
        platform: Fastify APIs, multi-tenant isolation with PostgreSQL row-level security, Azure Entra auth, CI/CD,
        and AI workflows for resume ranking and interviews. Before that I freelanced for international clients and
        built the backend of IntelliPrompt, an AI prompt SaaS.
      </TextReveal>
      <dl className="reveal mt-4 grid w-full max-w-3xl grid-cols-3 gap-4 text-center">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="mt-1 text-xs text-gray-400 md:text-sm">{s.label}</dt>
            <dd className="text-3xl font-bold md:text-4xl">
              <AuroraText>{s.value}</AuroraText>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
