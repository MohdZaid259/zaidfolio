import { Hero } from "@/components/main/hero";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";
import Testimonials from "@/components/main/testimonial";
import AboutMe from "@/components/sub/about";
import ContactSection from "@/components/sub/contact";

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
