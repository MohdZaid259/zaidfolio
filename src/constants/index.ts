import { RxGithubLogo, RxInstagramLogo } from "react-icons/rx";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Single source for the Skills section, the chat assistant and the profile
export const SKILL_GROUPS = [
  { group: "AI / LLM", items: ["OpenAI", "Claude", "Gemini", "RAG", "Embeddings", "OpenRouter", "MCP"] },
  { group: "Backend", items: ["Node.js", "TypeScript", "Fastify", "Express.js", "Python", "REST APIs", "BullMQ"] },
  { group: "Data", items: ["PostgreSQL", "Drizzle", "MongoDB", "Redis", "MySQL"] },
  { group: "Cloud & DevOps", items: ["Docker", "GitHub Actions", "Azure", "AWS S3", "Vercel", "CI/CD"] },
  { group: "Security & Auth", items: ["Azure Entra ID", "OAuth 2.0 / OIDC", "JWT", "RBAC", "PostgreSQL RLS"] },
  { group: "Frontend", items: ["Next.js", "React", "Redux"] },
] as const;

export const SOCIALS = [
  {
    name: "Linkedin",
    icon: FaLinkedinIn ,
    link: "https://www.linkedin.com/in/mohd-zaid-b28aa2248/",
  },
  {
    name: "Github",
    icon: RxGithubLogo,
    link: "https://github.com/MohdZaid259",
  },
  {
    name: "Twitter",
    icon: FaXTwitter  ,
    link: "https://x.com/zaidrazvi09",
  }
] as const;

export const SOCIALSFOOTER = [
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    link: "https://wa.me/+919795372555",
  },
  {
    name: "Instagram",
    icon: RxInstagramLogo,
    link: "https://www.instagram.com/thecodewizard_07/",
  },
  {
    name: "Linkedin",
    icon: FaLinkedinIn ,
    link: "https://www.linkedin.com/in/mohd-zaid-b28aa2248/",
  },
  {
    name: "Github",
    icon: RxGithubLogo,
    link: "https://github.com/MohdZaid259",
  },
  {
    name: "Twitter",
    icon: FaXTwitter  ,
    link: "https://x.com/zaidrazvi09",
  }
]
export const NAV_LINKS = [
  {
    title: "About",
    link: "/#about-me",
  },
  {
    title: "Experience",
    link: "/#experience",
  },
  {
    title: "Projects",
    link: "/#projects",
  },
  {
    title: "Skills",
    link: "/#skills",
  },
  {
    title: "Notes",
    link: "/notes",
  },
  {
    title: "Services",
    link: "/services",
  },
  {
    title: "Contact",
    link: "/#contact",
  },
] as const;