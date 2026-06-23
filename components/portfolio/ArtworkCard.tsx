"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Artwork } from "@/types/artwork";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: () => void;
}

export default function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg bg-white/50 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "40px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <div className="relative w-full overflow-hidden">
        <img
          src={artwork.img.src}
          alt={artwork.img.alt}
          className="w-full h-auto transition-all duration-500 group-hover:brightness-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/5" />
      </div>
    </motion.button>
  );
}
