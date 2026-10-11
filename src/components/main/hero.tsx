import { preload } from "react-dom";
import { HeroContent } from "@/components/sub/hero-content";
import { HeroVideo } from "@/components/sub/hero-video";

export const Hero = () => {
  // The poster is the first thing painted behind the hero; fetch it early
  preload("/videos/blackhole-poster.webp", { as: "image", fetchPriority: "high" });

  return (
    <section id="hero" className="relative isolate flex min-h-[92svh] w-full flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
        <HeroVideo />
      </div>
      <HeroContent />
    </section>
  );
};
