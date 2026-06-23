"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header/Header";
import { artworks } from "@/data/artworks";
import PortfolioGridWrapper from "@/components/portfolio/PortfolioGridWrapper";

export default function PortfolioPage() {
  return (
    <>
      <Header />

      <main className="relative overflow-hidden pt-[120px] pb-24">
        <Suspense fallback={<div />}>
          <PortfolioGridWrapper artworks={artworks} />
        </Suspense>
      </main>

      <footer className="border-t border-border/70 mt-24 py-16">
        <div className="container mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-12 lg:grid-cols-3"
          >
            <div>
              <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-4">
                About
              </p>
              <p className="text-sm leading-7 text-foreground/75 max-w-md">
                Ashbin Kafle creates minimal landscapes that prioritize light,
                atmosphere, and quiet compositional restraint.
              </p>
            </div>

            <div>
              <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-4">
                Contact
              </p>
              <a
                href="mailto:hello@ashbinkafle.com"
                className="text-sm leading-7 text-foreground/75 hover:text-foreground transition duration-300"
              >
                hello@ashbinkafle.com
              </a>
            </div>

            <div>
              <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-4">
                Social
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  className="text-sm leading-7 text-foreground/75 hover:text-foreground transition duration-300"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-sm leading-7 text-foreground/75 hover:text-foreground transition duration-300"
                >
                  Twitter
                </a>
              </div>
            </div>
          </motion.div>

          <div className="mt-16 pt-8 border-t border-border/70">
            <p className="text-xs text-foreground/50 tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} Ashbin Kafle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
