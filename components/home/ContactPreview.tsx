"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useHomepageConfig, useArtworkById } from "@/hooks/usePublicData";
import Shimmer from "@/components/ui/Shimmer";

export default function ContactPreview() {
  const { data: config } = useHomepageConfig();
  const section = config?.contact_preview;
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const artworkId = section?.image_artwork_id ?? null;
  const { data: contactArtwork } = useArtworkById(artworkId);

  const imageUrl = contactArtwork?.image_url || section?.image_url || "";
  const imageLoading = !contactArtwork && artworkId !== null;
  const imageAlt = contactArtwork?.image_alt || (contactArtwork?.title || "Artist working on a landscape painting in natural light");
  const visible = section?.visible ?? true;
  const subtitle = section?.subtitle || "Get in Touch";
  const title = section?.title || "Let's Create\nSomething Together";
  const text = section?.text || "Available for commissions, exhibitions, collaborations, and landscape projects. Currently accepting new enquiries and would welcome a conversation about your project.";
  const availableFor = section?.available_for || "Commissions, Exhibitions, Collaborations, Landscape Projects";
  const buttonText = section?.button_text || "Get in Touch";
  const buttonLink = section?.button_link || "/contact";
  const availableItems = availableFor.split(",").map((s) => s.trim()).filter(Boolean);

  if (!visible) return null;

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
            className="relative h-[55vh] overflow-hidden rounded-[12px] bg-[#eaf5ea] lg:h-[70vh]"
          >
            <motion.div
              style={{ y }}
              className="h-full w-full overflow-hidden rounded-[12px] transition-transform duration-[600ms] ease-[0.22,1,0.36,1] hover:scale-[1.01]"
            >
              {imageLoading ? (
                <Shimmer className="h-full w-full" />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
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
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[520px]"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading mb-4">
              {subtitle}
            </p>
            <h2 className="text-3xl font-heading leading-[1.02] tracking-[-0.035em] text-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-6 text-base leading-8 text-foreground/75 sm:text-lg">
              {text}
            </p>

            <div className="mt-8 space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/50 font-heading">
                Available for
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {availableItems.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-foreground/70 sm:text-base"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <Link
                href={buttonLink}
                className="inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-sm uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] active:scale-[0.98]"
              >
                {buttonText}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
