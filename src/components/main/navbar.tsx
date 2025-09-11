'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, SOCIALS } from "@/constants";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { MotionDiv } from "@/lib/motionElements";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.getElementById("hero")?.offsetHeight || 0;
      setShrink(window.scrollY > heroHeight - 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={clsx(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 h-[50px] md:h-[65px] shadow-lg shadow-[#2A0E61]/50 bg-[#03001427] backdrop-blur-md max-sm:px-10 px-20 transition-all duration-500 flex justify-center items-center",
        shrink ? "md:w-[80%] w-full md:rounded-2xl" : "w-full"
      )}
    >
      {/* Navbar Container */}
      <div className="w-full h-full flex items-center justify-between m-auto md:px-[10px]">
        {/* Logo */}
        <Link href="#about-me" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            draggable={false}
            className="cursor-pointer "
          />
          <div className="min-w-44"></div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex w-[500px] h-full flex-row items-center justify-between md:mr-20">
          <div className="flex items-center justify-between w-full h-auto border-[rgba(112,66,248,0.38)] bg-[rgba(3,0,20,0.37)] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                className="cursor-pointer px-3 py-1 rounded-2xl hover:border-white border border-transparent transition"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Socials */}
        <div className="hidden md:flex flex-row gap-5">
          {SOCIALS.map(({ link, name, icon: Icon }) => (
            <Link
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              key={name}
            >
              <Icon className="h-6 w-6 text-white" />
            </Link>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-white focus:outline-none text-3xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={30} /> : "☰"}
        </button>
      </div>

      <div className="md:hidden block">
        <ScrollProgress />
      </div>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-72 bg-[#03001427] backdrop-blur-md flex flex-col items-center justify-center text-gray-200"
          >
            {/* Links with staggered animation */}
            <MotionDiv
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {},
              }}
              className="flex flex-col gap-8 text-2xl"
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={link.link}
                    className="hover:text-[rgb(112,66,248)] transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}
            </MotionDiv>

            {/* Socials */}
            <div className="mt-10">
              <MotionDiv
              initial="hidden"
              animate="visible"
              exit="hidden"
              viewport={{ once: true, amount: 0.2 }} 
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
                hidden: {},
              }}
              className="flex gap-8"
            >
              {SOCIALS.map(({ link, name, icon: Icon }) => (
                <motion.div
                  key={name}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Link
                    href={link}
                    target="_blank"
                    rel="noreferrer noopener"
                    key={name}
                  >
                    <Icon className="h-7 w-7" />
                  </Link>
                </motion.div>
              ))}
              </MotionDiv>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};
