export interface Project {
  slug: string;
  name: string;
  kind: string;
  role: string;
  period?: string;
  summary: string;
  image: string;
  technologies: string[];
  live?: string;
  github?: string;
  githubLabel?: string;
  // Case study content, shown on /work/[slug]
  context: string;
  built: string[];
  note?: string;
}

export const projects: Project[] = [
  {
    slug: 'intelliprompt',
    name: 'IntelliPrompt',
    kind: 'Team product · AI SaaS',
    role: 'Backend developer',
    period: 'May 2025 – Jul 2025',
    summary:
      'AI prompt workbench: enhance a rough prompt, run it on up to 4 of 13 models side by side, and keep the version that wins.',
    image: '/projects/intelliprompt.webp',
    technologies: ['Next.js', 'PostgreSQL', 'Drizzle', 'Clerk', 'Razorpay', 'OpenRouter', 'BullMQ'],
    live: 'https://www.intelliprompt.lol',
    github: 'https://github.com/MohdZaid259/intelliprompt',
    context:
      'A team-built product, now live: one place to write a prompt, test it across models from 8 AI labs, and keep every version. I owned the backend.',
    built: [
      'Cross-model runs through OpenRouter: one prompt on up to 4 models at once, with speed, tokens and cost for each answer.',
      'One-click AI enhancement with a reviewable diff, plus versions you can compare, restore and sort into folders.',
      'Community layer: publish, like, save and fork prompts, with a points leaderboard and streaks.',
      'Free and Pro plans with daily run quotas, Redis rate limiting and Razorpay payments.',
      'Postgres with Drizzle, Clerk auth, and a BullMQ email worker sending through Resend.',
      'Tests and GitHub Actions CI (typecheck, lint, test), deployed on Vercel.',
    ],
  },
  {
    slug: 'ls4it',
    name: 'LS4IT',
    kind: 'Client work · Saudi Arabia',
    role: 'Freelance full-stack developer',
    summary:
      'Website for a Saudi-based fabric manufacturing and supply company, with CMS-managed content in multiple languages.',
    image: '/projects/lsit.png',
    technologies: ['Next.js', 'Hygraph', 'i18n', 'Tailwind'],
    live: 'https://ls4it.com',
    context:
      'A manufacturing and supply business needed a modern site to present its products to an international audience, with content that changes without a code release.',
    built: [
      'Content modeled in Hygraph (headless CMS) and rendered with Next.js.',
      'Multilingual pages with i18n.',
      'Owned the project from requirements through deployment and handover.',
    ],
  },
  {
    slug: 'rd-tech',
    name: 'RD Tech Group',
    kind: 'Client work · UAE',
    role: 'Freelance full-stack developer',
    summary:
      'One site for a UAE group running three businesses: general contracting, cybersecurity and building automation.',
    image: '/projects/rd.png',
    technologies: ['Next.js', 'ImageKit', 'i18n', 'Tailwind'],
    live: 'https://rdtech-group.com/',
    context:
      'The client ran three separate businesses and needed a single web presence that explains all three clearly, in more than one language, without reading like three sites stitched together.',
    built: [
      'A Next.js site with a dedicated section for each business line under one brand.',
      'Multilingual content with i18n routing.',
      'Image delivery through ImageKit to keep pages fast with photo-heavy content.',
      'Owned the project from requirements through deployment and handover.',
    ],
  },
  {
    slug: 'docly',
    name: 'Docly',
    kind: 'Product · AI',
    role: 'Solo — architecture, backend, frontend',
    summary:
      'AI document chat: upload several documents, process them in the background, and get answers grounded in their content.',
    image: '/projects/docly.webp',
    technologies: ['Node.js', 'Express', 'MongoDB', 'AWS S3', 'BullMQ', 'Redis', 'OpenAI Embeddings'],
    live: 'https://docly-ai.vercel.app/',
    github: 'https://github.com/MohdZaid259/Docly',
    context:
      'Chatting with documents breaks down when uploads are processed inline: large files block requests and answers drift away from the source. Docly separates ingestion from chat so both stay reliable.',
    built: [
      'Multi-document upload to AWS S3, with processing queued through BullMQ on Redis so the API never blocks on large files.',
      'An ingestion pipeline that chunks documents and generates 1536-dimensional OpenAI embeddings for vector retrieval.',
      'Semantic retrieval feeding an LLM response layer, so answers are grounded in the uploaded documents.',
      'Conversational context built from the latest 5 messages to keep follow-up questions coherent.',
    ],
  },
  {
    slug: 'rukn-al-haya',
    name: 'Rukn Al Haya',
    kind: 'Client work',
    role: 'Freelance developer',
    summary: 'Marketing site for a one-stop technical services company.',
    image: '/projects/alhaya.png',
    technologies: ['Next.js', 'Tailwind'],
    live: 'https://al-haya.vercel.app/',
    context:
      'A technical services company needed a fast, responsive site that lists its services and turns visitors into enquiries.',
    built: [
      'A responsive Next.js site with a page structure built around the service catalogue.',
      'Delivered in a few days, from first brief to production.',
    ],
  },
  {
    slug: 'youtube-clone',
    name: 'YouTube Clone',
    kind: 'Personal project',
    role: 'Solo',
    summary: 'Full-stack YouTube clone with a custom Node.js backend and YouTube API integration.',
    image: '/projects/yt.png',
    technologies: ['Next.js', 'Node.js', 'YouTube API', 'MongoDB'],
    live: 'https://yt-frontend-three.vercel.app/',
    github: 'https://github.com/MohdZaid259/Youtube',
    context: 'A practice project in building a backend and frontend together around a third-party API.',
    built: [
      'Custom Node.js backend with MongoDB.',
      'YouTube Data API integration for search and playback.',
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
