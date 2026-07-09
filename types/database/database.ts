// ============================================================================
// Database TypeScript Types
// ============================================================================
// These types mirror the Supabase PostgreSQL schema.
// In production, generate from: supabase gen types typescript --linked
// ============================================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      artworks: {
        Row: ArtworkRow;
        Insert: ArtworkInsert;
        Update: ArtworkUpdate;
        Relationships: [];
      };
      experience: {
        Row: ExperienceRow;
        Insert: ExperienceInsert;
        Update: ExperienceUpdate;
        Relationships: [];
      };
      social_links: {
        Row: SocialLinkRow;
        Insert: SocialLinkInsert;
        Update: SocialLinkUpdate;
        Relationships: [];
      };
      services: {
        Row: ServiceRow;
        Insert: ServiceInsert;
        Update: ServiceUpdate;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: MessageInsert;
        Update: MessageUpdate;
        Relationships: [];
      };
      contact_information: {
        Row: ContactInfoRow;
        Insert: ContactInfoInsert;
        Update: ContactInfoUpdate;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: SiteSettingInsert;
        Update: SiteSettingUpdate;
        Relationships: [];
      };
      gallery_images: {
        Row: GalleryImageRow;
        Insert: GalleryImageInsert;
        Update: GalleryImageUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// ============================================================================
// Row Types (SELECT)
// ============================================================================

export interface ProfileRow {
  id: string;
  full_name: string;
  headline: string;
  subheadline: string;
  tagline: string;
  hero_tagline: string;
  bio_short: string;
  bio_long: string;
  about_intro_heading: string;
  about_intro: string;
  process_description: string;
  hero_image_url: string | null;
  avatar_url: string | null;
  about_image_url: string | null;
  contact_email: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface ArtworkRow {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  description: string | null;
  availability: string;
  image_url: string;
  image_alt: string;
  image_width: number | null;
  image_height: number | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExperienceRow {
  id: string;
  user_id: string;
  year: string;
  label: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLinkRow {
  id: string;
  user_id: string;
  platform: string;
  label: string;
  url: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceRow {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  budget: string | null;
  project_timeline: string | null;
  read: boolean;
  created_at: string;
}

export interface ContactInfoRow {
  id: string;
  user_id: string;
  type: string;
  label: string;
  value: string;
  href: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingRow {
  id: string;
  user_id: string | null;
  key: string;
  value: Json;
  created_at: string;
  updated_at: string;
}

export interface GalleryImageRow {
  id: string;
  user_id: string;
  section: string;
  image_url: string;
  image_alt: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Insert Types (INSERT)
// ============================================================================

export interface ProfileInsert {
  id: string;
  full_name?: string;
  headline?: string;
  subheadline?: string;
  tagline?: string;
  hero_tagline?: string;
  bio_short?: string;
  bio_long?: string;
  about_intro_heading?: string;
  about_intro?: string;
  process_description?: string;
  hero_image_url?: string | null;
  avatar_url?: string | null;
  about_image_url?: string | null;
  contact_email?: string;
  location?: string;
}

export interface ArtworkInsert {
  user_id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  description?: string | null;
  availability?: string;
  image_url: string;
  image_alt?: string;
  image_width?: number | null;
  image_height?: number | null;
  featured?: boolean;
  published?: boolean;
  sort_order?: number;
}

export interface ExperienceInsert {
  user_id: string;
  year: string;
  label: string;
  description?: string | null;
  sort_order?: number;
}

export interface SocialLinkInsert {
  user_id: string;
  platform: string;
  label: string;
  url: string;
  icon?: string | null;
  sort_order?: number;
}

export interface ServiceInsert {
  user_id: string;
  name: string;
  sort_order?: number;
}

export interface MessageInsert {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  budget?: string | null;
  project_timeline?: string | null;
}

export interface ContactInfoInsert {
  user_id: string;
  type: string;
  label: string;
  value: string;
  href?: string | null;
  sort_order?: number;
}

export interface SiteSettingInsert {
  user_id?: string | null;
  key: string;
  value?: Json;
}

export interface GalleryImageInsert {
  user_id: string;
  section: string;
  image_url: string;
  image_alt?: string;
  sort_order?: number;
}

// ============================================================================
// Update Types (UPDATE)
// ============================================================================

export interface ProfileUpdate {
  full_name?: string;
  headline?: string;
  subheadline?: string;
  tagline?: string;
  hero_tagline?: string;
  bio_short?: string;
  bio_long?: string;
  about_intro_heading?: string;
  about_intro?: string;
  process_description?: string;
  hero_image_url?: string | null;
  avatar_url?: string | null;
  about_image_url?: string | null;
  contact_email?: string;
  location?: string;
}

export interface ArtworkUpdate {
  slug?: string;
  title?: string;
  year?: number;
  medium?: string;
  description?: string | null;
  availability?: string;
  image_url?: string;
  image_alt?: string;
  image_width?: number | null;
  image_height?: number | null;
  featured?: boolean;
  published?: boolean;
  sort_order?: number;
}

export interface ExperienceUpdate {
  year?: string;
  label?: string;
  description?: string | null;
  sort_order?: number;
}

export interface SocialLinkUpdate {
  platform?: string;
  label?: string;
  url?: string;
  icon?: string | null;
  sort_order?: number;
}

export interface ServiceUpdate {
  name?: string;
  sort_order?: number;
}

export interface MessageUpdate {
  name?: string;
  email?: string;
  phone?: string | null;
  subject?: string;
  message?: string;
  budget?: string | null;
  project_timeline?: string | null;
  read?: boolean;
}

export interface ContactInfoUpdate {
  type?: string;
  label?: string;
  value?: string;
  href?: string | null;
  sort_order?: number;
}

export interface SiteSettingUpdate {
  user_id?: string | null;
  key?: string;
  value?: Json;
}

export interface GalleryImageUpdate {
  section?: string;
  image_url?: string;
  image_alt?: string;
  sort_order?: number;
}
