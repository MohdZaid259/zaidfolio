import { SkillDataProvider } from "@/components/sub/skill-data-provider";
import { SkillText } from "@/components/sub/skill-text";
import {
  SKILL_GROUPS,
  BACKEND_SKILL,
  FRONTEND_SKILL,
  FULLSTACK_SKILL,
  OTHER_SKILL,
  SKILL_DATA,
} from "@/constants";

export default function Skills () {
  return (
    <section
      id="skills"
      style={{ transform: "scale(0.9)" }}
      className="container flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden py-10"
    >
      <SkillText />
      
      {/* Mobile layout */}
      <div className="grid grid-cols-4 gap-6 md:hidden mt-6 place-items-center">
        {SKILL_DATA.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}

        {FRONTEND_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}

        {BACKEND_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}

        {FULLSTACK_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}

        {OTHER_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>

        <div className="hidden md:flex flex-row justify-around flex-wrap mt-4 gap-10 items-center">
          {SKILL_DATA.map((skill, i) => (
            <SkillDataProvider
              key={skill.skill_name}
              src={skill.image}
              name={skill.skill_name}
              width={skill.width}
              height={skill.height}
              index={i}
            />
          ))}
        </div>
        <div className="hidden md:flex flex-row justify-around flex-wrap gap-10 items-center">
          {FRONTEND_SKILL.map((skill, i) => (
            <SkillDataProvider
              key={skill.skill_name}
              src={skill.image}
              name={skill.skill_name}
              width={skill.width}
              height={skill.height}
              index={i}
            />
          ))}
        </div>
        <div className="hidden md:flex flex-row justify-around flex-wrap gap-10 items-center">
          {BACKEND_SKILL.map((skill, i) => (
            <SkillDataProvider
              key={skill.skill_name}
              src={skill.image}
              name={skill.skill_name}
              width={skill.width}
              height={skill.height}
              index={i}
            />
          ))}
        </div>
        <div className="hidden md:flex flex-row justify-around flex-wrap gap-10 items-center">
          {FULLSTACK_SKILL.map((skill, i) => (
            <SkillDataProvider
              key={skill.skill_name}
              src={skill.image}
              name={skill.skill_name}
              width={skill.width}
              height={skill.height}
              index={i}
            />
          ))}
        </div>
        <div className="hidden md:flex flex-row justify-around flex-wrap mt-4 gap-5 items-center">
          {OTHER_SKILL.map((skill, i) => (
            <SkillDataProvider
              key={skill.skill_name}
              src={skill.image}
              name={skill.skill_name}
              width={skill.width}
              height={skill.height}
              index={i}
            />
          ))}
        </div>
      
      {/* Grouped stack, kept in sync with the resume */}
      <dl className="mt-12 w-full max-w-4xl grid grid-cols-1 gap-x-8 gap-y-4 px-4 sm:grid-cols-2">
        {SKILL_GROUPS.map(({ group, items }) => (
          <div key={group} className="rounded-xl border border-white/10 bg-[#030014]/70 p-4 backdrop-blur-sm">
            <dt className="text-xs uppercase tracking-widest text-purple-400">{group}</dt>
            <dd className="mt-2 text-sm text-gray-200 leading-relaxed">{items.join(" · ")}</dd>
          </div>
        ))}
      </dl>

      <div className="w-full hidden md:block md:mt-16 h-full absolute">
        <div className="w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover">
          <video
            className="w-full h-auto"
            preload="none"
            playsInline
            loop
            muted
            autoPlay
          >
            <source src="/videos/skills-bg.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
};
