"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ContactForm from "./ContactForm";
import { useContactConfig, useArtworkById } from "@/hooks/usePublicData";
import Shimmer from "@/components/ui/Shimmer";

export default function ContactHero() {
  const { data: config } = useContactConfig();
  const { data: contactArtwork } = useArtworkById(config?.image_artwork_id ?? null);

  const imageUrl = contactArtwork?.image_url || config?.image_url || "";
  const imageAlt = contactArtwork?.image_alt || (contactArtwork?.title || "Contact");
  const imageLoading = !contactArtwork && !!config?.image_artwork_id;
  const subtitle = config?.subtitle || "Contact";
  const title = config?.title || "Get in Touch";
  const bodyText = config?.body_text || "Available for commissions, exhibitions, collaborations, workshops, and landscape projects.";

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center py-12 lg:py-16">
      <div className="w-full mx-auto px-6 lg:px-10 max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[45%_55%] lg:items-center">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full"
          >
            <div className="relative h-[50vh] lg:h-[70vh] overflow-hidden rounded-[12px] bg-[#eaf5ea]">
              {imageLoading ? (
                <Shimmer className="absolute inset-0" />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                  priority
                />
              ) : null}
              <div className="pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-inset ring-black/5" />
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col justify-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-xs uppercase tracking-[0.35em] text-foreground/60 font-heading mb-4"
            >
              {subtitle}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl sm:text-5xl lg:text-[3.25rem] font-heading leading-[0.98] tracking-[-0.04em] text-foreground"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 text-base leading-8 text-foreground/75 max-w-[500px]"
            >
              {bodyText}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-10"
            >
              <ContactForm />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
