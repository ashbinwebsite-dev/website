"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { clsx } from "clsx";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavItem from "./NavItem";

const navItems = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Get in Touch", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("portfolio");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll("section[id]"),
    ) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-32% 0px -55% 0px", threshold: 0.18 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 h-[80px] transition-all duration-500 ease-[0.22,1,0.36,1]",
        scrolled && !menuOpen
          ? "bg-white/76 backdrop-blur-xl border-b border-border/70"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-6 lg:px-10">
        {}
        <Logo scrolled={scrolled} />

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              active={activeSection === item.href.slice(1)}
              scrolled={scrolled && menuOpen}
            />
          ))}
        </nav>

        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setMenuOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-white/85 text-foreground transition duration-300 hover:border-primary/70 lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            open={menuOpen}
            activeSection={activeSection}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
