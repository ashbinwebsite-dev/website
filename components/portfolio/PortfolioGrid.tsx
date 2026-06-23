"use client";

import { useState } from "react";
import ArtworkCard from "./ArtworkCard";
import GalleryViewer from "./GalleryViewer";
import { Artwork } from "@/types/artwork";

interface PortfolioGridProps {
  artworks: Artwork[];
  initialArtworkId?: string;
}

export default function PortfolioGrid({
  artworks,
  initialArtworkId,
}: PortfolioGridProps) {
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(
    initialArtworkId || null,
  );

  const selectedArtwork = artworks.find((art) => art.id === selectedArtworkId);
  const selectedIndex = selectedArtwork
    ? artworks.findIndex((art) => art.id === selectedArtwork.id)
    : -1;

  return (
    <>
      <div className="columns-1 gap-6 md:columns-2 lg:columns-3 2xl:columns-4 px-6 lg:px-10">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="mb-6 break-inside-avoid">
            <ArtworkCard
              artwork={artwork}
              onClick={() => setSelectedArtworkId(artwork.id)}
            />
          </div>
        ))}
      </div>

      {selectedArtwork && selectedIndex !== -1 && (
        <GalleryViewer
          artwork={selectedArtwork}
          artworks={artworks}
          index={selectedIndex}
          onClose={() => setSelectedArtworkId(null)}
          onNavigate={(index) => {
            const newArtwork = artworks[index];
            if (newArtwork) {
              setSelectedArtworkId(newArtwork.id);
            }
          }}
        />
      )}
    </>
  );
}
