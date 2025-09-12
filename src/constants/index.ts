import { FaYoutube } from "react-icons/fa";
import {
  RxDiscordLogo,
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
} from "react-icons/rx";
import { FaWhatsapp } from "react-icons/fa";
import {FaLinkedinIn  } from 'react-icons/fa'
import {FaXTwitter } from 'react-icons/fa6'

// Row 1 → 12 logos
export const SKILL_DATA = [
    { skill_name: "Next.js", image: "next.png", width: 120, height: 120 },
  { skill_name: "JavaScript", image: "js.png", width: 65, height: 65 },
  { skill_name: "TypeScript", image: "ts.png", width: 75, height: 75 },
  { skill_name: "React", image: "react.png", width: 50, height: 50 },
  { skill_name: "Node.js", image: "node.png", width: 50, height: 50 },
  { skill_name: "Express.js", image: "express.png", width: 60, height: 60 },
  { skill_name: "Redux", image: "redux.png", width: 70, height: 70 },
  { skill_name: "Tailwind CSS", image: "tailwind.png", width: 60, height: 60 },
  { skill_name: "Framer Motion", image: "framer.png", width: 60, height: 60 },
  { skill_name: "Axios", image: "axios.png", width: 120, height: 120 },
  { skill_name: "MongoDB", image: "mongodb.png", width: 60, height: 60 },
    { skill_name: "Vercel", image: "vercel.png", width: 50, height: 50 },

] as const;

// Row 2 → 9 logos
export const FRONTEND_SKILL = [
    { skill_name: "Razorpay", image: "razorpay.png", width: 100, height: 100 },
  { skill_name: "Firebase", image: "firebase.png", width: 55, height: 55 },
      { skill_name: "GitHub", image: "github.png", width: 70, height: 70 },
  { skill_name: "C", image: "c.png", width: 70, height: 70 },
  { skill_name: "Render", image: "render.png", width: 120, height: 120 },
    { skill_name: "Shadcn", image: "shadcn.png", width: 50, height: 50 },
  { skill_name: "Redis", image: "redis.png", width: 70, height: 70 },
  { skill_name: "Python", image: "python.png", width: 70, height: 70 },
    { skill_name: "Appwrite", image: "appwrite.png", width: 150, height: 150 },

] as const;

// Row 3 → 7 logos
export const BACKEND_SKILL = [
    { skill_name: "React Query", image: "reactquery.png", width: 80, height: 80 },
  { skill_name: "Stripe", image: "stripe.png", width: 60, height: 60 },
    { skill_name: "Cloudinary", image: "cloudinary.png", width: 180, height: 180 },
  { skill_name: "Postman", image: "postman.png", width: 70, height: 70 },
  { skill_name: "CSS", image: "css.png", width: 70, height: 70 },
  { skill_name: "MySQL", image: "mysql.png", width: 100, height: 100 },
  { skill_name: "HTML", image: "html.png", width: 80, height: 80 },
] as const;

// Row 4 → 3 logos
export const FULLSTACK_SKILL = [
  { skill_name: "Material UI", image: "mui.png", width: 80, height: 80 },
  { skill_name: "Git", image: "git.png", width: 70, height: 70 },
  { skill_name: "Supabase", image: "supabase.png", width: 170, height: 170 },
] as const;

// Row 5 → 1 logo 
export const OTHER_SKILL = [
  { skill_name: "AWS", image: "aws.png", width: 80, height: 80 },
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
export const PROJECTS = [
  {
    title: "Modern Next.js 14 Portfolio",
    description:
      'Embark on a journey through my professional evolution with the "Modern Next.js Portfolio" - a dynamic showcase of my skills, experiences, and passion for web development. Crafted with precision and powered by Next.js, this portfolio is more than just a static display; it\'s an immersive experience that reflects the cutting edge of modern web technologies.',
    image: "/projects/project-1.png",
    link: "https://example.com",
  },
  {
    title: "Interactive Cards Portfolio",
    description:
      'Step into the extraordinary world of my professional journey through the "Interactive Cards Portfolio" - an innovative and visually captivating platform that redefines the traditional portfolio experience. Ditching the conventional static layout, this portfolio leverages interactive cards to showcase my skills, projects, and personality in an engaging and dynamic manner.',
    image: "/projects/project-2.png",
    link: "https://example.com",
  },
  {
    title: "Space Themed Website",
    description:
      'Embark on an interstellar journey with my "Space Themed Website", a mesmerizing space-themed website that invites you to explore the cosmic wonders beyond our world. Immerse yourself in an awe-inspiring digital experience that blends cutting-edge design with the mysteries of the universe.',
    image: "/projects/project-3.png",
    link: "https://example.com",
  },
] as const;

export const FOOTER_DATA = [
  {
    title: "Community",
    data: [
      {
        name: "YouTube",
        icon: FaYoutube,
        link: "https://youtube.com",
      },
      {
        name: "GitHub",
        icon: RxGithubLogo,
        link: "https://github.com",
      },
      {
        name: "Discord",
        icon: RxDiscordLogo,
        link: "https://discord.com",
      },
    ],
  },
  {
    title: "Social Media",
    data: [
      {
        name: "Instagram",
        icon: RxInstagramLogo,
        link: "https://instagram.com",
      },
      {
        name: "Twitter",
        icon: RxTwitterLogo,
        link: "https://twitter.com",
      },
      {
        name: "Linkedin",
        icon: RxLinkedinLogo,
        link: "https://linkedin.com",
      },
    ],
  },
  {
    title: "About",
    data: [
      {
        name: "Become Sponsor",
        icon: null,
        link: "https://youtube.com",
      },
      {
        name: "Learning about me",
        icon: null,
        link: "https://example.com",
      },
      {
        name: "Contact Me",
        icon: null,
        link: "mailto:contact@example.com",
      },
    ],
  },
] as const;

export const NAV_LINKS = [
  {
    title: "About me",
    link: "#about-me",
  },
  {
    title: "Skills",
    link: "#skills",
  },
  {
    title: "Projects",
    link: "#projects",
  },
  {
    title: "Contact Us",
    link: "#contact",
  },
] as const;