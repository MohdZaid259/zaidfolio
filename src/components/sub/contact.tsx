import Link from "next/link";
import { SOCIALSFOOTER } from "@/constants";
import { AuroraText } from "../magicui/aurora-text";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { LazyGlobe } from "../ui/lazy-globe";

const EMAIL = "razvizaid259@gmail.com";

function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="container relative mx-auto flex scroll-mt-24 items-center justify-between gap-8 overflow-hidden px-6 py-16 md:px-20"
    >
      <div className="reveal max-w-xl">
        <div className="relative flex w-max items-center rounded-full px-3 py-1 shadow-[inset_0_-8px_10px_#8fdfff1f] md:px-4 md:py-1.5">
          <span aria-hidden className="pill-border absolute inset-0 rounded-[inherit]" />
          <span aria-hidden>👋</span>
          <hr className="mx-2 h-4 w-px shrink-0 border-0 bg-neutral-500" />
          <AnimatedGradientText className="text-xs font-medium md:text-sm">Say Hello</AnimatedGradientText>
        </div>
        <h2 id="contact-heading" className="mt-3 text-[32px] font-semibold text-white sm:text-[40px]">
          Let&apos;s have a <AuroraText>Convo</AuroraText>
        </h2>
        <p className="text-gray-300">Have an idea, project, or just a question? I&apos;d love to hear from you.</p>

        <ul className="mt-6 flex gap-4 md:gap-6">
          {SOCIALSFOOTER.map(({ link, name, icon: Icon }) => (
            <li key={name}>
              <a
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={name}
                className="group flex min-h-11 flex-col items-center justify-center"
              >
                <Icon className="size-7 text-white transition duration-500 group-hover:translate-y-1 group-hover:text-violet-400 md:size-9" />
                <span className="mt-2 h-0.5 w-8 scale-x-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 transition duration-500 group-hover:scale-x-100 group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-gray-300">
          or mail at{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="bg-gradient-to-br from-violet-400 to-blue-400 bg-clip-text font-semibold text-transparent"
          >
            {EMAIL}
          </a>
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Freelance project?{" "}
          <Link href="/services" className="text-purple-300 underline underline-offset-2 hover:text-purple-200">
            See services
          </Link>
        </p>
      </div>

      <div className="hidden shrink-0 sm:block">
        <LazyGlobe />
      </div>
    </section>
  );
}

export default ContactSection;
