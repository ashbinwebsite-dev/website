"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useHomepageConfig } from "@/hooks/usePublicData";
import type { ArtworkRow } from "@/types/database/database";


const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.08 + i * 0.06,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function FeaturedWorks() {
  const { data: config } = useHomepageConfig();
  const section = config?.featured_works;

  const [artworks, setArtworks] = useState<{ src: string; alt: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!section?.artwork_ids || section.artwork_ids.length === 0) {
      setArtworks([]);
      setLoaded(true);
      return;
    }

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("artworks")
        .select("id, image_url, image_alt, title")
        .in("id", section.artwork_ids);

      if (data && data.length > 0) {
        // Sort by the order of artwork_ids
        const sorted = section.artwork_ids
          .map((id) => data.find((a) => a.id === id))
          .filter(Boolean)
          .map((a) => ({
            src: (a as ArtworkRow).image_url,
            alt:
              (a as ArtworkRow).image_alt ||
              (a as ArtworkRow).title ||
              "Featured artwork",
          }));
        setArtworks(sorted);
      }
      setLoaded(true);
    }
    load();
  }, [section?.artwork_ids]);

  const images = loaded ? artworks : [];
  const subtitle = section?.subtitle || "Selected Works";
  const title = section?.title || "Featured Paintings";
  const viewText = section?.view_all_button_text || "View Full Portfolio";
  const viewLink = section?.view_all_button_link || "/portfolio";
  const visible = section?.visible ?? true;

  if (!visible) return null;

  return (
    <section className="py-28 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col gap-2"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading">
            {subtitle}
          </p>
          <h2 className="text-3xl font-heading leading-tight tracking-[-0.04em] text-foreground sm:text-4xl">
            {title}
          </h2>
        </motion.div>

        <div className="columns-2 gap-4 sm:columns-3 lg:gap-5">
          {images.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={itemAnimation}
              className="mb-4 break-inside-avoid sm:mb-5"
            >
              <Link
                href={viewLink}
                className="group relative block overflow-hidden rounded-[12px] bg-[#eaf5ea]"
              >
                <div className="relative overflow-hidden rounded-[12px] transition-all duration-[600ms] ease-[0.22,1,0.36,1] group-hover:scale-[1.02] group-hover:brightness-[1.08]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600}
                    height={800}
                    className="h-auto w-full object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlYWY1ZWEiLz48L3N2Zz4="
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-inset ring-black/5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <Link
            href={viewLink}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-foreground/70 font-heading transition-all duration-300 hover:text-foreground group"
          >
            {viewText}
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
