"use client";

import { motion } from "framer-motion";

export default function ContactImage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-full min-h-[400px] lg:min-h-0 overflow-hidden rounded-[12px] bg-[#eaf5ea]"
    >
      <div
        className="group absolute inset-0 h-full w-full overflow-hidden rounded-[12px] transition-transform duration-500 ease-[0.22,1,0.36,1] hover:scale-[1.01]"
      >
        <img
          src="https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=80&auto=format&fit=crop"
          alt="Artist working on a landscape painting in natural light"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 rounded-[12px] ring-1 ring-inset ring-black/5 pointer-events-none" />
      </div>
    </motion.div>
  );
}
