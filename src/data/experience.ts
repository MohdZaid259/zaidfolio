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
    product: 'AI prompt SaaS · live',
    period: 'May 2025 – Jul 2025',
    points: [
      'Built the APIs for prompt creation, AI enhancement and versioning, running prompts on up to 4 of 13 models side by side.',
      'Designed the PostgreSQL schema with Drizzle for prompts, versions, folders and community activity.',
      'Set up a BullMQ email worker and CI, and launched with 100+ early signups.',
      'Added Clerk auth, Razorpay payments, daily run quotas and Redis rate limiting.',
    ],
    stack: ['Next.js', 'PostgreSQL', 'Drizzle', 'Redis', 'Clerk', 'Razorpay', 'OpenRouter'],
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
