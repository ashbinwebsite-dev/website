"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHomepageConfig, useArtworkById } from "@/hooks/usePublicData";
import Shimmer from "@/components/ui/Shimmer";

export default function AboutPreview() {
  const { data: config } = useHomepageConfig();
  const section = config?.about_preview;
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const artworkId = section?.about_image_artwork_id ?? null;
  const { data: aboutArtwork } = useArtworkById(artworkId);

  const aboutImageUrl = aboutArtwork?.image_url || section?.about_image_url || "";
  const imageLoading = !aboutArtwork && artworkId !== null;
  const subtitle = section?.subtitle || "About the Artist";
  const title = section?.title || "About";
  const bioShort = section?.bio_short || "";
  const bioLong = section?.bio_long || "";
  const bioParagraphs = bioShort
    ? [bioShort]
    : bioLong
      ? bioLong.split("\n\n").filter(Boolean)
      : ["Ashbin Kafle is an artist based in Kathmandu, Nepal. His work explores the quiet relationship between light, memory, and terrain — translating the atmosphere of a place into compositions defined by restraint and intention."];
  const buttonText = section?.button_text || "Read More";
  const buttonLink = section?.button_link || "/about";

  return (
    <section className="border-t border-border/70 py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[60vh] overflow-hidden rounded-[12px] bg-[#eaf5ea] lg:h-[75vh]"
          >
            <motion.div
              style={{ y }}
              className="h-full w-full overflow-hidden rounded-[12px] transition-transform duration-[600ms] ease-[0.22,1,0.36,1] hover:scale-[1.01]"
            >
              {imageLoading ? (
                <Shimmer className="h-full w-full" />
              ) : aboutImageUrl ? (
                <Image
                  src={aboutImageUrl}
                  alt="About the artist"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-inset ring-black/5" />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.55,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-[520px]"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading mb-4">
              {subtitle}
            </p>
            <h2 className="text-3xl font-heading leading-[1.02] tracking-[-0.035em] text-foreground sm:text-4xl">
              {title}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-foreground/75 sm:text-lg">
              {bioParagraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href={buttonLink}
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-foreground/70 font-heading transition-all duration-300 hover:text-foreground group"
              >
                {buttonText}
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
