interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'IntelliPrompt',
    description: 'Enterprise-grade AI prompt management SaaS with multi-model testing, enhanced prompts, and a thriving community ecosystem.',
    image: '/projects/intelliprompt.jpeg',
    technologies: ['Next.js', 'MongoDB', 'OpenRouter', 'Tailwind'],
    link: 'https://intelliprompt.com',
  },
  {
    id: 2,
    name: 'RD Tech Companies',
    description: 'Freelance project for a UAE client consolidating 3 businesses (General Contracting, Cybersecurity, Building Automation) into one polished digital presence.',
    image: '/projects/rd.png',
    technologies: ['Next.js', 'Imagekit', 'Tailwind'],
    link: 'https://rdtech-group.com/',
  },
  {
    id: 3,
    name: 'LS4IT Enterprise',
    description: 'High-tech UAE-based fabric manufacturing & supply platform with modern UI and scalable backend for a global enterprise.',
    image: '/projects/lsit.png',
    technologies: ['Next.js', 'Hygraph', 'Tailwind'],
    link: 'https://ls4it.com',
  },
  {
    id: 4,
    name: 'NextGen E-Commerce',
    description: 'AI-powered e-commerce app featuring Razorpay integration, intelligent chatbot, and real-time order management.',
    image: '/projects/nextgen.png',
    technologies: ['React', 'Firebase', 'Razorpay', 'AI Chatbot'],
    link: 'https://nextgen-herbals.vercel.app/',
  },
  {
    id: 5,
    name: 'YouTube Clone',
    description: 'Full-stack Next.js YouTube clone with custom backend, seamless API integration, and advanced video streaming experience.',
    image: '/projects/yt.png',
    technologies: ['Next.js', 'Node.js', 'YouTube API', 'MongoDB'],
    link: 'https://yt-frontend-three.vercel.app/',
  },
];