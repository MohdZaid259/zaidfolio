import React from 'react'
import ThreeDModel from '../ui/threeDModel'
import { AnimatedGradientText } from '../magicui/animated-gradient-text'
import { ChevronRight } from 'lucide-react'
import { AuroraText } from '../magicui/aurora-text'
import { SOCIALSFOOTER } from "@/constants";
import Link from 'next/link'

function ContactSection() {
  return (
    <div className='relative min-h-92 flex justify-evenly items-start overflow-x-hidden'>
      <div className='absolute left-4 sm:left-6 md:left-20 lg:left-36 sm:top-16 md:top-24 lg:top-56 '>
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
          👋 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
          <AnimatedGradientText className="text-xs sm:text-sm font-medium">
            Say Hello
          </AnimatedGradientText>
          <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-semibold text-white">
          Let's have a <AuroraText>Convo</AuroraText>
        </h1>
        <p className='text-gray-300 '>Have an idea, project, or just a question? I’d love to hear from you.</p>
          <div className="flex gap-6 mt-6">
            {SOCIALSFOOTER.map(({ link, name, icon: Icon }) => (
              <Link
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                key={name}
                className="group relative flex flex-col items-center"
              >
                <Icon className="h-6 w-6 md:h-8 md:w-8 text-white hover:text-violet-500 transition-transform duration-500 group-hover:translate-y-2" />

                {/* underline animation */}
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 mt-2 opacity-0 transform scale-x-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-x-100"></div>
              </Link>
            ))}
          </div>
        <p className='text-gray-300 mt-4'>or mail at <a href='mailto:razvizaid259@gmail.com'  target='_blank' rel='noreferrer noopener' className='transition-transform font-semibold duration-500 text-transparent bg-clip-text bg-gradient-to-br from-violet-500 to-blue-500'>razvizaid259@gmail.com</a></p>
      </div>
      <div className='hidden sm:block'>
        <ThreeDModel/>
      </div>
    </div>
  )
}

export default ContactSection