import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: `${project.name} — case study`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${project.name} — case study`, description: project.summary },
  };
}

export default function CaseStudy({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const testimonial = testimonials.find((t) => t.projectSlug === project.slug);

  return (
    <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-28 pb-24 text-gray-300 md:pt-36">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="size-4" /> All projects
      </Link>

      <p className="mt-8 text-xs uppercase tracking-widest text-purple-400">{project.kind}</p>
      <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">{project.name}</h1>
      <p className="mt-4 text-lg leading-relaxed md:text-xl">{project.summary}</p>

      <dl className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-gray-500">My role</dt>
          <dd className="mt-1 text-white">{project.role}</dd>
        </div>
        {project.period && (
          <div>
            <dt className="text-gray-500">When</dt>
            <dd className="mt-1 text-white">{project.period}</dd>
          </div>
        )}
        <div className="sm:col-span-2">
          <dt className="text-gray-500">Stack</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-gray-200">
                {tech}
              </span>
            ))}
          </dd>
        </div>
        {(project.live || project.github) && (
          <div className="flex flex-wrap gap-5 sm:col-span-2">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-purple-400 hover:text-purple-300">
                Live site <ArrowUpRight className="size-4" />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-purple-400 hover:text-purple-300">
                {project.githubLabel ?? "Source on GitHub"} <ArrowUpRight className="size-4" />
              </a>
            )}
          </div>
        )}
      </dl>

      <Image
        src={project.image}
        alt={`${project.name} screenshot`}
        width={1200}
        height={750}
        sizes="(max-width: 768px) 100vw, 768px"
        priority
        unoptimized={project.image.endsWith(".svg")}
        className="mt-10 h-auto w-full rounded-2xl border border-white/10"
      />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-white">The problem</h2>
        <p className="mt-3 leading-relaxed">{project.context}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">What I built</h2>
        <ul className="mt-4 space-y-3">
          {project.built.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-purple-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {testimonial && (
        <figure className="mt-12 rounded-2xl border border-purple-500/30 bg-purple-500/[0.06] p-6">
          <blockquote className="text-lg leading-relaxed text-gray-200">“{testimonial.quote}”</blockquote>
          <figcaption className="mt-4 text-sm text-gray-400">
            <span className="font-semibold text-white">{testimonial.name}</span> · {testimonial.designation}
          </figcaption>
        </figure>
      )}

      <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/work/${next.slug}`} className="group text-gray-400 hover:text-white">
          <span className="block text-xs uppercase tracking-widest">Next case study</span>
          <span className="text-lg font-semibold text-white group-hover:underline">{next.name} →</span>
        </Link>
        <Link href="/#contact" className="rounded-full bg-purple-700/70 px-5 py-2 text-center text-sm font-medium text-white hover:bg-purple-600">
          Work with me
        </Link>
      </div>
    </main>
  );
}
