"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GalleryControls from "./GalleryControls";
import GalleryInfo from "./GalleryInfo";
import { Artwork } from "@/types/artwork";
import { useGalleryNavigation } from "@/hooks/useGalleryNavigation";
import { useScrollPosition } from "@/hooks/useScrollPosition";

interface GalleryViewerProps {
  artwork: Artwork;
  artworks: Artwork[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function GalleryViewer({
  artwork,
  artworks,
  index,
  onClose,
  onNavigate,
}: GalleryViewerProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const { restorePosition } = useScrollPosition();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleNext = () => {
    const nextIndex = (index + 1) % artworks.length;
    onNavigate(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = (index - 1 + artworks.length) % artworks.length;
    onNavigate(prevIndex);
  };

  const handleClose = () => {
    document.body.style.overflow = "unset";
    onClose();
    restorePosition();
  };

  useGalleryNavigation({
    totalItems: artworks.length,
    currentIndex: index,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onClose: handleClose,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] bg-[#F8F8F6] flex flex-col items-center justify-center"
    >
      <GalleryControls
        currentIndex={index}
        totalItems={artworks.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onClose={handleClose}
      />

      <div className="relative h-full w-full flex items-center justify-center px-6 md:px-10 pt-20 md:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-[90vw] flex items-center justify-center">
              <Image
                src={artwork.img.src}
                alt={artwork.img.alt}
                width={artwork.img.width || 1000}
                height={artwork.img.height || 1000}
                priority
                unoptimized
                className="w-full h-auto max-h-[75vh] object-contain"
                sizes="(max-width: 768px) 90vw, 80vw"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <GalleryInfo
        artwork={artwork}
        isOpen={infoOpen}
        onToggle={() => setInfoOpen(!infoOpen)}
      />
    </motion.div>
  );
}
