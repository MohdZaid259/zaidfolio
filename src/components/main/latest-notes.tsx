import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { AuroraText } from "../magicui/aurora-text";
import { formatDate, getAllNotes } from "@/lib/notes";

export default function LatestNotes() {
  const notes = getAllNotes().slice(0, 3);
  if (notes.length === 0) return null;

  return (
    <section id="notes" className="container flex flex-col items-center justify-center py-10 px-4 overflow-x-hidden">
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
        ✍️ <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
        <AnimatedGradientText className="text-xs md:text-sm font-medium">
          Engineering Notes
        </AnimatedGradientText>
        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </div>
      <h2 className="text-[32px] tracking-wider md:text-[40px] text-center font-semibold text-white">
        Things I&apos;ve <AuroraText>Figured Out</AuroraText>
      </h2>

      <div className="mt-10 grid w-full max-w-5xl gap-5 md:grid-cols-3">
        {notes.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            className="group flex flex-col rounded-2xl border border-white/10 bg-[#030014]/70 p-5 backdrop-blur-sm transition hover:border-purple-500/50"
          >
            <p className="text-xs text-gray-500">
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
