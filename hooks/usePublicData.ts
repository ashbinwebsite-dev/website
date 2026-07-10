"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  ProfileRow,
  ArtworkRow,
  ExperienceRow,
  SocialLinkRow,
  ServiceRow,
  ContactInfoRow,
  GalleryImageRow,
} from "@/types/database/database";

// Use a fixed user query param so all data fetches target the same user.
// In a multi-user setup this would come from the current route/session.
// For a single-artist portfolio we fetch the first profile we find.
async function getFirstUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .limit(1)
    .single();
  return data?.id ?? null;
}

// ============================================================================
// Profile
// ============================================================================
export function useProfile(enabled = true) {
  return useQuery({
    queryKey: ["public", "profile"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .single();
      return (data ?? null) as ProfileRow | null;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// ============================================================================
// Published Artworks
// ============================================================================
export function useArtworks(enabled = true) {
  return useQuery({
    queryKey: ["public", "artworks"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("artworks")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      return (data ?? []) as ArtworkRow[];
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export function useFeaturedArtworks(enabled = true) {
  return useQuery({
    queryKey: ["public", "artworks", "featured"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("artworks")
        .select("*")
        .eq("featured", true)
        .eq("published", true)
        .order("sort_order", { ascending: true });
      return (data ?? []) as ArtworkRow[];
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// ============================================================================
// Experience
// ============================================================================
export function useExperience(enabled = true) {
  return useQuery({
    queryKey: ["public", "experience"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("experience")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("year", { ascending: false });
      return (data ?? []) as ExperienceRow[];
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// ============================================================================
// Social Links
// ============================================================================
export function useSocialLinks(enabled = true) {
  return useQuery({
    queryKey: ["public", "social_links"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("social_links")
        .select("*")
        .order("sort_order", { ascending: true });
      return (data ?? []) as SocialLinkRow[];
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// ============================================================================
// Services (available-for items)
// ============================================================================
export function useServices(enabled = true) {
  return useQuery({
    queryKey: ["public", "services"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      return (data ?? []) as ServiceRow[];
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// ============================================================================
// Contact Information
// ============================================================================
export function useContactInformation(enabled = true) {
  return useQuery({
    queryKey: ["public", "contact_information"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("contact_information")
        .select("*")
        .order("sort_order", { ascending: true });
      return (data ?? []) as ContactInfoRow[];
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// ============================================================================
// Gallery Images
// ============================================================================
export function useGalleryImages(
  section: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["public", "gallery_images", section],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("section", section)
        .order("sort_order", { ascending: true });
      return (data ?? []) as GalleryImageRow[];
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// ============================================================================
// Site Settings
// ============================================================================
export function useSiteSetting(key: string, enabled = true) {
  return useQuery({
    queryKey: ["public", "site_settings", key],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .single();

      if (error || !data) return null;
      return (data as { value: Record<string, unknown> }).value;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// ============================================================================
// Artwork by ID (for homepage image references)
// ============================================================================
export function useArtworkById(id: string | null) {
  return useQuery({
    queryKey: ["public", "artwork", id],
    queryFn: async () => {
      if (!id) return null;
      const supabase = createClient();
      const { data } = await supabase
        .from("artworks")
        .select("*")
        .eq("id", id)
        .single();
      return (data ?? null) as ArtworkRow | null;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

// ============================================================================
// Homepage Configuration (single JSONB blob in site_settings)
// ============================================================================

export interface HomepageConfig {
  hero: {
    hero_image_artwork_id: string | null;
    hero_image_url: string | null;
    headline: string;
    subheadline: string;
    tagline: string;
    hero_tagline: string;
    explore_portfolio_button_text: string;
    explore_portfolio_button_link: string;
    about_button_text: string;
    about_button_link: string;
  };
  featured_works: {
    visible: boolean;
    subtitle: string;
    title: string;
    artwork_ids: string[];
    view_all_button_text: string;
    view_all_button_link: string;
  };
  about_preview: {
    about_image_artwork_id: string | null;
    about_image_url: string | null;
    subtitle: string;
    title: string;
    bio_short: string;
    bio_long: string;
    button_text: string;
    button_link: string;
  };
  landscape_break: {
    image_artwork_id: string | null;
    image_url: string | null;
  };
  quote: {
    visible: boolean;
    text: string;
    attribution: string;
  };
  process: {
    image_artwork_id: string | null;
    image_url: string | null;
    subtitle: string;
    title: string;
    process_description: string;
    button_text: string;
    button_link: string;
  };
  latest_collection: {
    visible: boolean;
    subtitle: string;
    title: string;
    artwork_ids: string[];
    view_all_button_text: string;
    view_all_button_link: string;
  };
  contact_preview: {
    visible: boolean;
    image_artwork_id: string | null;
    image_url: string | null;
    subtitle: string;
    title: string;
    text: string;
    available_for: string;
    button_text: string;
    button_link: string;
  };
  footer: {
    about_text: string;
  };
}

const defaultHomepageConfig: HomepageConfig = {
  hero: {
    hero_image_artwork_id: null,
    hero_image_url: null,
    headline: "Artist",
    subheadline: "Visual Storyteller",
    tagline: "Nature Observer",
    hero_tagline: "Painting quiet moments inspired by nature, memory, and light.",
    explore_portfolio_button_text: "Explore Portfolio",
    explore_portfolio_button_link: "/portfolio",
    about_button_text: "About the Artist",
    about_button_link: "/about",
  },
  featured_works: {
    visible: true,
    subtitle: "Selected Works",
    title: "Featured Paintings",
    artwork_ids: [],
    view_all_button_text: "View Full Portfolio",
    view_all_button_link: "/portfolio",
  },
  about_preview: {
    about_image_artwork_id: null,
    about_image_url: null,
    subtitle: "About the Artist",
    title: "About",
    bio_short: "Ashbin Kafle is an artist based in Kathmandu, Nepal. His work explores the quiet relationship between light, memory, and terrain.",
    bio_long: "",
    button_text: "Read More",
    button_link: "/about",
  },
  landscape_break: {
    image_artwork_id: null,
    image_url: null,
  },
  quote: {
    visible: true,
    text: "I don't paint landscapes as they appear. I paint how they are remembered.",
    attribution: "Ashbin Kafle",
  },
  process: {
    image_artwork_id: null,
    image_url: null,
    subtitle: "Studio Practice",
    title: "The Process",
    process_description: "In the studio, each painting begins with observation...",
    button_text: "Learn More",
    button_link: "/about",
  },
  latest_collection: {
    visible: true,
    subtitle: "Collection",
    title: "Latest Works",
    artwork_ids: [],
    view_all_button_text: "View Collection",
    view_all_button_link: "/portfolio",
  },
  contact_preview: {
    visible: true,
    image_artwork_id: null,
    image_url: null,
    subtitle: "Get in Touch",
    title: "Let's Create\nSomething Together",
    text: "Available for commissions, exhibitions, collaborations, and landscape projects. Currently accepting new enquiries and would welcome a conversation about your project.",
    available_for: "Commissions, Exhibitions, Collaborations, Landscape Projects",
    button_text: "Get in Touch",
    button_link: "/contact",
  },
  footer: {
    about_text: "creating quiet moments inspired by nature, memory, and light.",
  },
};

export function useHomepageConfig() {
  const { data: raw, isLoading } = useSiteSetting("homepage_config");

  const config = raw as Partial<HomepageConfig> | null;

  // Deep merge with defaults so missing keys fall back gracefully
  const merged: HomepageConfig = config
    ? {
        hero: { ...defaultHomepageConfig.hero, ...config.hero },
        featured_works: {
          ...defaultHomepageConfig.featured_works,
          ...config.featured_works,
          artwork_ids: config.featured_works?.artwork_ids ?? defaultHomepageConfig.featured_works.artwork_ids,
        },
        about_preview: { ...defaultHomepageConfig.about_preview, ...config.about_preview },
        landscape_break: { ...defaultHomepageConfig.landscape_break, ...config.landscape_break },
        quote: { ...defaultHomepageConfig.quote, ...config.quote },
        process: { ...defaultHomepageConfig.process, ...config.process },
        latest_collection: {
          ...defaultHomepageConfig.latest_collection,
          ...config.latest_collection,
          artwork_ids: config.latest_collection?.artwork_ids ?? defaultHomepageConfig.latest_collection.artwork_ids,
        },
        contact_preview: { ...defaultHomepageConfig.contact_preview, ...config.contact_preview },
        footer: { ...defaultHomepageConfig.footer, ...config.footer },
      }
    : defaultHomepageConfig;

  return { data: merged, isLoading };
}

// ============================================================================
// About Page Configuration (single JSONB blob in site_settings)
// ============================================================================

export interface AboutConfig {
  hero_full_name: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_tagline: string;
  hero_tagline_body: string;
  about_image_artwork_id: string | null;
  about_image_url: string | null;
  introduction_heading: string;
  introduction_paragraphs: string;
  story1_image_artwork_id: string | null;
  story1_image_url: string | null;
  story1_label: string;
  story1_title: string;
  story1_paragraphs: string;
  story2_image_artwork_id: string | null;
  story2_image_url: string | null;
  story2_label: string;
  story2_title: string;
  story2_paragraphs: string;
  story3_image_artwork_id: string | null;
  story3_image_url: string | null;
  story3_label: string;
  story3_title: string;
  story3_paragraphs: string;
  quote_text: string;
  quote_attribution: string;
  cta_available_for: string;
  cta_button_text: string;
  cta_button_link: string;
}

const defaultAboutConfig: AboutConfig = {
  hero_full_name: "Ashbin Kafle",
  hero_headline: "Artist",
  hero_subheadline: "Visual Storyteller",
  hero_tagline: "Nature Observer",
  hero_tagline_body: "Painting quiet moments inspired by nature, memory, and light.",
  about_image_artwork_id: null,
  about_image_url: null,
  introduction_heading: "Living Through Landscapes",
  introduction_paragraphs: "For Ashbin Kafle, landscape painting has never been about documentation. It is a quiet practice of attention — of standing still long enough to feel the atmosphere of a place and translating that feeling into colour, edge, and texture.\n\nGrowing up surrounded by the hills and open skies of Nepal shaped a visual language rooted in observation.",
  story1_image_artwork_id: null,
  story1_image_url: null,
  story1_label: "The Journey",
  story1_title: "The Journey",
  story1_paragraphs: "Ashbin's connection with nature began in the hills. Long walks, changing seasons, and the way light transforms a familiar view into something new — these early observations became the foundation of his creative practice.\n\nTravel deepened his vocabulary. From the Himalayan foothills to coastal shorelines, each landscape offered a different texture, a different quality of light.",
  story2_image_artwork_id: null,
  story2_image_url: null,
  story2_label: "The Process",
  story2_title: "The Process",
  story2_paragraphs: "In the studio, the process is deliberate and unhurried. Ashbin works primarily in oil and acrylic on canvas or linen, building layers slowly. Each piece begins with observation — sketches, notes, and colour studies — before the first brushstroke touches the canvas.\n\nTexture is essential. He works with varied brushwork and palette knife techniques, creating surfaces that reward close looking.",
  story3_image_artwork_id: null,
  story3_image_url: null,
  story3_label: "The Philosophy",
  story3_title: "The Philosophy",
  story3_paragraphs: "Ashbin believes the most powerful landscapes are the quietest ones. In an image-saturated world, stillness becomes a radical choice. His work invites the viewer to slow down, to look longer, to feel rather than just see.\n\nLight is the true subject. Not light as illumination, but light as atmosphere — the way it softens edges, mutes colour, and transforms a scene.",
  quote_text: "I don't paint places exactly as they are. I paint the feeling of standing there.",
  quote_attribution: "Ashbin Kafle",
  cta_available_for: "Commissions, Exhibitions, Collaborations, Landscape Projects",
  cta_button_text: "Get in Touch",
  cta_button_link: "/contact",
};

export function useAboutConfig() {
  const { data: raw, isLoading } = useSiteSetting("about_config");
  const config = raw as Partial<AboutConfig> | null;
  const merged: AboutConfig = config
    ? { ...defaultAboutConfig, ...config }
    : defaultAboutConfig;
  return { data: merged, isLoading };
}

// ============================================================================
// Contact Page Configuration (single JSONB blob in site_settings)
// ============================================================================

export interface ContactConfig {
  image_artwork_id: string | null;
  image_url: string | null;
  subtitle: string;
  title: string;
  body_text: string;
  available_for: string;
}

const defaultContactConfig: ContactConfig = {
  image_artwork_id: null,
  image_url: null,
  subtitle: "Contact",
  title: "Get in Touch",
  body_text: "Available for commissions, exhibitions, collaborations, workshops, and landscape projects. I enjoy working with individuals, galleries, brands, and creative studios who value thoughtful visual storytelling.",
  available_for: "Commissions, Exhibitions, Collaborations, Landscape Projects",
};

export function useContactConfig() {
  const { data: raw, isLoading } = useSiteSetting("contact_config");
  const config = raw as Partial<ContactConfig> | null;
  const merged: ContactConfig = config
    ? { ...defaultContactConfig, ...config }
    : defaultContactConfig;
  return { data: merged, isLoading };
}

// ============================================================================
// All Public Data (for pages that need multiple data sources)
// ============================================================================
export function useAllPublicData() {
  const profile = useProfile();
  const artworks = useArtworks();
  const featuredArtworks = useFeaturedArtworks();
  const experience = useExperience();
  const socialLinks = useSocialLinks();
  const services = useServices();
  const contactInfo = useContactInformation();
  const homeQuote = useSiteSetting("home_quote");
  const aboutQuote = useSiteSetting("about_quote");
  const siteMetadata = useSiteSetting("site_metadata");
  const availableFor = useSiteSetting("available_for");

  const isLoading =
    profile.isLoading ||
    artworks.isLoading ||
    featuredArtworks.isLoading ||
    experience.isLoading ||
    socialLinks.isLoading ||
    services.isLoading ||
    contactInfo.isLoading;

  return {
    profile: profile.data,
    artworks: artworks.data ?? [],
    featuredArtworks: featuredArtworks.data ?? [],
    experience: experience.data ?? [],
    socialLinks: socialLinks.data ?? [],
    services: services.data ?? [],
    contactInfo: contactInfo.data ?? [],
    homeQuote: homeQuote.data as { text?: string; attribution?: string } | null,
    aboutQuote: aboutQuote.data as { text?: string; attribution?: string } | null,
    siteMetadata: siteMetadata.data as { title?: string; description?: string } | null,
    availableFor: availableFor.data as { items?: string } | null,
    isLoading,
  };
}
