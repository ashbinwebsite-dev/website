"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Process() {
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section className="border-t border-border/70 py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[520px] lg:justify-self-end"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading mb-4">
              Studio Practice
            </p>
            <h2 className="text-3xl font-heading leading-[1.02] tracking-[-0.035em] text-foreground sm:text-4xl">
              The Process
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-foreground/75 sm:text-lg">
              <p>
                In the studio, each painting begins with observation — time
                spent with sketches, colour studies, and notes before a single
                brushstroke touches the canvas. Ashbin works slowly, building
                layers in oil and acrylic, allowing each piece to reveal itself
                over weeks rather than hours.
              </p>
              <p>
                Natural light guides the palette. The materials — canvas, linen,
                pigment — are chosen for their ability to hold texture and
                depth. The process is as much about patience as it is about
                intention, with each painting finding its own rhythm.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-foreground/70 font-heading transition-all duration-300 hover:text-foreground group"
              >
                Learn More
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>

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
              <Image
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1000&q=80&auto=format&fit=crop"
                alt="Artist working in studio with natural light"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlYWY1ZWEiLz48L3N2Zz4="
              />
              <div className="pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-inset ring-black/5" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
