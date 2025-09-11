"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

type SkillDataProviderProps = {
  src: string;
  name: string;
  width: number;
  height: number;
  index: number;
};

export const SkillDataProvider = ({
  src,
  name,
  width,
  height,
  index,
}: SkillDataProviderProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const animationDelay = 0.1;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      variants={imageVariants}
      animate={inView ? "visible" : "hidden"}
      custom={index}
      transition={{ delay: index * animationDelay }}
    >
    <div className="w-2/3 mx-auto lg:w-full flex justify-center">
      <Image
        src={`/skills/${src}`}
        alt={name}
        width={width}
        height={height}
        className={`
          ${["Render", "Shadcn", "Razorpay", "AWS"].includes(name) ? "invert" : ""}
          ${["Appwrite"].includes(name) ? "max-sm:scale-200":""}
          ${["Cloudinary","Render","Axios","Razorpay","Supabase","MySQL","Next.js"].includes(name) ? "max-sm:scale-150":""}
        
          h-auto`}
      />
    </div>
    </motion.div>
  );
};
