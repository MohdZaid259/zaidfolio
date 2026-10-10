import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getAllNotes } from "@/lib/notes";

const BASE = "https://www.zaidfolio.space";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/resumeFull.pdf`, priority: 0.8 },
    ...projects.map((p) => ({ url: `${BASE}/work/${p.slug}`, priority: 0.7 })),
    { url: `${BASE}/services`, priority: 0.8 },
    { url: `${BASE}/notes`, priority: 0.8 },
    ...getAllNotes().map((n) => ({
      url: `${BASE}/notes/${n.slug}`,
      lastModified: n.updated ?? n.date,
      priority: 0.7,
    })),
  ];
}
