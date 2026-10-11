import type { CountryCode } from "@/components/ui/flag";

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  projectSlug: string;
  // ISO 3166 alpha-2 country code, rendered as an SVG flag (emoji flags don't show on Windows)
  country: CountryCode;
  // Optional real photo or LinkedIn URL; without a photo an initials avatar is shown
  src?: string;
  linkedin?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "He delivered a fully functional product in less than a week, something we thought would take a month. The speed didn’t compromise quality at all; every detail was carefully thought through.",
    name: "Baraa Al Arabi",
    designation: "Co-Founder, LS4IT",
    projectSlug: "ls4it",
    country: "AE",
  },
  {
    quote:
      "What impressed us most was the combination of speed and finesse. He delivered our platform in just a few days, yet the UI felt refined, modern, and built to last.",
    name: "Shakeel Siddiqui",
    designation: "Shareholder, Rukn Al Haya",
    projectSlug: "rukn-al-haya",
    country: "AE",
  },
  {
    quote:
      "He not only built exactly what we envisioned but also polished it with animations and interactions that made the product feel premium. The 10/10 reviews from our team say it all.",
    name: "Raed Dagher",
    designation: "Owner, RD Tech Group",
    projectSlug: "rd-tech",
    country: "AE",
  },
];
