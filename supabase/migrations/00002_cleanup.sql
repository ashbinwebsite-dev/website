-- ============================================================================
-- Cleanup Migration — remove old site_settings keys that have been migrated
-- to dedicated configs (homepage_config, about_config, contact_config)
-- ============================================================================

-- Delete old homepage-related settings that are now in homepage_config
delete from public.site_settings
where key in (
  'home_quote',
  'contact_blurb',
  'available_for'
);

-- Delete old about-page settings that are now in about_config
delete from public.site_settings
where key in (
  'about_quote',
  'story_journey',
  'story_process',
  'story_philosophy'
);

-- The `featured` column on artworks is no longer used.
-- Homepage featured works are now managed via homepage_config -> featured_works.artwork_ids
-- The column is kept for backward compatibility but can be dropped if desired.
-- Uncomment the next line to remove it:
-- alter table public.artworks drop column if exists featured;

-- The `gallery_images` table is no longer used by the public frontend.
-- Homepage images are now referenced through homepage_config using artwork IDs.
-- The table is kept for data preservation but can be dropped if desired.
-- Uncomment the next two lines to remove it:
-- drop table if exists public.gallery_images cascade;
