import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatDate, getAllNotes, getNote } from "@/lib/notes";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const note = await getNote(params.slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.description,
    keywords: note.tags,
    alternates: { canonical: `/notes/${note.slug}` },
    robots: note.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: note.title,
      description: note.description,
      publishedTime: note.date,
      modifiedTime: note.updated ?? note.date,
      authors: ["Mohd Zaid"],
      tags: note.tags,
    },
  };
}

export default async function NotePage({ params }: { params: { slug: string } }) {
  const note = await getNote(params.slug);
  if (!note) notFound();

  const all = getAllNotes();
  const index = all.findIndex((n) => n.slug === note.slug);
  const newer = all[index - 1];
  const older = all[index + 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: note.title,
    description: note.description,
    datePublished: note.date,
    dateModified: note.updated ?? note.date,
    keywords: note.tags.join(", "),
    author: { "@type": "Person", name: "Mohd Zaid", url: "https://www.zaidfolio.space/" },
    mainEntityOfPage: `https://www.zaidfolio.space/notes/${note.slug}`,
  };

  return (
    <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-28 pb-24 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
        <article className="min-w-0 max-w-3xl">
          <Link href="/notes" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft className="size-4" /> All notes
          </Link>

          {note.draft && (
            <p className="mt-6 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-200">
              Draft: only visible in development. Set <code>draft: false</code> to publish.
            </p>
          )}

          <header className="mt-8">
            <p className="text-sm text-gray-400">
              <time dateTime={note.date}>{formatDate(note.date)}</time>
              {note.updated && <> · Updated <time dateTime={note.updated}>{formatDate(note.updated)}</time></>}
              {" · "}
              {note.readingMinutes} min read
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-white md:text-5xl">{note.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-300">{note.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="note-prose prose prose-invert mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: note.html }} />

          <aside className="mt-16 rounded-2xl border border-purple-500/30 bg-purple-500/[0.06] p-6">
            <p className="font-semibold text-white">Working on something similar?</p>
            <p className="mt-2 text-gray-300">
              I&apos;m happy to compare notes, or help if you&apos;re hiring.{" "}
              <Link href="/#contact" className="text-purple-400 hover:underline">
                Get in touch
              </Link>
              .
            </p>
          </aside>

          <nav className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2" aria-label="More notes">
            {older ? (
              <Link href={`/notes/${older.slug}`} className="group">
                <span className="block text-xs uppercase tracking-widest text-gray-400">Older</span>
                <span className="text-white group-hover:underline">{older.title}</span>
              </Link>
            ) : <span />}
            {newer && (
              <Link href={`/notes/${newer.slug}`} className="group sm:text-right">
                <span className="block text-xs uppercase tracking-widest text-gray-400">Newer</span>
                <span className="text-white group-hover:underline">{newer.title}</span>
              </Link>
            )}
          </nav>
        </article>

        {note.headings.length > 0 && (
          <aside className="hidden lg:block">
            <nav className="sticky top-28 text-sm" aria-label="Table of contents">
              <p className="text-xs uppercase tracking-widest text-gray-400">On this page</p>
              <ul className="mt-3 space-y-2 border-l border-white/10">
                {note.headings.map((h) => (
                  <li key={h.id} className={h.depth === 3 ? "pl-6" : "pl-3"}>
                    <a href={`#${h.id}`} className="text-gray-400 hover:text-white">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>
    </main>
  );
}
