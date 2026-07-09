"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/header/Header";
import PortfolioGridWrapper from "@/components/portfolio/PortfolioGridWrapper";
import Footer from "@/components/home/Footer";
import type { ArtworkRow } from "@/types/database/database";

export default function PortfolioPage() {
  const [artworks, setArtworks] = useState<ArtworkRow[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("artworks")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setArtworks(data as ArtworkRow[]);
      }
    }
    load();
  }, []);

  const mappedArtworks = artworks.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    year: a.year,
    medium: a.medium,
    description: a.description ?? undefined,
    availability: a.availability as "available" | "sold" | "commissioned" | undefined,
    img: {
      src: a.image_url,
      alt: a.image_alt || a.title,
      width: a.image_width ?? undefined,
      height: a.image_height ?? undefined,
    },
  }));

  return (
    <>
      <Header />

      <main className="relative overflow-hidden pt-[120px] pb-24">
        <Suspense fallback={<div />}>
          <PortfolioGridWrapper artworks={mappedArtworks} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
