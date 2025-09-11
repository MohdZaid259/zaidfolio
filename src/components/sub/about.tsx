"use client";

import { ChevronRight } from "lucide-react";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { AuroraText } from "../magicui/aurora-text";
import { TextReveal } from "../magicui/text-reveal";

export default function AboutMe() {
  return (
    <section className="relative container text-white py-10 px-4 md:px-20">

        {/* Sticky Title */}
        <div className="sticky top-36 z-10 text-center">
          <div className="group relative left-1/2 -translate-x-1/2 mb-2 max-w-max flex items-center justify-center rounded-full px-2 pl-3 md:px-4 py-1 md:py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
            <span
              className="absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
          😎 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
            <AnimatedGradientText className="text-xs md:text-sm font-medium">
              Who Am I?
            </AnimatedGradientText>
            <ChevronRight
              className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
            />
          </div>
          <h2 className="text-[32px] md:text-[40px] font-bold leading-tight">
            Meet the{" "}
            <AuroraText>
              Developer
            </AuroraText>
          </h2>
        </div>

        {/* Content */}
        <div className="mt-28 space-y-12 ">
          <TextReveal className="py-0 my-0 space-y-0">
            I’m Zaid, a full-stack freelance developer who thrives on turning
            bold ideas into digital realities. Over the years, I’ve partnered
            with startups, businesses, and individuals to craft websites and
            applications that don’t just look good — but work seamlessly and
            deliver results.
            
            My freelancing journey has taught me the value of clear
            communication, on-time delivery, and building lasting relationships
            with clients across the globe. Whether it’s a brand-new website, a
            feature-rich app, or reliable hosting, I bring a mix of creativity,
            technical expertise, and business sense to every project.
          </TextReveal>

          {/* Stats */}
          <div className="-mt-24 grid grid-cols-3 max-sm:gap-4 gap-0 text-center">
            <div>
              <AuroraText className="text-3xl md:text-4xl font-bold">
                50+
              </AuroraText>
              <p className="text-sm text-gray-400 mt-1">Completed Projects</p>
            </div>

            <div>
              <AuroraText className="text-3xl md:text-4xl font-bold">
                98.7%
              </AuroraText>
              <p className="text-sm text-gray-400 mt-1">Client Satisfaction</p>
            </div>

            <div>
              <AuroraText className="text-3xl md:text-4xl font-bold">
                3+
              </AuroraText>
              <p className="text-sm text-gray-400 mt-1">Years Experience</p>
            </div>
          </div>
        </div>
      
    </section>
  );
}
