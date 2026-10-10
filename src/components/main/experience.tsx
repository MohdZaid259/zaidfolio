import { ChevronRight } from "lucide-react";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { AuroraText } from "../magicui/aurora-text";
import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <section
      id="experience"
      className="container flex flex-col items-center justify-center py-10 px-4 overflow-x-hidden"
    >
      <div className="group relative max-w-max flex items-center mb-2 justify-center rounded-full px-2 pl-3 md:px-4 py-1 md:py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
        <span
          className="absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
            WebkitClipPath: "padding-box",
          }}
        />
        💼 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
        <AnimatedGradientText className="text-xs md:text-sm font-medium">
          Where I&apos;ve Worked
        </AnimatedGradientText>
        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </div>
      <h2 className="text-[32px] tracking-wider md:text-[40px] text-center font-semibold text-white">
        Work <AuroraText>Experience</AuroraText>
      </h2>

      <ol className="relative mt-12 w-full max-w-4xl border-l border-purple-500/30 md:ml-0">
        {experience.map((job) => (
          <li key={job.company} className="relative mb-12 pl-6 md:pl-10 last:mb-0">
            <span
              className={`absolute -left-[7px] top-2 size-3.5 rounded-full border-2 border-[#030014] ${
                job.current ? "bg-purple-400 shadow-[0_0_12px_#a855f7]" : "bg-purple-800"
              }`}
            />
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                {job.role} <span className="text-purple-400">· {job.company}</span>
              </h3>
              <p className="text-sm text-gray-400 shrink-0">
                {job.period}
                {job.current && (
                  <span className="ml-2 rounded-full bg-green-500/15 px-2 py-0.5 text-xs text-green-400">Current</span>
                )}
              </p>
            </div>
            {job.product && <p className="mt-1 text-sm text-gray-400">{job.product}</p>}
            <ul className="mt-4 space-y-2 text-gray-300 font-baloo-bhai-2 text-base md:text-lg leading-relaxed">
              {job.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-purple-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.stack.map((tech) => (
                <span key={tech} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-gray-200">
                  {tech}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
