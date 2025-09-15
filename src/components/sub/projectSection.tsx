'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MotionDiv, MotionSpan } from '@/lib/motionElements';
import Image from 'next/image';
import { projects } from '../../../public/projects/data';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

const ProjectCarousel = () => {
  const [[currentIndex, direction], setCurrentIndex] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(([prev]) => [(prev + 1) % projects.length, 1]); // autoplay always forward
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToProject = (index: number) => {
    if (index === currentIndex) return;
    const dir = index > currentIndex ? 1 : -1;
    setCurrentIndex([index, dir]);
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const swipeThreshold = 80;
    if (info.offset.x < -swipeThreshold) {
      // swipe left → next
      setCurrentIndex(([prev]) => [(prev + 1) % projects.length, 1]);
    } else if (info.offset.x > swipeThreshold) {
      // swipe right → previous
      setCurrentIndex(([prev]) => [(prev - 1 + projects.length) % projects.length, -1]);
    }
  };

  return (
    <div className="container mx-auto max-sm:mt-2 md:p-8 relative">
      <div className="relative rounded-2xl overflow-hidden min-h-[400px] md:min-h-[500px]">
        {/* Project Number */}
        <MotionDiv
          key={currentIndex}
          className="max-sm:hidden absolute top-4 left-4 md:top-8 md:left-8 text-4xl md:text-8xl font-extrabold text-purple-700/25 z-10 font-mono"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {String(currentIndex + 1).padStart(2, '0')}
        </MotionDiv>

        {/* Main Content */}
        <div className="p-4 md:p-8 flex items-center min-h-[350px] md:min-h-[450px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <MotionDiv
              key={currentIndex}
              className="flex flex-col md:flex-row w-full gap-6 items-center text-center md:text-left"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
            >
              {/* Info */}
              <div className="w-full md:w-2/5 order-2 md:order-1">
                <MotionSpan
                  className="text-xl md:text-3xl text-white mb-2 font-bold leading-tight block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {projects[currentIndex].name}
                </MotionSpan>
                <MotionSpan
                  className="text-base md:text-lg text-gray-400 font-baloo-bhai-2 leading-relaxed mb-4 block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {projects[currentIndex].description}
                </MotionSpan>
                <MotionDiv
                  className="flex gap-4 flex-wrap justify-center md:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {projects[currentIndex].technologies.map((tech, i) => (
                    <span key={i} className="text-purple-700 py-1 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </MotionDiv>
              </div>

              {/* Main Image */}
              <MotionDiv className="w-full md:w-3/5 flex justify-center items-center order-1 md:order-2">
                <Image
                  src={projects[currentIndex].image}
                  alt={projects[currentIndex].name}
                  width={800}
                  height={500}
                  priority
                  className="w-auto h-auto object-contain rounded-md"
                />
              </MotionDiv>
            </MotionDiv>
          </AnimatePresence>
        </div>

        {/* Thumbnails (desktop) */}
        <div className="hidden md:flex absolute right-8 bottom-8 flex-row gap-2">
          {projects.map((project, index) => (
            <MotionDiv
              key={project.id}
              className={`w-20 h-14 relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                index === currentIndex ? 'opacity-100' : 'opacity-40'
              }`}
              onClick={() => goToProject(index)}
            >
              <Image src={project.image} alt={project.name} fill sizes="100px" className="object-cover" />
            </MotionDiv>
          ))}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute md:bottom-12 bottom-2 left-1/2 -translate-x-1/2 md:left-36 flex gap-2 z-20">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToProject(idx)}
            aria-label={`Go to project ${idx + 1}`}
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx ? 'bg-white w-6 sm:w-8' : 'bg-white/20 w-3 sm:w-5'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectCarousel;
