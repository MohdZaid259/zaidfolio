# Before you deploy

Everything here needs a decision or fact only you have. Nothing is live yet.

## Must do

- [ ] **Publish the starter repo** under `MohdZaid259`. The GitHub CLI on this machine is logged in as
      `mohdzaid08` (company "Vallora"), so it wasn't pushed. From `Downloads/fastify-drizzle-rls-starter`:
      ```bash
      gh auth login                # sign in as MohdZaid259
      gh repo create MohdZaid259/fastify-drizzle-rls-starter --public --source=. --push \
        --description "Multi-tenant Fastify + Drizzle starter with PostgreSQL Row-Level Security"
      ```
      Then check the Actions tab: CI should pass. The portfolio links to this URL.
- [ ] **Review the two draft notes** in `content/notes/` and set `draft: false`. Until then `/notes` is empty
      in production and the home page "Engineering Notes" strip is hidden.
- [ ] **Add `MESH_API_KEY`** in Vercel → Settings → Environment Variables (the chat returns
      "isn't configured yet" without it). Consider rotating the key, since it was shared in a chat.
- [ ] **Confirm the 3 testimonials** in `src/data/testimonials.ts` are real and approved. Adding a `linkedin`
      URL or a real `src` photo for each makes them credible.
- [ ] **Fix the Docly demo** (docly-ai.vercel.app is stuck on "Loading your workspace…").

## Fill in when you can

- [ ] `src/data/experience.ts`: freelance period is "Before Oct 2025"; put the real years.
- [ ] `src/data/services.ts`: `pricingNote` (e.g. "Websites from $X · MVPs from $Y") and availability.
      The page makes no price, timeline or availability claims until you add them.
- [ ] Read the "problem" paragraphs in `src/data/projects.ts` and the About text in
      `src/components/sub/about.tsx`. They were written from your resume; adjust anything that isn't accurate.
- [ ] Rukn Al Haya's domain (alhaya.tech) doesn't resolve; the site links to al-haya.vercel.app instead.

## Deploying

This folder's git history is local (it was a downloaded zip). To deploy through your existing
`MohdZaid259/zaidfolio` repo, copy these files over your clone of that repo (or force-push if you're sure),
then let Vercel build. `npm run build` passes locally.

Never run `npm run dev` and `npm start` at the same time; they share the `.next` folder.
