"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useHomepageConfig } from "@/hooks/usePublicData";
import type { ArtworkRow } from "@/types/database/database";


export default function LatestCollection() {
  const { data: config } = useHomepageConfig();
  const section = config?.latest_collection;

  const [images, setImages] =
    useState<{ src: string; alt: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!section?.artwork_ids || section.artwork_ids.length === 0) {
      setImages([]);
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
        const sorted = section.artwork_ids
          .map((id) => data.find((a) => a.id === id))
          .filter(Boolean)
          .map((a) => ({
            src: (a as ArtworkRow).image_url,
            alt:
              (a as ArtworkRow).image_alt ||
              (a as ArtworkRow).title ||
              "Latest artwork",
          }));
        setImages(sorted);
      }
      setLoaded(true);
    }
    load();
  }, [section?.artwork_ids]);

  const subtitle = section?.subtitle || "Collection";
  const title = section?.title || "Latest Works";
  const viewText = section?.view_all_button_text || "View Collection";
  const viewLink = section?.view_all_button_link || "/portfolio";
  const visible = section?.visible ?? true;

  if (!visible) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col gap-2"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading">
            {subtitle}
          </p>
          <h2 className="text-3xl font-heading leading-tight tracking-[-0.04em] text-foreground sm:text-4xl">
            {title}
          </h2>
        </motion.div>
      </div>

      {/* Horizontal scroll gallery */}
      <div
        className=" overflow-x-auto pb-4 pl-6 lg:pl-10 scrollbar-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div
          className="flex gap-5 lg:gap-6"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {images.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative h-[55vh] w-[75vw] flex-shrink-0 overflow-hidden rounded-[12px] bg-[#eaf5ea] sm:h-[60vh] sm:w-[60vw] lg:h-[70vh] lg:w-[45vw]`}
              style={{ scrollSnapAlign: "start" }}
            >
              <Link href={viewLink} className="group block h-full w-full">
                <div className="h-full w-full overflow-hidden rounded-[12px] transition-all duration-[600ms] ease-[0.22,1,0.36,1] group-hover:scale-[1.02] group-hover:brightness-[1.06]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 75vw, 45vw"
                    className="object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlYWY1ZWEiLz48L3N2Zz4="
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-inset ring-black/5" />
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Final spacer for padding */}
          <div className="w-6 flex-shrink-0 lg:w-10" />
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-center"
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
