"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Artwork } from "@/types/artwork";

interface GalleryInfoProps {
  artwork: Artwork;
  isOpen: boolean;
  onToggle: () => void;
}

export default function GalleryInfo({
  artwork,
  isOpen,
  onToggle,
}: GalleryInfoProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-40">
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-4 text-center text-xs uppercase tracking-[0.3em] text-foreground/70 hover:text-foreground transition-colors duration-300"
      >
        {isOpen ? "Hide Info" : "Show Info"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border/60 bg-white/95 backdrop-blur-sm px-6 py-8 md:px-10 md:py-12"
          >
            <div className="max-w-2xl space-y-6">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-2">
                    Title
                  </h3>
                  <p className="text-lg text-foreground">{artwork.title}</p>
                </div>
                <div>
                  <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-2">
                    Year
                  </h3>
                  <p className="text-lg text-foreground">{artwork.year}</p>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-2">
                  Medium
                </h3>
                <p className="text-sm text-foreground/85">{artwork.medium}</p>
              </div>

              {artwork.description && (
                <div>
                  <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-3">
                    Description
                  </h3>
                  <p className="text-sm leading-7 text-foreground/80">
                    {artwork.description}
                  </p>
                </div>
              )}

              {artwork.availability && (
                <div>
                  <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/70 mb-2">
                    Availability
                  </h3>
                  <p className="text-sm text-foreground/85 capitalize">
                    {artwork.availability === "available"
                      ? "Available"
                      : artwork.availability === "sold"
                        ? "Sold"
                        : "Commissioned"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
