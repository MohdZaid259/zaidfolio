"use client";

import Link from "next/link";
import { useState } from "react";
import type { NoteMeta } from "@/lib/notes";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function NotesList({ notes }: { notes: NoteMeta[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const tags = Array.from(new Set(notes.flatMap((note) => note.tags))).sort();
  const visible = tag ? notes.filter((note) => note.tags.includes(tag)) : notes;

  if (notes.length === 0) {
    return <p className="mt-12 text-gray-400">First notes are on the way.</p>;
  }

  return (
    <>
      {tags.length > 1 && (
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          <button
            onClick={() => setTag(null)}
            aria-pressed={tag === null}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              tag === null ? "border-purple-400 bg-purple-500/20 text-white" : "border-white/15 text-gray-300 hover:border-white/40"
            }`}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t === tag ? null : t)}
              aria-pressed={tag === t}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                tag === t ? "border-purple-400 bg-purple-500/20 text-white" : "border-white/15 text-gray-300 hover:border-white/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
        {visible.map((note) => (
          <li key={note.slug}>
            <Link href={`/notes/${note.slug}`} className="group block py-7">
              <p className="text-xs text-gray-500">
                {formatDate(note.date)} · {note.readingMinutes} min read
                {note.draft && <span className="ml-2 rounded bg-yellow-500/20 px-1.5 py-0.5 text-yellow-300">Draft</span>}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white group-hover:text-purple-300 md:text-2xl">
                {note.title}
              </h2>
              <p className="mt-2 leading-relaxed text-gray-400">{note.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {note.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-300">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
