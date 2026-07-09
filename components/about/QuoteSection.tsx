"use client";

import { motion } from "framer-motion";
import { useAboutConfig } from "@/hooks/usePublicData";

export default function QuoteSection() {
  const { data: config } = useAboutConfig();

  const quoteText = config?.quote_text || "I don't paint places exactly as they are. I paint the feeling of standing there.";
  const attribution = config?.quote_attribution || "Ashbin Kafle";

  return (
    <section className="py-28 lg:py-40">
      <div className="mx-auto max-w-[700px] px-6 text-center">
        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            className="mx-auto text-foreground/15"
            aria-hidden="true"
          >
            <path
              d="M12 22H6V16C6 12.5 7.5 10 10.5 8L12 9.5C9.5 11 8.5 13 8.5 15H12V22ZM24 22H18V16C18 12.5 19.5 10 22.5 8L24 9.5C21.5 11 20.5 13 20.5 15H24V22Z"
              fill="currentColor"
            />
          </svg>

          <blockquote>
            <p className="text-2xl leading-[1.3] tracking-[-0.02em] text-foreground/85 font-heading sm:text-3xl lg:text-4xl">
              &ldquo;{quoteText}&rdquo;
            </p>
          </blockquote>

          <figcaption className="text-xs uppercase tracking-[0.3em] text-foreground/45 font-heading">
            — {attribution}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
