import { getAllNotes } from "@/lib/notes";

export const dynamic = "force-static";

const BASE = "https://www.zaidfolio.space";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getAllNotes()
    .map(
      (note) => `    <item>
      <title>${escape(note.title)}</title>
      <link>${BASE}/notes/${note.slug}</link>
      <guid>${BASE}/notes/${note.slug}</guid>
      <description>${escape(note.description)}</description>
      <pubDate>${new Date(note.date).toUTCString()}</pubDate>
${note.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mohd Zaid — Engineering notes</title>
    <link>${BASE}/notes</link>
    <description>Notes on backend systems, multi-tenant SaaS, auth, and AI products.</description>
    <language>en</language>
    <atom:link href="${BASE}/notes/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
