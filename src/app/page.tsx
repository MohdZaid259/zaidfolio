import type { Metadata } from "next";
import { Hero } from "@/components/main/hero";
import AboutMe from "@/components/sub/about";
import Experience from "@/components/main/experience";
import Projects from "@/components/main/projects";
import Skills from "@/components/main/skills";
import Testimonials from "@/components/main/testimonial";
import LatestNotes from "@/components/main/latest-notes";
import ContactSection from "@/components/sub/contact";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: { absolute: "Mohd Zaid | AI Full-Stack Engineer" },
  description:
    "Mohd Zaid is an AI full-stack engineer building backend systems, multi-tenant SaaS and AI products with Node.js, Fastify, PostgreSQL, Next.js, Docker and Azure.",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "AI Full-Stack Software Engineer",
  url: "https://www.zaidfolio.space/",
  email: `mailto:${profile.contact.email}`,
  worksFor: { "@type": "Organization", name: "PGC Digital" },
  sameAs: [profile.contact.linkedin, profile.contact.github, "https://x.com/zaidrazvi09"],
  knowsAbout: ["Node.js", "Fastify", "PostgreSQL", "Multi-tenant SaaS", "RAG", "LLMs", "Docker", "Azure", "Next.js"],
};

export default function Home() {
  return (
    <main className="h-full w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <div className="flex flex-col gap-10">
        <Hero />
        <AboutMe />
        <Experience />
        <Projects />
        <Skills />
        <Testimonials />
        <LatestNotes />
        <ContactSection />
      </div>
    </main>
  );
}
