import { experience } from "@/data/experience";
import { SectionHeading } from "../ui/section-heading";
import { ExpandablePoints } from "../sub/expandable-points";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="container mx-auto scroll-mt-20 px-4 py-10">
      <SectionHeading id="experience-heading" emoji="💼" eyebrow="Where I've Worked" title="Work" highlight="Experience" />

      <ol className="relative mx-auto mt-12 max-w-4xl border-l border-purple-500/30">
        {experience.map((job) => {
          return (
            <li key={job.company} className="reveal relative mb-12 pl-6 last:mb-0 md:pl-10">
              <span
                aria-hidden
                className={`absolute -left-[7px] top-2 size-3.5 rounded-full border-2 border-[#030014] ${
                  job.current ? "bg-purple-400 shadow-[0_0_12px_#a855f7]" : "bg-purple-800"
                }`}
              />
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {job.role} <span className="text-purple-400">· {job.company}</span>
                </h3>
                <p className="shrink-0 text-sm text-gray-400">
                  {job.period}
                  {job.current && (
                    <span className="ml-2 rounded-full bg-green-500/15 px-2 py-0.5 text-xs text-green-400">Current</span>
                  )}
                </p>
              </div>
              {job.product && <p className="mt-1 text-sm text-gray-400">{job.product}</p>}

              <ExpandablePoints points={job.points} />

              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
                {job.stack.map((tech) => (
                  <li key={tech} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-gray-200">
                    {tech}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
