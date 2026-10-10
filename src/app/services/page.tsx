import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { faqs, pricingNote, process, services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { EnquiryForm } from "@/components/sub/enquiry-form";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Freelance full-stack development by Mohd Zaid: business websites, SaaS MVPs, backend and multi-tenant APIs, and AI features, each backed by shipped work.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-28 pb-24 text-gray-300 md:pt-36">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-widest text-purple-400">Services</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight text-white md:text-5xl">
          Websites, products and backends, built end to end
        </h1>
        <p className="mt-4 text-lg leading-relaxed">
          I build for startups and growing businesses, from first requirements through deployment and handover.
          Everything below links to work I&apos;ve actually shipped.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#enquire" className="rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500">
            Start a project
          </a>
          <Link href="/#projects" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white hover:border-purple-400">
            See projects
          </Link>
        </div>
      </header>

      <section className="mt-16 grid gap-5 md:grid-cols-2" aria-label="What I offer">
        {services.map((service) => (
          <article key={service.id} id={service.id} className="flex flex-col rounded-2xl border border-white/10 bg-[#030014]/70 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white">{service.title}</h2>
            <p className="mt-2 leading-relaxed">{service.summary}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-purple-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {service.stack.map((tech) => (
                <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-5 text-sm">
              <span className="text-gray-400">Proof: </span>
              {service.proof.map((p, i) => (
                <span key={p.href + p.label}>
                  {i > 0 && <span className="text-gray-400"> · </span>}
                  <Link href={p.href} className="text-purple-300 hover:underline">
                    {p.label}
                  </Link>
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-20" aria-labelledby="process-heading">
        <h2 id="process-heading" className="text-2xl font-semibold text-white md:text-3xl">How a project runs</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {process.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <span className="font-mono text-sm text-purple-400">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-semibold text-white">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-400">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20" aria-labelledby="clients-heading">
        <h2 id="clients-heading" className="text-2xl font-semibold text-white md:text-3xl">What clients said</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl border border-purple-500/25 bg-purple-500/[0.05] p-5">
              <blockquote className="leading-relaxed text-gray-200">“{t.quote}”</blockquote>
              <figcaption className="mt-auto pt-4 text-sm">
                <span className="font-semibold text-white">{t.name}</span>
                <span className="text-gray-400"> · {t.designation}</span>
                <Link href={`/work/${t.projectSlug}`} className="mt-1 flex items-center gap-1 text-purple-300 hover:underline">
                  See the project <ArrowRight className="size-3.5" />
                </Link>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-20 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-semibold text-white md:text-3xl">Questions</h2>
        <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-medium text-white marker:hidden">
                <span className="mr-2 inline-block text-purple-400 transition group-open:rotate-45">+</span>
                {f.q}
              </summary>
              <p className="mt-2 pl-5 leading-relaxed text-gray-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="enquire" className="mt-20 scroll-mt-28 rounded-3xl border border-white/10 bg-[#0b0620]/80 p-6 backdrop-blur-sm md:p-10" aria-labelledby="enquire-heading">
        <h2 id="enquire-heading" className="text-2xl font-semibold text-white md:text-3xl">Tell me about your project</h2>
        <p className="mt-2 text-gray-400">
          Or message me on{" "}
          <a href="https://wa.me/+919795372555" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-purple-300 hover:underline">
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
