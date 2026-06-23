"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="mx-auto max-w-[700px] px-6 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading"
          >
            About the artist
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-5xl font-heading leading-[0.92] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl"
          >
            Ashbin Kafle
          </motion.h1>

          <motion.div variants={fadeUp} className="space-y-0.5 pt-2">
            <p className="text-2xl font-heading leading-tight tracking-[-0.02em] text-foreground/65 sm:text-3xl">
              Artist
            </p>
            <p className="text-2xl font-heading leading-tight tracking-[-0.02em] text-foreground/50 sm:text-3xl">
              Visual Storyteller
            </p>
            <p className="text-2xl font-heading leading-tight tracking-[-0.02em] text-foreground/35 sm:text-3xl">
              Nature Observer
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-[550px] pt-6 text-base leading-8 text-foreground/70 sm:text-lg"
          >
            Creating landscapes that invite stillness, reflection, and a deeper
            connection with nature.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
