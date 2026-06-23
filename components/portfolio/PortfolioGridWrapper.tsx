"use client";

import { useSearchParams } from "next/navigation";
import PortfolioGrid from "./PortfolioGrid";
import { Artwork } from "@/types/artwork";

interface PortfolioGridWrapperProps {
  artworks: Artwork[];
}

export default function PortfolioGridWrapper({
  artworks,
}: PortfolioGridWrapperProps) {
  const searchParams = useSearchParams();
  const artSlug = searchParams.get("art");

  // Find artwork by slug for deep linking
  const initialArtwork = artworks.find((art) => art.slug === artSlug);

  return (
    <PortfolioGrid artworks={artworks} initialArtworkId={initialArtwork?.id} />
  );
}
