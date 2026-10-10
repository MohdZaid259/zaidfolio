import { SectionHeading } from "../ui/section-heading";
import Link from "next/link";
import { formatDate, getAllNotes } from "@/lib/notes";

export default function LatestNotes() {
  const notes = getAllNotes().slice(0, 3);
  if (notes.length === 0) return null;

  return (
    <section id="notes" aria-labelledby="notes-heading" className="container mx-auto flex flex-col items-center justify-center px-4 py-10">
      <SectionHeading id="notes-heading" emoji="✍️" eyebrow="Engineering Notes" title="Things I've" highlight="Figured Out" />

      <div className="mt-10 grid w-full max-w-5xl gap-5 md:grid-cols-3">
        {notes.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            className="spotlight reveal group flex flex-col rounded-2xl border border-white/10 bg-[#030014]/70 p-5 backdrop-blur-sm transition hover:border-purple-500/50"
          >
            <p className="text-xs text-gray-400">
              {formatDate(note.date)} · {note.readingMinutes} min read
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-snug text-white group-hover:text-purple-300">
              {note.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-400">{note.description}</p>
          </Link>
        ))}
      </div>
      <Link href="/notes" className="mt-8 text-sm font-medium text-purple-400 hover:text-purple-300 hover:underline">
        All notes →
      </Link>
    </section>
  );
}
