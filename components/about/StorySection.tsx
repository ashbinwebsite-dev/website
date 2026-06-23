"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface StorySectionProps {
  label: string;
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition: "left" | "right";
}

export default function StorySection({
  label,
  title,
  paragraphs,
  imageSrc,
  imageAlt,
  imagePosition,
}: StorySectionProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`relative h-[50vh] overflow-hidden rounded-[12px] bg-[#eaf5ea] sm:h-[60vh] lg:h-[70vh] ${
              imagePosition === "right" ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <motion.div
              style={{ y }}
              className="group h-full w-full overflow-hidden rounded-[12px] transition-transform duration-[600ms] ease-[0.22,1,0.36,1] hover:scale-[1.01]"
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
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

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`max-w-[520px] ${
              imagePosition === "right"
                ? "lg:order-1 lg:justify-self-end"
                : "lg:order-2"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading mb-4">
              {label}
            </p>
            <h2 className="text-3xl font-heading leading-[1.02] tracking-[-0.035em] text-foreground sm:text-4xl">
              {title}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-foreground/75 sm:text-lg">
              {paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
