import { TextReveal } from "../magicui/text-reveal";
import { SectionHeading } from "../ui/section-heading";


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
    </section>
  );
}
