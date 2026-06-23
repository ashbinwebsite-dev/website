"use client";

import { motion } from "framer-motion";
import Header from "@/components/header/Header";
import Hero from "@/components/home/Hero";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import AboutPreview from "@/components/home/AboutPreview";
import LandscapeBreak from "@/components/home/LandscapeBreak";
import Quote from "@/components/home/Quote";
import Process from "@/components/home/Process";
import LatestCollection from "@/components/home/LatestCollection";
import ContactPreview from "@/components/home/ContactPreview";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Section 1 — Fullscreen Hero */}
        <Hero />

        {/* Section 2 — Featured Works */}
        <FeaturedWorks />

        {/* Section 3 — About Preview */}
        <AboutPreview />

        {/* Section 4 — Featured Landscape */}
        <LandscapeBreak />

        {/* Section 5 — Quote */}
        <Quote />

        {/* Section 6 — Process */}
        <Process />

        {/* Section 7 — Latest Collection */}
        <LatestCollection />

        {/* Section 8 — Get in Touch Preview */}
        <ContactPreview />

        {/* Section 9 — Footer */}
        <Footer />
      </motion.main>
    </>
  );
}
