"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function ProjectSection() {
  const projects = [
    { id: "01", title: "King of the ring fight", imageUrl: "/projects/project-1.png" },
    { id: "02", title: "Project Two", imageUrl: "/projects/lsitHero.png" },
    { id: "03", title: "Project Three", imageUrl: "/projects/lsitHero.png" },
  ];

  return (
    <section className="relative w-full text-white py-16">
      <Carousel
        opts={{ align: "center" }}
        className="w-full max-w-[1200px] mx-auto"
      >
        <CarouselContent className="flex h-[600px] items-center">
          {projects.map((p, i) => (
            <CarouselItem
              key={p.id}
              className="basis-[68%] shrink-0 relative flex items-center justify-center"
            >
              {/* IMAGE */}
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-full object-cover rounded-xl"
              />

              {/* BIG ID BEHIND */}
              <span className="absolute top-1/2 -translate-y-1/2 -left-[8vw] text-[20vw] font-extrabold text-white/10 z-0">
                {p.id}
              </span>

              {/* TITLE OUTSIDE/OVER */}
              <h2 className="absolute bottom-20 -left-[4vw] text-5xl md:text-7xl font-bold z-20 max-w-[14ch]">
                {p.title}
              </h2>

              {/* BUTTON */}
              <button className="absolute bottom-6 left-6 underline underline-offset-4 z-20">
                View Case
              </button>

              {/* GRADIENT TO HELP TEXT READABILITY */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent z-10" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

export default ProjectSection;
