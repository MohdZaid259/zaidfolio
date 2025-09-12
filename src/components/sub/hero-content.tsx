'use client'

import { MotionDiv, MotionA } from "@/lib/motionElements";
import Image from "next/image";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import {
  slideInFromLeft,
  slideInFromRight,
} from "@/lib/motion";
import { ChevronRight } from "lucide-react";
import { MorphingText } from "../magicui/morphing-text";
import { TextAnimate } from "../magicui/text-animate";
import { ShimmerButton } from "../magicui/shimmer-button";

export const HeroContent = () => {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      className="flex flex-row container flex-wrap md:flex-nowrap items-center justify-center pl-6 mt-10 md:mt-40 z-[20]"
    >
      <div className="h-full w-full flex flex-col gap-4 justify-center m-auto mt-24 text-start">
        <div className="group relative max-w-max flex items-center justify-center rounded-full px-2 pl-3 md:px-4 py-1 md:py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 max-sm:-mb-2 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
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
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
          <AnimatedGradientText className="text-xs md:text-sm font-medium">
            Full-Stack Web Developer
          </AnimatedGradientText>
          <ChevronRight
              className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
            />
        </div>

        <MotionDiv
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-2 text-2xl md:text-5xl text-extbold font-extrabold tracking-wide text-white max-w-[600px] w-auto h-auto"
        >
          <span>
            Hello. I'm
              <MorphingText 
                texts={["Mohd Zaid", "Developer", "Freelancer"]}
              />
          </span>
        </MotionDiv>

        <TextAnimate animation="blurIn" as='h1' className="text-base max-sm:w-[85%] md:text-lg text-gray-300 mb-5 -mt-4 max-w-[600px]">
          I build modern, scalable, and user-friendly web applications for startups and growing businesses.
        </TextAnimate>


        <MotionA
          href="/resumeFull.pdf"
          target="_blank" 
          rel="noopener noreferrer"
          variants={slideInFromLeft(1)}
          className="max-sm:-mt-4"
        >
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
              View Resume
            </span>
          </ShimmerButton>
        </MotionA>
      </div>

      <MotionDiv
        variants={slideInFromRight(0.8)}
        className="w-full h-full flex justify-start max-sm:mt-6 max-sm:-ml-12 -mr-6 lg:-mr-48 items-center"
      >
        <Image
          src="/hero-bg.svg"
          alt="work icons"
          height={550}
          width={550}
          draggable={false}
          className="select-none"
        />
      </MotionDiv>
    </MotionDiv>
  );
};
