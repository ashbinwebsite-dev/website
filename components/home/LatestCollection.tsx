"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const collection = [
  {
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=80&auto=format&fit=crop",
    alt: "Abstract landscape painting in warm tones",
  },
  {
    src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=700&q=80&auto=format&fit=crop",
    alt: "Modern landscape art with bold color blocking",
  },
  {
    src: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=700&q=80&auto=format&fit=crop",
    alt: "Expressive landscape painting",
  },
  {
    src: "https://images.unsplash.com/photo-1561835490-5b266f96f5fb?w=700&q=80&auto=format&fit=crop",
    alt: "Contemporary abstract landscape in green tones",
  },
  {
    src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=700&q=80&auto=format&fit=crop",
    alt: "Minimal landscape painting in cool blues",
  },
];

export default function LatestCollection() {
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
            Collection
          </p>
          <h2 className="text-3xl font-heading leading-tight tracking-[-0.04em] text-foreground sm:text-4xl">
            Latest Works
          </h2>
        </motion.div>
      </div>

      {/* Horizontal scroll gallery */}
      <div className="overflow-x-auto pb-4 pl-6 lg:pl-10 scrollbar-none" style={{ scrollSnapType: "x mandatory" }}>
        <div
          className="flex gap-5 lg:gap-6"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {collection.map((item, i) => (
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
              className="relative h-[55vh] w-[75vw] flex-shrink-0 overflow-hidden rounded-[12px] bg-[#eaf5ea] sm:h-[60vh] sm:w-[60vw] lg:h-[70vh] lg:w-[45vw]"
              style={{ scrollSnapAlign: "start" }}
            >
              <Link
                href="/portfolio"
                className="group block h-full w-full"
              >
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
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-foreground/70 font-heading transition-all duration-300 hover:text-foreground group"
          >
            View Collection
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
