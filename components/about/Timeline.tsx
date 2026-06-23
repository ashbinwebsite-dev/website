"use client";

import { motion } from "framer-motion";

const milestones = [
  { year: "2020", label: "Started painting professionally" },
  { year: "2022", label: "First solo exhibition" },
  { year: "2023", label: "Landscape series — full collection" },
  { year: "2025", label: "Current collection & commissions" },
];

const itemAnimation = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.08 + i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Timeline() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[520px] px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading mb-10 text-center"
        >
          Milestones
        </motion.p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />

          <ol className="space-y-10">
            {milestones.map((item, i) => (
              <motion.li
                key={item.year}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={itemAnimation}
                className="relative flex items-start gap-5"
              >
                {/* Dot */}
                <div className="relative z-10 mt-1.5 flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-background">
                  <div className="h-2 w-2 rounded-full bg-foreground/30" />
                </div>

                <div className="pt-1">
                  <p className="text-sm font-heading tracking-[-0.02em] text-foreground">
                    {item.year}
                  </p>
                  <p className="text-sm leading-6 text-foreground/65 mt-0.5">
                    {item.label}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
