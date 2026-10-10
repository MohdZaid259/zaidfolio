# Writing notes

Each file in `content/notes/` becomes a page at `/notes/<file-name>`.

```md
---
title: "Post title"
description: "One or two sentences. Used on the index, in search results and link previews."
date: 2026-10-11
updated: 2026-11-02   # optional
tags: ["PostgreSQL", "Auth"]
draft: true           # visible in `npm run dev` only; set to false to publish
---

Body in Markdown. GitHub-flavoured: tables, task lists, fenced code with a language
(```ts, ```sql, ```bash) for syntax highlighting.
```

- `##` and `###` headings appear in the table of contents.
- Link between notes with `/notes/<slug>`.
- Published notes are added to the sitemap, the RSS feed (`/notes/rss.xml`) and the
  "Engineering Notes" strip on the home page automatically.
