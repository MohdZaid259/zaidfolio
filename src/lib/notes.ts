import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Root, Element } from "hast";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

// Drafts are visible in `next dev` and left out of production builds
const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

export interface NoteMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
}

export interface Heading {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface Note extends NoteMeta {
  html: string;
  headings: Heading[];
}

const readFile = (slug: string) => {
  const raw = fs.readFileSync(path.join(NOTES_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).length;
  const meta: NoteMeta = {
    slug,
    title: String(data.title),
    description: String(data.description),
    date: new Date(data.date).toISOString().slice(0, 10),
    updated: data.updated ? new Date(data.updated).toISOString().slice(0, 10) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
  return { meta, content };
};

export const getAllNotes = cache((): NoteMeta[] => {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readFile(file.replace(/\.md$/, "")).meta)
    .filter((note) => SHOW_DRAFTS || !note.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
});

// Collects h2/h3 ids (added by rehype-slug) for the table of contents
const collectHeadings = (headings: Heading[]) => () => (tree: Root) => {
  visit(tree, "element", (node: Element) => {
    if ((node.tagName === "h2" || node.tagName === "h3") && node.properties?.id) {
      headings.push({
        id: String(node.properties.id),
        text: toString(node),
        depth: node.tagName === "h2" ? 2 : 3,
      });
    }
  });
};

export const getNote = cache(async (slug: string): Promise<Note | undefined> => {
  if (!getAllNotes().some((note) => note.slug === slug)) return undefined;
  const { meta, content } = readFile(slug);
  const headings: Heading[] = [];

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(collectHeadings(headings))
    .use(rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: true })
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: { className: ["heading-anchor"], ariaLabel: "Link to this section" },
      content: { type: "text", value: "#" },
    })
    .use(rehypeStringify)
    .process(content);

  return { ...meta, html: String(file), headings };
});

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
