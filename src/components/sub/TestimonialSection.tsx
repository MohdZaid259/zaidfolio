import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function TestimonialSection() {
  const testimonials = [
  {
    quote:
      "He delivered a fully functional product in less than a week, something we thought would take a month. The speed didn’t compromise quality at all; every detail was carefully thought through.",
    name: "Bara Wafa",
    designation: "Co-Founder at LS4IT",
    src: "https://media.istockphoto.com/id/1085634488/photo/united-arab-emirates-flag-close-up-waving-isolated-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=fh1oOL_opJqtOl0XQri4f8z-NR8EO8p6wI1-ItFPdmY=",
  },
  {
    quote:
      "What impressed us most was the combination of speed and finesse. He delivered our platform in just a few days, yet the UI felt refined, modern, and built to last.",
    name: "Shakeel Siddiqui",
    designation: "Share Holder at AlHaya Tech",
    src: "https://plus.unsplash.com/premium_photo-1674588218207-474f9ca6d3d8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "The microinteractions and subtle animations elevated the entire experience. It’s rare to find a developer who thinks beyond functionality and creates interfaces people actually enjoy using.",
    name: "Fahad Al Harbi",
    designation: "CTO at InfoTech Solutions",
    src: "https://imgs.search.brave.com/II1N57MMvUYZBteCyefmRlD1RjaUsNItInNLL9LglM0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTA2/MDA0NTA3OC9waG90/by9zYXVkaS1hcmFi/aWEtYXJhYmlhbi1m/bGFnLXRleHRpbGUt/Y2xvdGgtZmFicmlj/LXdhdmluZy1vbi10/aGUtdG9wLXN1bnJp/c2UtbWlzdC1mb2cu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PW5hdmNlZVlsMlVW/TmFZbU9BSWhFa0M1/SjVvTURJYXhWM202/Y20wZkV3b1k9",
  },
  {
    quote:
      "He not only built exactly what we envisioned but also polished it with animations and interactions that made the product feel premium. The 10/10 reviews from our team say it all.",
    name: "Raed Dagher",
    designation: "Owner of RdTech companies",
    src: "https://media.istockphoto.com/id/1085634488/photo/united-arab-emirates-flag-close-up-waving-isolated-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=fh1oOL_opJqtOl0XQri4f8z-NR8EO8p6wI1-ItFPdmY=",
  },
  {
    quote:
      "His work has that rare mix of speed, scalability, and beauty. We had a production-ready system in under a week, and to this day, people still compliment the design.",
    name: "Jason Ward",
    designation: "VP at FutureNet",
    src: "https://plus.unsplash.com/premium_photo-1674585274809-747e065de816?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

  return <AnimatedTestimonials testimonials={testimonials} />;
}
