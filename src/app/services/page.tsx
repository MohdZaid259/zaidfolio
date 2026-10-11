import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  ClipboardList,
  Code2,
  Globe,
  LifeBuoy,
  MessagesSquare,
  Rocket,
  Server,
  type LucideIcon,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { faqs, pricingNote, process, services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { EnquiryForm } from "@/components/sub/enquiry-form";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Flag } from "@/components/ui/flag";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Freelance full-stack development by Mohd Zaid: business websites, SaaS MVPs, backend and multi-tenant APIs, and AI features, each backed by shipped work.",
  alternates: { canonical: "/services" },
};

const SERVICE_STYLE: Record<string, { icon: LucideIcon; gradient: string }> = {
  websites: { icon: Globe, gradient: "from-sky-500 to-indigo-600" },
  saas: { icon: Rocket, gradient: "from-fuchsia-500 to-violet-600" },
  backend: { icon: Server, gradient: "from-emerald-500 to-teal-600" },
  ai: { icon: Bot, gradient: "from-orange-500 to-pink-600" },
};

const STEP_ICONS: LucideIcon[] = [MessagesSquare, ClipboardList, Code2, Rocket, LifeBuoy];

export default function ServicesPage() {
  return (
    <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-28 pb-24 text-gray-300 md:pt-36">
      {/* Hero */}
      <header className="relative mx-auto max-w-3xl text-center">
        <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/25 blur-3xl" />
        <p className="text-xs uppercase tracking-widest text-purple-300">Services</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-white md:text-6xl">
          Let&apos;s build your <AuroraText>next product</AuroraText>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg">From idea to production, end to end.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#enquire" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-purple-600 px-6 font-medium text-white transition hover:bg-purple-500">
            Start a project <ArrowRight className="size-4" />
          </a>
          <Link href="/#projects" className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 font-medium text-white transition hover:border-purple-400">
            See projects
          </Link>
        </div>
      </header>

      {/* What I build */}
      <section className="mt-20 grid gap-5 sm:grid-cols-2" aria-label="What I build">
        {services.map((service) => {
          const { icon: Icon, gradient } = SERVICE_STYLE[service.id] ?? SERVICE_STYLE.websites!;
          return (
            <article
              key={service.id}
              id={service.id}
              className="spotlight reveal group flex flex-col rounded-3xl border border-white/10 bg-[#0a0720]/70 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-purple-400/40"
            >
              <div className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg shadow-purple-900/40 transition group-hover:scale-105`}>
                <Icon aria-hidden className="size-7 text-white" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-white">{service.title}</h2>
              <p className="mt-1">{service.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
                {service.stack.slice(0, 5).map((tech) => (
                  <li key={tech} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-gray-200">
                    {tech}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 text-sm">
                {service.proof.map((p) => (
                  <Link key={p.href + p.label} href={p.href} className="inline-flex min-h-8 items-center gap-1 text-purple-300 hover:text-purple-200">
                    {p.label} <ArrowRight aria-hidden className="size-3.5" />
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      {/* How it runs */}
      <section className="mt-24" aria-labelledby="process-heading">
        <h2 id="process-heading" className="text-center text-2xl font-semibold text-white md:text-3xl">
          How it <AuroraText>works</AuroraText>
        </h2>
        <div className="relative mt-12">
        <div aria-hidden className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-gradient-to-r from-sky-500/0 via-purple-500/70 to-sky-500/0 sm:block" />
        <ol className="relative grid grid-cols-2 gap-8 sm:grid-cols-5">
          {process.map((step, i) => {
            const Icon = STEP_ICONS[i] ?? Code2;
            return (
              <li key={step.title} className="reveal relative flex flex-col items-center text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-purple-400/40 bg-[#120a2e] shadow-[0_0_24px_rgb(168_85_247/0.35)]">
                  <Icon aria-hidden className="size-6 text-purple-200" />
                </div>
                <h3 className="mt-3 font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{step.detail}</p>
              </li>
            );
          })}
        </ol>
        </div>
      </section>

      {/* Clients */}
      <section className="mt-24" aria-labelledby="clients-heading">
        <h2 id="clients-heading" className="text-center text-2xl font-semibold text-white md:text-3xl">
          Clients <AuroraText>say</AuroraText>
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="spotlight reveal flex flex-col rounded-3xl border border-purple-500/20 bg-purple-500/[0.05] p-5">
              <span aria-hidden className="text-4xl leading-none text-purple-400">“</span>
              <blockquote className="line-clamp-4 text-gray-200">{t.quote}</blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-5 text-sm">
                <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-700 text-xs font-bold text-white">
                  {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <span>
                  <span className="flex items-center gap-2 font-semibold text-white">
                    {t.name} <Flag code={t.country} />
                  </span>
                  <span className="text-gray-400">{t.designation}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ + enquiry */}
      <section className="mx-auto mt-24 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-center text-2xl font-semibold text-white md:text-3xl">Questions</h2>
        <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-medium text-white [&::-webkit-details-marker]:hidden">
                <span aria-hidden className="text-purple-400 transition group-open:rotate-45">+</span>
                {f.q}
              </summary>
              <p className="mt-2 pl-5 text-gray-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section
        id="enquire"
        className="relative mx-auto mt-20 max-w-4xl scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0620]/80 p-6 backdrop-blur-sm md:p-10"
        aria-labelledby="enquire-heading"
      >
        <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <h2 id="enquire-heading" className="text-2xl font-semibold text-white md:text-3xl">Tell me about your project</h2>
        <p className="mt-2 text-gray-400">
          Or message me on{" "}
          <a href="https://wa.me/+919795372555" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-purple-300 underline underline-offset-2 hover:text-purple-200">
            <FaWhatsapp className="size-4" /> WhatsApp
          </a>
          .
        </p>
        {pricingNote && <p className="mt-2 text-sm text-gray-300">{pricingNote}</p>}
        <div className="mt-8">
          <EnquiryForm services={services.map(({ id, title }) => ({ id, title }))} />
        </div>
      </section>
    </main>
  );
}
