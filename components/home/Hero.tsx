"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useHomepageConfig, useArtworkById } from "@/hooks/usePublicData";
import Shimmer from "@/components/ui/Shimmer";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
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

export default function Hero() {
  const { data: config } = useHomepageConfig();
  const hero = config?.hero;

  const heroImageArtworkId = hero?.hero_image_artwork_id ?? null;
  const { data: heroArtwork } = useArtworkById(heroImageArtworkId);

  const heroImageUrl = heroArtwork?.image_url || hero?.hero_image_url || "";
  const isLoading = !heroArtwork && heroImageArtworkId !== null;
  const headline = hero?.headline || "Artist";
  const subheadline = hero?.subheadline || "Visual Storyteller";
  const tagline = hero?.tagline || "Nature Observer";
  const heroTagline = hero?.hero_tagline || "Painting quiet moments inspired by nature, memory, and light.";
  const exploreText = hero?.explore_portfolio_button_text || "Explore Portfolio";
  const exploreLink = hero?.explore_portfolio_button_link || "/portfolio";
  const aboutText = hero?.about_button_text || "About the Artist";
  const aboutLink = hero?.about_button_link || "/about";

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {isLoading ? (
          <Shimmer className="h-full w-full" />
        ) : heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt="Hero background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-4xl space-y-5"
        >
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-heading leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            {headline}
          </motion.h1>

          <motion.div variants={fadeUp} className="space-y-1 pt-1">
            <p className="text-xl font-heading tracking-[-0.02em] text-white/75 sm:text-2xl lg:text-3xl">
              {subheadline}
            </p>
            <p className="text-lg font-heading tracking-[-0.02em] text-white/55 sm:text-xl lg:text-2xl">
              {tagline}
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-xl pt-2 text-base leading-7 text-white/70 sm:text-lg"
          >
            {heroTagline}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-4 pt-6"
          >
            <Link
              href={exploreLink}
              className="inline-flex items-center rounded-full bg-white/90 px-7 py-3 text-sm uppercase tracking-[0.24em] text-foreground font-heading transition-all duration-300 hover:bg-white hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {exploreText}
            </Link>
            <Link
              href={aboutLink}
              className="inline-flex items-center rounded-full border border-white/30 px-7 py-3 text-sm uppercase tracking-[0.24em] !text-white/90 font-heading transition-all duration-300 hover:border-white/60 hover:text-white hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {aboutText}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-heading">
            Scroll
          </span>
          <div className="h-8 w-px bg-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
