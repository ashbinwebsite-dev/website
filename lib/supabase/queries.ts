import { createClient } from "@/lib/supabase/client";
import type {
  ArtworkRow,
  ExperienceRow,
  SocialLinkRow,
  ServiceRow,
  MessageRow,
  ContactInfoRow,
  GalleryImageRow,
  ProfileRow,
} from "@/types/database/database";

// ============================================================================
// Artworks
// ============================================================================
export async function getArtworks(userId?: string): Promise<ArtworkRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("artworks")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ArtworkRow[];
}

export async function getPublishedArtworks(userId?: string): Promise<ArtworkRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("artworks")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ArtworkRow[];
}

export async function getFeaturedArtworks(userId?: string): Promise<ArtworkRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("artworks")
    .select("*")
    .eq("featured", true)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ArtworkRow[];
}

export async function getArtworkBySlug(slug: string): Promise<ArtworkRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as ArtworkRow;
}

export async function createArtwork(
  artwork: Record<string, unknown>,
): Promise<ArtworkRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("artworks")
    .insert(artwork)
    .select()
    .single();

  if (error) throw error;
  return data as ArtworkRow;
}

export async function updateArtwork(
  id: string,
  artwork: Record<string, unknown>,
): Promise<ArtworkRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("artworks")
    .update(artwork)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ArtworkRow;
}

export async function deleteArtwork(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("artworks").delete().eq("id", id);
  if (error) throw error;
}

// ============================================================================
// Experience
// ============================================================================
export async function getExperience(userId?: string): Promise<ExperienceRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("year", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ExperienceRow[];
}

// ============================================================================
// Social Links
// ============================================================================
export async function getSocialLinks(userId?: string): Promise<SocialLinkRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("social_links")
    .select("*")
    .order("sort_order", { ascending: true });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as SocialLinkRow[];
}

// ============================================================================
// Services
// ============================================================================
export async function getServices(userId?: string): Promise<ServiceRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ServiceRow[];
}

// ============================================================================
// Messages
// ============================================================================
export async function submitMessage(
  message: Record<string, unknown>,
): Promise<MessageRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data as MessageRow;
}

// ============================================================================
// Contact Information
// ============================================================================
export async function getContactInformation(userId?: string): Promise<ContactInfoRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("contact_information")
    .select("*")
    .order("sort_order", { ascending: true });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ContactInfoRow[];
}

// ============================================================================
// Site Settings
// ============================================================================
export async function getSiteSettings(key: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error) return null;
  return (data as { value: Record<string, unknown> }).value;
}

// ============================================================================
// Gallery Images
// ============================================================================
export async function getGalleryImages(section: string, userId?: string): Promise<GalleryImageRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("gallery_images")
    .select("*")
    .eq("section", section)
    .order("sort_order", { ascending: true });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as GalleryImageRow[];
}

// ============================================================================
// Profile
// ============================================================================
export async function getProfile(userId: string): Promise<ProfileRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as ProfileRow;
}

export async function updateProfile(
  userId: string,
  profile: Record<string, unknown>,
): Promise<ProfileRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as ProfileRow;
}
