// Everything on /services comes from here. Each offering links to real work as
// proof. Prices, timelines and availability are intentionally not stated yet;
// add them here when you decide (see `pricingNote`).

export interface Service {
  id: string;
  title: string;
  summary: string;
  includes: string[];
  stack: string[];
  proof: { label: string; href: string }[];
}

export const services: Service[] = [
  {
    id: "websites",
    title: "Business & marketing websites",
    summary:
      "Fast, multilingual sites that turn visitors into enquiries.",
    includes: [
      "Next.js site, responsive on every screen size",
      "Multiple languages with i18n",
      "Content your team can edit through a headless CMS",
      "Image optimization, SEO metadata and analytics",
      "Deployment, domain setup and handover",
    ],
    stack: ["Next.js", "Tailwind", "Hygraph", "ImageKit", "Vercel"],
    proof: [
      { label: "RD Tech Group", href: "/work/rd-tech" },
      { label: "LS4IT", href: "/work/ls4it" },
      { label: "Rukn Al Haya", href: "/work/rukn-al-haya" },
    ],
  },
  {
    id: "saas",
    title: "SaaS MVPs & full-stack apps",
    summary:
      "A real first version of your product: auth, payments, data.",
    includes: [
      "Authentication and user accounts",
      "Payments and subscriptions",
      "REST APIs with validation, caching and rate limiting",
      "Database design for the features you have now and the ones you plan",
      "CI/CD and production deployment",
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "MongoDB", "Redis", "Clerk", "Razorpay"],
    proof: [
      { label: "IntelliPrompt", href: "/work/intelliprompt" },
      { label: "NextGen E-Commerce", href: "/work/nextgen" },
    ],
  },
  {
    id: "backend",
    title: "Backend, APIs & multi-tenancy",
    summary:
      "Multi-tenant APIs, auth and pipelines that hold up in production.",
    includes: [
      "Fastify / Node.js APIs with clear resource contracts",
      "Multi-tenant isolation with PostgreSQL Row-Level Security",
      "Auth with OAuth 2.0 / OIDC (Azure Entra ID and others), roles and permissions",
      "Docker environments and GitHub Actions pipelines",
      "Debugging auth, CORS and gateway issues across services",
    ],
    stack: ["Fastify", "PostgreSQL", "Drizzle", "Redis", "Docker", "Azure", "GitHub Actions"],
    proof: [
      { label: "Work at PGC Digital", href: "/#experience" },
      { label: "Open-source RLS starter", href: "/work/fastify-rls-starter" },
      { label: "Engineering notes", href: "/notes" },
    ],
  },
  {
    id: "ai",
    title: "AI features",
    summary:
      "Document chat, extraction and assistants grounded in your data.",
    includes: [
      "Document ingestion pipelines with background processing",
      "Embeddings and semantic retrieval (RAG) grounded in your content",
      "Integrating OpenAI, Claude, Gemini and others behind one API",
      "AI workflows such as extraction and ranking inside existing products",
    ],
    stack: ["OpenAI", "OpenRouter", "Embeddings", "BullMQ", "AWS S3", "Node.js"],
    proof: [
      { label: "Docly", href: "/work/docly" },
      { label: "IntelliPrompt", href: "/work/intelliprompt" },
      { label: "AI workflows at PGC Digital", href: "/#experience" },
    ],
  },
];

export const process = [
  { title: "Discover", detail: "A call about goals and users" },
  { title: "Scope", detail: "Written plan and milestones" },
  { title: "Build", detail: "Progress you can review" },
  { title: "Launch", detail: "Deploy, docs and handover" },
  { title: "Support", detail: "Fixes after delivery" },
];

export const faqs = [
  {
    q: "Do you work with clients outside India?",
    a: "Yes. Freelance work so far has been for international clients, including businesses in the UAE and Saudi Arabia.",
  },
  {
    q: "What should I include in my first message?",
    a: "What you want built and why, who will use it, any examples you like, your deadline, and a budget range if you have one. A rough idea is fine.",
  },
  {
    q: "How is pricing decided?",
    a: "Each project is quoted after we've discussed the scope, so you know the cost before work starts.",
  },
];

// Shown under the enquiry form. Replace with real terms when you've decided them,
// e.g. "Websites from $X · MVPs from $Y" or current availability.
export const pricingNote: string | null = null;
