-- ============================================================================
-- Ashbin Web — Initial Schema
-- ============================================================================
-- This migration creates the full database schema for the dynamic portfolio
-- platform. Designed for Supabase (PostgreSQL 15+).
-- ============================================================================

-- 0. Extensions
-- ============================================================================
create extension if not exists "pgcrypto" with schema "extensions";

-- ============================================================================
-- 1. Profiles (extends Supabase auth.users)
-- ============================================================================
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text not null default '',
  headline        text not null default 'Artist',                -- e.g. "Artist"
  subheadline     text not null default 'Visual Storyteller',    -- e.g. "Visual Storyteller"
  tagline         text not null default 'Nature Observer',
  hero_tagline    text not null default 'Painting quiet moments inspired by nature, memory, and light.',
  bio_short       text not null default '',                      -- shown on homepage preview
  bio_long        text not null default '',                      -- shown on about page
  about_intro_heading text not null default 'Living Through Landscapes',
  about_intro     text not null default '',                      -- introduction paragraphs (JSON array of strings)
  process_description text not null default '',                  -- text for "The Process" section
  hero_image_url  text,
  avatar_url      text,
  about_image_url text,
  contact_email   text not null default '',
  location        text not null default 'Kathmandu, Nepal',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, contact_email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================================================
-- 2. Artworks
-- ============================================================================
create table if not exists public.artworks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  slug          text not null,
  title         text not null,
  year          smallint not null,
  medium        text not null,
  description   text,
  availability  text not null default 'available'
                  check (availability in ('available', 'sold', 'commissioned')),
  image_url     text not null,
  image_alt     text not null default '',
  image_width   integer,
  image_height  integer,
  featured      boolean not null default false,
  published     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint artworks_slug_user_unique unique (slug, user_id)
);

create index idx_artworks_user_id on public.artworks(user_id);
create index idx_artworks_featured on public.artworks(featured) where featured = true;
create index idx_artworks_published on public.artworks(published) where published = true;

-- ============================================================================
-- 3. Experience / Milestones
-- ============================================================================
create table if not exists public.experience (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  year        text not null,
  label       text not null,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_experience_user_id on public.experience(user_id);

-- ============================================================================
-- 4. Social Links
-- ============================================================================
create table if not exists public.social_links (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  platform    text not null,           -- e.g. 'instagram', 'twitter', 'email'
  label       text not null,           -- display text
  url         text not null,
  icon        text,                    -- optional icon name
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_social_links_user_id on public.social_links(user_id);

-- ============================================================================
-- 5. Services (available-for items)
-- ============================================================================
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_services_user_id on public.services(user_id);

-- ============================================================================
-- 6. Messages (contact form submissions)
-- ============================================================================
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  phone           text,
  subject         text not null,
  message         text not null,
  budget          text,
  project_timeline text,
  read            boolean not null default false,
  created_at      timestamptz not null default now()
);

create index idx_messages_read on public.messages(read) where read = false;

-- ============================================================================
-- 7. Contact Information
-- ============================================================================
create table if not exists public.contact_information (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null,           -- 'email', 'phone', 'address', 'social'
  label       text not null,           -- e.g. 'Email', 'Instagram'
  value       text not null,           -- the actual contact value
  href        text,                    -- optional clickable link
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_contact_info_user_id on public.contact_information(user_id);

-- ============================================================================
-- 8. Site Settings (quotes, metadata, etc.)
-- ============================================================================
create table if not exists public.site_settings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  key         text not null,
  value       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint site_settings_key_user_unique unique (key, user_id)
);

create index idx_site_settings_user_id on public.site_settings(user_id);

-- ============================================================================
-- 9. Gallery Images (for homepage galleries)
-- ============================================================================
create table if not exists public.gallery_images (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  section     text not null,           -- 'featured_works', 'latest_collection', 'landscape_break'
  image_url   text not null,
  image_alt   text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_gallery_images_section on public.gallery_images(user_id, section);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================
alter table public.profiles            enable row level security;
alter table public.artworks            enable row level security;
alter table public.experience          enable row level security;
alter table public.social_links        enable row level security;
alter table public.services            enable row level security;
alter table public.messages            enable row level security;
alter table public.contact_information enable row level security;
alter table public.site_settings       enable row level security;
alter table public.gallery_images      enable row level security;

-- ============================================================================
-- RLS Policies
-- ============================================================================

-- Profiles: owners can manage; anyone can read public profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Artworks: public can read published; owner can CRUD
create policy "Published artworks are viewable by everyone"
  on public.artworks for select using (published = true);

create policy "Owners can view all their artworks"
  on public.artworks for select using (auth.uid() = user_id);

create policy "Owners can insert artworks"
  on public.artworks for insert with check (auth.uid() = user_id);

create policy "Owners can update their artworks"
  on public.artworks for update using (auth.uid() = user_id);

create policy "Owners can delete their artworks"
  on public.artworks for delete using (auth.uid() = user_id);

-- Experience
create policy "Experience is viewable by everyone"
  on public.experience for select using (true);

create policy "Owners can manage experience"
  on public.experience for all using (auth.uid() = user_id);

-- Social Links
create policy "Social links are viewable by everyone"
  on public.social_links for select using (true);

create policy "Owners can manage social links"
  on public.social_links for all using (auth.uid() = user_id);

-- Services
create policy "Services are viewable by everyone"
  on public.services for select using (true);

create policy "Owners can manage services"
  on public.services for all using (auth.uid() = user_id);

-- Messages: anyone can insert; only owner can read/update
create policy "Anyone can send messages"
  on public.messages for insert with check (true);

create policy "Only owner can read messages"
  on public.messages for select using (
    exists (select 1 from public.profiles where id = auth.uid())
  );

create policy "Only owner can update messages"
  on public.messages for update using (
    exists (select 1 from public.profiles where id = auth.uid())
  );

-- Contact Information
create policy "Contact info is viewable by everyone"
  on public.contact_information for select using (true);

create policy "Owners can manage contact info"
  on public.contact_information for all using (auth.uid() = user_id);

-- Site Settings
create policy "Site settings are viewable by everyone"
  on public.site_settings for select using (true);

create policy "Owners can manage site settings"
  on public.site_settings for all using (auth.uid() = user_id);

-- Gallery Images
create policy "Gallery images are viewable by everyone"
  on public.gallery_images for select using (true);

create policy "Owners can manage gallery images"
  on public.gallery_images for all using (auth.uid() = user_id);

-- ============================================================================
-- Storage bucket for portfolio assets
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Allow public reads on storage
create policy "Public can view portfolio assets"
  on storage.objects for select using (bucket_id = 'portfolio');

-- Allow authenticated users to upload
create policy "Owners can upload portfolio assets"
  on storage.objects for insert with check (
    bucket_id = 'portfolio' and auth.role() = 'authenticated'
  );

create policy "Owners can update portfolio assets"
  on storage.objects for update using (
    bucket_id = 'portfolio' and auth.role() = 'authenticated'
  );

create policy "Owners can delete portfolio assets"
  on storage.objects for delete using (
    bucket_id = 'portfolio' and auth.role() = 'authenticated'
  );
