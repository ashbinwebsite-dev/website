"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const items = [
  "Commissions",
  "Collaborations",
  "Exhibitions",
  "Landscape projects",
];

export default function FinalCTA() {
  return (
    <section className="border-t border-border/70 py-28 lg:py-36">
      <div className="mx-auto max-w-[720px] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-10"
        >
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading">
              Get in touch
            </p>
            <h2 className="text-4xl font-heading leading-[1.02] tracking-[-0.04em] text-foreground sm:text-5xl">
              Let&rsquo;s Create
              <br />
              Something Together
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-foreground/60 font-heading">
              Available for
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {items.map((item) => (
                <span
                  key={item}
                  className="text-base text-foreground/75 sm:text-lg"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-[#A8E4A0] px-8 py-3.5 text-sm uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] active:scale-[0.98]"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
