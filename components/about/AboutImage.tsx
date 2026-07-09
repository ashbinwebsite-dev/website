"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface AboutImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function AboutImage({
  src,
  alt,
  priority = false,
  className = "",
}: AboutImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`overflow-hidden rounded-[12px] bg-[#eaf5ea] ${className}`}
    >
      <motion.div
        style={{ y }}
        className="group relative h-[50vh] overflow-hidden rounded-[12px] md:h-[65vh] lg:h-[70vh] transition-transform duration-[600ms] ease-[0.22,1,0.36,1] hover:scale-[1.01]"
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlYWY1ZWEiLz48L3N2Zz4="
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-inset ring-black/5" />
      </motion.div>
    </motion.div>
  );
}
