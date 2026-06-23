"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const featured = [
  {
    src: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80&auto=format&fit=crop",
    alt: "Abstract landscape painting with warm earth tones",
  },
  {
    src: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&q=80&auto=format&fit=crop",
    alt: "Expressive landscape painting with bold brushstrokes",
  },
  {
    src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80&auto=format&fit=crop",
    alt: "Modern abstract landscape painting",
  },
  {
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80&auto=format&fit=crop",
    alt: "Minimalist landscape painting",
  },
  {
    src: "https://images.unsplash.com/photo-1531913764164-f85c3e33d8d2?w=600&q=80&auto=format&fit=crop",
    alt: "Contemporary landscape art",
  },
  {
    src: "https://images.unsplash.com/photo-1561835490-5b266f96f5fb?w=600&q=80&auto=format&fit=crop",
    alt: "Abstract terrain painting in muted greens",
  },
];

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
            Selected Works
          </p>
          <h2 className="text-3xl font-heading leading-tight tracking-[-0.04em] text-foreground sm:text-4xl">
            Featured Paintings
          </h2>
        </motion.div>

        <div className="columns-2 gap-4 sm:columns-3 lg:gap-5">
          {featured.map((item, i) => (
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
                href="/portfolio"
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
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-foreground/70 font-heading transition-all duration-300 hover:text-foreground group"
          >
            View Full Portfolio
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
