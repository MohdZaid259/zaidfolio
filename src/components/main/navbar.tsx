'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SOCIALS } from "@/constants";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShrink(window.scrollY > window.innerHeight * 0.6);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock page scroll and allow Escape while the mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={clsx(
          "fixed left-1/2 top-0 z-50 flex h-[56px] -translate-x-1/2 items-center justify-center overflow-hidden bg-[#03001427] px-5 shadow-lg shadow-[#2A0E61]/50 backdrop-blur-md transition-all duration-500 md:h-[65px] md:px-10",
          shrink ? "w-full md:top-2 md:w-[86%] md:rounded-2xl" : "w-full"
        )}
      >
        <nav aria-label="Main" className="flex h-full w-full items-center justify-between">
          <Link href="/" aria-label="Home" className="flex shrink-0 items-center">
            <Image src="/logo.png" alt="" width={44} height={45} draggable={false} />
          </Link>

          <ul className="hidden items-center gap-1 rounded-full border border-[rgba(112,66,248,0.38)] bg-[rgba(3,0,20,0.37)] px-3 py-1.5 text-sm text-gray-200 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.title}>
                <Link
                  href={link.link}
                  className="block rounded-2xl border border-transparent px-3 py-1.5 transition hover:border-white/60"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="hidden items-center gap-1 md:flex">
            {SOCIALS.map(({ link, name, icon: Icon }) => (
              <li key={name}>
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={name}
                  className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>

          <button
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="flex size-11 items-center justify-center text-white md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="size-7" />
          </button>
        </nav>
        <div aria-hidden className="scroll-progress md:hidden" />
      </header>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="menu-in fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/60 text-gray-200 backdrop-blur-xl"
        >
          <button
            className="absolute right-4 top-2 flex size-11 items-center justify-center text-white"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="size-7" />
          </button>

          <ul className="flex flex-col items-center gap-6 text-2xl">
            {NAV_LINKS.map((link, i) => (
              <li key={link.title} className="menu-item-in" style={{ animationDelay: `${i * 50}ms` }}>
                <Link href={link.link} className="transition hover:text-[rgb(112,66,248)]" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-10 flex gap-6">
            {SOCIALS.map(({ link, name, icon: Icon }) => (
              <li key={name}>
                <a href={link} target="_blank" rel="noreferrer noopener" aria-label={name} className="flex size-11 items-center justify-center">
                  <Icon className="size-7" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
