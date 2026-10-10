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
    image: '/projects/docly.svg',
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
    slug: 'fastify-rls-starter',
    name: 'Fastify + Drizzle RLS Starter',
    kind: 'Open source · MIT',
    role: 'Author',
    summary:
      'A multi-tenant API starter where PostgreSQL Row-Level Security enforces tenant isolation, so no query depends on remembering WHERE tenant_id = ?.',
    image: '/projects/rls-starter.svg',
    technologies: ['Fastify', 'Drizzle', 'PostgreSQL', 'RLS', 'jose', 'Vitest', 'GitHub Actions'],
    github: 'https://github.com/MohdZaid259/fastify-drizzle-rls-starter',
    context:
      'Most multi-tenant SaaS apps isolate customers with a tenant_id filter in application code, and one forgotten filter is a data leak. This starter packages the database-enforced pattern I use at work into something anyone can clone, run in a few minutes, and verify with tests.',
    built: [
      'RLS policies enabled and forced on every tenant table, with the tenant set per transaction from a verified JWT claim, which stays safe with pooled connections.',
      'tenant_id filled in by Postgres from the transaction context, so application code never writes it and routes contain no tenant filters.',
      'Least-privilege roles: an owner for migrations, plus read/write and read-only roles for the API that cannot bypass RLS.',
      'Tenant-scoped foreign keys and per-tenant unique constraints, closing the two gaps RLS alone leaves open.',
      'Postgres errors mapped to proper HTTP statuses (403, 404, 409, 422), with specific reasons logged server-side.',
      '20 integration tests against real Postgres, run as the API role. Switching to a superuser makes the isolation tests fail, which proves they test something.',
      'Docker Compose, migration and tenant-provisioning scripts, and GitHub Actions CI with a schema-drift check.',
    ],
  },
  {
    slug: 'intelliprompt',
    name: 'IntelliPrompt',
    kind: 'Team product · AI SaaS',
    role: 'Backend developer',
    period: 'May 2025 – Jul 2025',
    summary:
      'Prompt management SaaS for creating, enhancing, versioning and testing prompts across 8+ AI models.',
    image: '/projects/intelliprompt.jpeg',
    technologies: ['Next.js', 'MongoDB', 'Redis', 'OpenRouter', 'Clerk', 'Razorpay'],
    github: 'https://github.com/Genius-30/intelli-prompt',
    githubLabel: 'Team repo',
    context:
      'A team-built product. I owned the backend: the APIs, data access, auth, payments and the protections around them.',
    built: [
      'REST APIs for prompt creation, enhancement and versioning across 8+ models, including OpenAI, Claude and Gemini.',
      'Made prompt search 3× faster with targeted MongoDB indexes and query optimization.',
      'Clerk authentication, Razorpay payments, input validation, encrypted cookies, Redis caching and rate limiting.',
      'A hybrid-rendered landing page that contributed to 600+ early signups.',
    ],
  },
  {
    slug: 'ls4it',
    name: 'LS4IT',
    kind: 'Client work · UAE',
    role: 'Freelance full-stack developer',
    summary:
      'Website for a UAE-based fabric manufacturing and supply company, with CMS-managed content in multiple languages.',
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
    slug: 'nextgen',
    name: 'NextGen E-Commerce',
    kind: 'Personal project',
    role: 'Solo',
    summary: 'E-commerce app with Razorpay checkout, an AI chatbot and real-time order management.',
    image: '/projects/nextgen.png',
    technologies: ['React', 'Firebase', 'Razorpay', 'AI Chatbot'],
    live: 'https://nextgen-herbals.vercel.app/',
    github: 'https://github.com/MohdZaid259/NextGen',
    context: 'A full storefront built end to end to learn payments, real-time data and chat in one app.',
    built: [
      'Razorpay payment integration.',
      'Real-time order management on Firebase.',
      'An AI chatbot for product questions.',
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
