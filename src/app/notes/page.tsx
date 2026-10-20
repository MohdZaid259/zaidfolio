import type { Metadata } from "next";
import { getAllNotes } from "@/lib/notes";
import NotesList from "@/components/sub/notes-list";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Engineering notes by Mohd Zaid on backend systems, multi-tenant SaaS, auth, and AI products: what worked, what broke, and why.",
  alternates: { canonical: "/notes" },
};

export default function NotesIndex() {
  const notes = getAllNotes();

  return (
    <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-28 pb-24 md:pt-36">
      <p className="text-xs uppercase tracking-widest text-purple-400">Notes</p>
      <h1 className="mt-2 text-[34px] font-bold tracking-tight text-white sm:text-4xl md:text-5xl">Engineering notes</h1>
      <p className="mt-4 text-base leading-relaxed text-gray-300 sm:text-lg">
        Write-ups of problems I&apos;ve worked through in backend systems, multi-tenant SaaS, auth, and AI
        products. Each one is written so you can apply it to your own codebase.
      </p>

      <NotesList notes={notes} />
    </main>
  );
}
