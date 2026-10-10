import { SectionHeading } from "../ui/section-heading";
import ProjectSection from "../sub/projectSection";
import { projects } from "@/data/projects";

// Only the fields the carousel shows go to the client; case-study text stays on the server
const carouselProjects = projects.map(
  ({ slug, name, kind, role, summary, image, technologies, live, github, githubLabel }) => ({
    slug,
    name,
    kind,
    role,
    summary,
    image,
    technologies,
    live,
    github,
    githubLabel,
  }),
);

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="container mx-auto flex scroll-mt-20 flex-col items-center justify-center overflow-x-hidden py-10"
    >
      <SectionHeading id="projects-heading" emoji="🔥" eyebrow="My Recent Works" title="Projects That" highlight="Speak Volumes" />
      <ProjectSection projects={carouselProjects} />
    </section>
  );
}
