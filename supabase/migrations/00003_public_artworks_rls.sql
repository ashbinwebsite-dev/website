-- ============================================================================
-- Allow public read access to all artworks
-- ============================================================================
-- The app layer handles published filtering (portfolio page, useArtworks,
-- useFeaturedArtworks). RLS was silently blocking unpublished artwork
-- references used in homepage config, about page, etc. which use
-- useArtworkById to fetch individual artworks regardless of published
-- status.
-- ============================================================================

drop policy if exists "Published artworks are viewable by everyone"
  on public.artworks;

create policy "Artworks are viewable by everyone"
  on public.artworks for select using (true);
