import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { testimonials } from "@/data/testimonials";

export default function TestimonialSection() {
  return <AnimatedTestimonials testimonials={testimonials} />;
}
