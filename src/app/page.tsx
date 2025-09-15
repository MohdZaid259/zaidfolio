import type { Metadata } from "next";
import { Hero } from "@/components/main/hero";
import dynamic from "next/dynamic";

const AboutMe = dynamic(() => import("@/components/sub/about"), { ssr: false });
const Skills = dynamic(() => import("@/components/main/skills"), { ssr: false });
const Projects = dynamic(() => import("@/components/main/projects"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/main/testimonial"), { ssr: false });
const ContactSection = dynamic(() => import("@/components/sub/contact"), { ssr: false });

export const metadata: Metadata = {
  title: "Portfolio | Zaid – Full-Stack Developer & Designer",
  description:
    "Welcome to Zaid's portfolio. Explore modern web development projects, UI/UX designs, and creative problem-solving in full-stack development. Let's build something amazing together.",
  keywords: [
    "Zaid Portfolio",
    "Full-Stack Developer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "JavaScript",
    "Freelance Developer",
    "Hire Web Developer",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    title: "Zaid Portfolio – Full-Stack Developer & Designer",
    description:
      "Discover Zaid’s work in full-stack development and creative design. Professional portfolio showcasing projects, skills, and digital solutions.",
    siteName: "Zaid Portfolio",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zaid Portfolio Homepage Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaid Portfolio – Full-Stack Developer & Designer",
    description:
      "Explore Zaid’s portfolio of full-stack development and creative design projects.",
    images: ["https://yourdomain.com/og-image.png"],
    creator: "@yourTwitterHandle",
  },
};

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-10">
        <Hero />
        <AboutMe/>
        <Skills />
        <Projects />
        <Testimonials/>
        <ContactSection/>
      </div>
    </main>
  );
}
