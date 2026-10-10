import Link from "next/link";
import { Mail } from "lucide-react";
import { SOCIALSFOOTER } from "@/constants";
import { SectionHeading } from "../ui/section-heading";

const EMAIL = "razvizaid259@gmail.com";

function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="container relative mx-auto scroll-mt-24 px-4 py-16">
      {/* Decorative planet with an orbiting moon, CSS only */}
      <div aria-hidden className="pointer-events-none absolute -top-6 right-[8%] hidden size-40 md:block">
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-600 to-indigo-900 shadow-[0_0_80px_rgb(168_85_247/0.55)]" />
        <div className="orbit" style={{ ["--inset" as string]: "0", ["--speed" as string]: "14s" }}>
          <div style={{ ["--angle" as string]: "0deg", ["--radius" as string]: "80px" }}>
            <div className="m-[15px] size-3.5 rounded-full bg-sky-300 shadow-[0_0_14px_#7dd3fc]" />
          </div>
        </div>
      </div>

      <SectionHeading id="contact-heading" emoji="👋" eyebrow="Say Hello" title="Let's have a" highlight="Convo" />

      <div className="spotlight reveal mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-[#0a0720]/70 p-6 text-center backdrop-blur-sm md:p-10">
        <p className="text-lg text-gray-300">
          Hiring, have a project in mind, or just want to talk shop? I&apos;d love to hear from you.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-500"
        >
          <Mail aria-hidden className="size-5" /> {EMAIL}
        </a>
        <p className="mt-4 text-sm text-gray-400">
          Freelance project?{" "}
          <Link href="/services" className="font-medium text-purple-300 hover:underline">
            See services
          </Link>
        </p>
        <ul className="mt-8 flex justify-center gap-3">
          {SOCIALSFOOTER.map(({ link, name, icon: Icon }) => (
            <li key={name}>
              <a
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={name}
                className="flex size-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:-translate-y-0.5 hover:border-purple-400 hover:text-purple-300"
              >
                <Icon className="size-5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ContactSection;
