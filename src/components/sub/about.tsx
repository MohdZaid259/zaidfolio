import { ChevronRight } from "lucide-react";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { AuroraText } from "../magicui/aurora-text";
import { TextReveal } from "../magicui/text-reveal";

export default function AboutMe() {
  return (
    <section id="about-me" className="container relative text-white py-10 px-4 md:px-20 scroll-mt-10">
      {/* Content with Badge, Title and Text that scroll together */}
      <div className="mt-44 space-y-12">
        <TextReveal 
          className="hidden md:block py-0 my-0 space-y-0"
          badge={
            <div className="group relative left-1/2 -translate-x-1/2 mb-2 md:mb-4 max-w-max flex items-center justify-center rounded-full px-2 pl-3 md:px-4 py-1 md:py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
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
          }
          heading={
            <h2 className="text-[32px] tracking-wider md:text-[40px] font-bold leading-tight max-sm:mb-6 ">
              Meet the{" "}
              <AuroraText>
                Developer
              </AuroraText>
            </h2>
          }
        >
          I'm Zaid, a full-stack software engineer at PGC Digital. I work on
          10xTA, a multi-service recruitment platform, building Fastify APIs,
          multi-tenant isolation with PostgreSQL row-level security, Azure Entra
          auth, and AI workflows for resume ranking and interviews. Before that
          I freelanced for international clients, owning each project from the
          first call to deployment, and built the backend of IntelliPrompt, an
          AI prompt SaaS. I like backend problems, AI products, and shipping
          things people actually use.
        </TextReveal>
        <TextReveal 
          className="block md:hidden py-0 my-0 space-y-0"
          badge={
            <div className="group relative left-1/2 -translate-x-1/2 mb-2 md:mb-4 max-w-max flex items-center justify-center rounded-full px-2 pl-3 md:px-4 py-1 md:py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
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
          }
          heading={
            <h2 className="text-[32px] tracking-wider md:text-[40px] font-bold leading-tight max-sm:mb-4 ">
              Meet the{" "}
              <AuroraText>
                Developer
              </AuroraText>
            </h2>
          }
        >
          I'm Zaid, a full-stack software engineer at PGC Digital, building
          the backend of 10xTA, a multi-tenant recruitment platform. Before
          that I freelanced for international clients and built the backend of
          IntelliPrompt, an AI prompt SaaS.
        </TextReveal>

        {/* Stats */}
        <div className="-mt-36 md:-mt-54 lg:-mt-36 md:mb-10 grid grid-cols-3 max-sm:gap-4 gap-0 text-center">
          <div>
            <AuroraText className="text-3xl md:text-4xl font-bold">
              10+
            </AuroraText>
            <p className="text-sm text-gray-400 mt-1">Projects Delivered</p>
          </div>

          <div>
            <AuroraText className="text-3xl md:text-4xl font-bold">
              5+
            </AuroraText>
            <p className="text-sm text-gray-400 mt-1">International Clients</p>
          </div>

          <div>
            <AuroraText className="text-3xl md:text-4xl font-bold">
              3
            </AuroraText>
            <p className="text-sm text-gray-400 mt-1">AI Workflows Integrated</p>
          </div>
        </div>
      </div>
    </section>
  );
}