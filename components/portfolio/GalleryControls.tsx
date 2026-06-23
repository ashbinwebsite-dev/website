"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryControlsProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

export default function GalleryControls({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  onClose,
}: GalleryControlsProps) {
  return (
    <>
      {/* Top bar with counter and close */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between p-6 md:p-10">
        {/* Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto text-xs uppercase tracking-[0.3em] text-foreground/70"
        >
          {String(currentIndex + 1).padStart(2, "0")} /{" "}
          {String(totalItems).padStart(2, "0")}
        </motion.div>

        {/* Close button */}
        <motion.button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-white/90 text-foreground transition duration-300 hover:border-primary/70"
        >
          <X size={18} />
        </motion.button>
      </div>

      {/* Center navigation buttons */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-between px-6 md:px-10">
        {/* Previous */}
        <motion.button
          type="button"
          onClick={onPrevious}
          aria-label="Previous artwork"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto group inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-white/70 text-foreground transition duration-300 hover:border-primary/70 hover:bg-white/95"
        >
          <ChevronLeft size={20} />
        </motion.button>

        {/* Next */}
        <motion.button
          type="button"
          onClick={onNext}
          aria-label="Next artwork"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto group inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-white/70 text-foreground transition duration-300 hover:border-primary/70 hover:bg-white/95"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </>
  );
}
