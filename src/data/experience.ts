export interface Experience {
  company: string;
  role: string;
  product?: string;
  period: string;
  current?: boolean;
  points: string[];
  stack: string[];
}

export const experience: Experience[] = [
  {
    company: 'PGC Digital',
    role: 'Full Stack Developer',
    product: '10xTA — recruitment platform',
    period: 'Oct 2025 – Present',
    current: true,
    points: [
      'Work across a multi-service recruitment platform: 2 client apps, a gateway, APIs, read services and 4+ supporting backend services.',
      'Build backend APIs with Fastify, PostgreSQL, Drizzle and Redis, and own resource contracts, validation, JSON Patch workflows and service boundaries.',
      'Implement multi-tenant data isolation with PostgreSQL Row-Level Security, tenant-context propagation, least-privilege roles and read-only access.',
      'Debug auth end to end, from client through gateway to database: Azure Entra, authorization, routing, CORS, headers and 401/403s.',
      'Maintain Docker-based local environments and GitHub Actions pipelines for typecheck, lint, test, build and per-environment deploys.',
      'Integrated 3 AI recruitment workflows (resume ranking, resume extraction and AI interviews) into the distributed architecture.',
    ],
    stack: ['Fastify', 'PostgreSQL', 'Drizzle', 'Redis', 'Azure Entra', 'Docker', 'GitHub Actions'],
  },
  {
    company: 'IntelliPrompt',
    role: 'Backend Developer',
    product: 'AI prompt management SaaS',
    period: 'May 2025 – Jul 2025',
    points: [
      'Built REST APIs for prompt creation, enhancement and versioning across 8+ AI models.',
      'Made prompt search 3× faster with MongoDB indexing and query optimization.',
      'Added Clerk auth, Razorpay payments, encrypted cookies, Redis caching and rate limiting.',
      'Built the hybrid-rendered landing page behind 600+ early signups.',
    ],
    stack: ['Node.js', 'MongoDB', 'Redis', 'Clerk', 'Razorpay', 'OpenRouter'],
  },
  {
    company: 'Freelance',
    role: 'Full Stack Developer',
    product: 'International clients',
    period: 'Before Oct 2025',
    points: [
      'Delivered production websites and web apps for international clients.',
      'Owned each project end to end: requirements, architecture, build, deployment, handover and post-launch fixes.',
      'Worked directly with clients on scope, technical decisions and timelines.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind'],
  },
];
