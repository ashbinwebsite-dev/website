"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Navigation */}
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4">
              Navigation
            </p>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/portfolio"
                className="text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300"
              >
                Portfolio
              </Link>
              <Link
                href="/about"
                className="text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300"
              >
                Get in Touch
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4">
              Social
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://instagram.com/ashbinkafle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300"
              >
                Twitter
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4">
              Contact
            </p>
            <a
              href="mailto:hello@ashbinkafle.com"
              className="text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300"
            >
              hello@ashbinkafle.com
            </a>
          </div>

          {/* About */}
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4">
              About
            </p>
            <p className="text-sm leading-6 text-foreground/60 max-w-[220px]">
              An artist creating quiet moments inspired by nature, memory, and
              light.
            </p>
          </div>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-border/70">
          <p className="text-xs text-foreground/40 tracking-[0.2em] uppercase">
            &copy; {currentYear} Ashbin Kafle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
