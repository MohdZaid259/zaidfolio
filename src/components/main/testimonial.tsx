import { SectionHeading } from "../ui/section-heading";
import TestimonialSection from "../sub/TestimonialSection";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="container mx-auto flex scroll-mt-20 flex-col items-center justify-center overflow-x-hidden py-10 pb-0"
    >
      <SectionHeading id="testimonials-heading" emoji="💯" eyebrow="What Clients Say" title="Words From" highlight="Clients" />

      <TestimonialSection/>
    </section>
  );
};
