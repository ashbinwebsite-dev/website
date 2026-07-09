"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useHomepageConfig, useArtworkById } from "@/hooks/usePublicData";
import Shimmer from "@/components/ui/Shimmer";

export default function LandscapeBreak() {
  const { data: config } = useHomepageConfig();
  const section = config?.landscape_break;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  const artworkId = section?.image_artwork_id ?? null;
  const { data: landscapeArtwork } = useArtworkById(artworkId);

  const imageUrl = landscapeArtwork?.image_url || section?.image_url || "";
  const imageLoading = !landscapeArtwork && artworkId !== null;
  const imageAlt = landscapeArtwork?.image_alt || "Expansive landscape";

  return (
    <section ref={ref} className="py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[12px] bg-[#eaf5ea]"
        >
          <motion.div
            style={{ y }}
            className="group relative h-[50vh] overflow-hidden rounded-[12px] md:h-[65vh] lg:h-[70vh] transition-transform duration-[600ms] ease-[0.22,1,0.36,1] hover:scale-[1.01]"
          >
            {imageLoading ? (
              <Shimmer className="h-full w-full" />
            ) : imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="100vw"
                className="object-cover"
                loading="lazy"
              />
            ) : null}
            <div className="pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-inset ring-black/5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
