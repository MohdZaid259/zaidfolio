import type { Metadata } from "next";
import { Hero } from "@/components/main/hero";
import dynamic from "next/dynamic";
import LatestNotes from "@/components/main/latest-notes";

const AboutMe = dynamic(() => import("@/components/sub/about"), { ssr: false });
const Experience = dynamic(() => import("@/components/main/experience"), { ssr: false });
const Skills = dynamic(() => import("@/components/main/skills"), { ssr: false });
const Projects = dynamic(() => import("@/components/main/projects"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/main/testimonial"), { ssr: false });
const ContactSection = dynamic(() => import("@/components/sub/contact"), { ssr: false });

export const metadata: Metadata = {
  title: { absolute: "Mohd Zaid | Full-Stack Software Engineer" },
  description: "Mohd Zaid is a full-stack software engineer building backend systems, multi-tenant SaaS and AI-powered products with Node.js, Fastify, PostgreSQL, Next.js and Azure.",
};

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-10">
        <Hero />
        <AboutMe/>
        <Experience />
        <Projects />
        <Skills />
        <Testimonials/>
        <LatestNotes />
        <ContactSection/>
      </div>
    </main>
  );
}
