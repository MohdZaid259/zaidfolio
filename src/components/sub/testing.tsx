import React from 'react'
import { TextReveal } from '../magicui/text-reveal'
import { AuroraText } from '../magicui/aurora-text'
import { AnimatedGradientText } from '../magicui/animated-gradient-text'
import { ChevronRight } from 'lucide-react'

function Testing() {
  return (
    <div className='container'>
        <div className="sticky text-white top-40 z-10 text-center">
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
    </div>
  )
}

export default Testing