"use client";

import { motion } from "framer-motion";
import Header from "@/components/header/Header";
import ContactHero from "@/components/contact/ContactHero";

export default function ContactPage() {
  return (
    <>
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative pt-[80px]"
      >
        <ContactHero />
      </motion.main>
    </>
  );
}
