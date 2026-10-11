import { HeroContent } from "@/components/sub/hero-content";
import { HeroVideo } from "@/components/sub/hero-video";

export const Hero = () => {
  return (
    <section id="hero" className="relative isolate flex min-h-[92svh] w-full flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
        <div className="blackhole" />
        <HeroVideo />
      </div>
      <HeroContent />
    </section>
  );
};
