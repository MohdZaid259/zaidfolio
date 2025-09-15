import { ChevronRight } from "lucide-react";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { AuroraText } from "../magicui/aurora-text";
import TestimonialSection from "../sub/TestimonialSection";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="container flex flex-col items-center justify-center py-10 pb-0"
    >
      <div className="group relative max-w-max flex items-center mb-2 justify-center rounded-full px-2 pl-3 md:px-4 py-1 md:py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
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
        💯 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
        <AnimatedGradientText className="text-xs md:text-sm font-medium">
          What Clients Say
        </AnimatedGradientText>
        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </div>

      <h1 className="text-[32px] tracking-wider md:text-[40px] font-semibold text-center text-white">
        Innovation that {" "}<AuroraText>Drives Results</AuroraText>
      </h1>

      <TestimonialSection/>
    </section>
  );
};
