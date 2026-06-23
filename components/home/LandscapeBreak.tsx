"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function LandscapeBreak() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-10, 10]);

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
            <Image
              src="https://images.unsplash.com/photo-1518173946687-a36af968b218?w=1500&q=85&auto=format&fit=crop"
              alt="Expansive misty mountain landscape at sunrise"
              fill
              sizes="100vw"
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlYWY1ZWEiLz48L3N2Zz4="
            />
            <div className="pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-inset ring-black/5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
