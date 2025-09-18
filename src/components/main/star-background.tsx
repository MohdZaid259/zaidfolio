"use client";
import { MotionSpan } from "@/lib/motionElements";

export const StarsCanvas = () => {
  const stars = Array.from({ length: 100 }, (_, i) => i);

  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      {stars.map((i) => (
        <MotionSpan
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 200 - 100],
            x: [0, Math.random() * 200 - 100],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: Math.random() * 40 + 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
