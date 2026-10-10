'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionDiv, MotionP, MotionSpan } from "@/lib/motionElements";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide splash after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Letter animation variants
  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.8
    },
    visible: (i:any) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.08,
        ease: [0.215, 0.61, 0.355, 1.0]
      }
    })
  };

  // Container variants for the whole splash
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  // Backdrop animation
  const backdropVariants = {
    visible: {
      opacity: 1
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        delay: 0.2
      }
    }
  };

  const name = "MOHD ZAID"; 
  const tagline = "Full Stack Developer"; 

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionDiv
          className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-black"
          variants={backdropVariants}
          initial="visible"
          exit="exit"
        >
          {/* Animated gradient background */}
          <MotionDiv 
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)",
              ]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Main content container */}
          <MotionDiv
            className="relative z-10 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Main name/logo with letter animation */}
            <div className="mb-6 overflow-hidden">
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">
                {name.split("").map((letter, index) => (
                  <MotionSpan
                    key={index}
                    className="inline-block tracking-wider text-white"
                    custom={index}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </MotionSpan>
                ))}
              </h1>
            </div>

            {/* Animated line */}
            <MotionDiv
              className="mx-auto mb-6 h-px bg-gradient-to-r from-transparent via-white to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ 
                width: "200px", 
                opacity: 1,
                transition: {
                  duration: 1,
                  delay: 0.8,
                  ease: "easeOut"
                }
              }}
            />

            {/* Tagline with fade effect */}
            <MotionP
              className="text-md md:text-xl text-gray-400 tracking-[0.2em] uppercase"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ 
                opacity: 1, 
                letterSpacing: "0.2em",
                transition: {
                  duration: 1,
                  delay: 1.2,
                  ease: "easeOut"
                }
              }}
            >
              {tagline}
            </MotionP>

            {/* Loading dots animation */}
            <MotionDiv 
              className="mt-12 flex justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 1.5 }
              }}
            >
              {[0, 1, 2].map((i) => (
                <MotionDiv
                  key={i}
                  className="h-2 w-2 rounded-full bg-white"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </MotionDiv>
          </MotionDiv>

          {/* Corner accents */}
          <MotionDiv
            className="absolute top-10 left-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.3, 
              scale: 1,
              rotate: 45,
              transition: { delay: 0.5, duration: 0.8 }
            }}
          >
            <div className="h-20 w-20 border-t-2 border-l-2 border-white/30" />
          </MotionDiv>

          <MotionDiv
            className="absolute bottom-10 right-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.3, 
              scale: 1,
              rotate: 45,
              transition: { delay: 0.5, duration: 0.8 }
            }}
          >
            <div className="h-20 w-20 border-b-2 border-r-2 border-white/30" />
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};