"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import ImagePicker from "@/components/dashboard/ImagePicker";
import { useToast } from "@/components/dashboard/ToastProvider";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SectionState {
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

const defaults: SectionState = {
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
    bio_short:
      "Ashbin Kafle is an artist based in Kathmandu, Nepal. His work explores the quiet relationship between light, memory, and terrain.",
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
    process_description:
      "In the studio, each painting begins with observation — time spent with sketches, colour studies, and notes before a single brushstroke touches the canvas. Ashbin works slowly, building layers in oil and acrylic, allowing each piece to reveal itself over weeks rather than hours.",
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
    about_text:
      "creating quiet moments inspired by nature, memory, and light.",
  },
};

// ---------------------------------------------------------------------------
// Reusable form field components (consistent with rest of admin)
// ---------------------------------------------------------------------------
function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15 resize-y"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-10 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#A8E4A0]/30 ${
          checked ? "bg-[#A8E4A0]" : "bg-border/60"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ease-in-out ${
            checked ? "translate-x-[18px]" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
        {label}
      </span>
    </label>
  );
}

function SectionCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="space-y-6 rounded-xl border border-border/70 bg-white p-8 scroll-mt-24"
    >
      <h2 className="text-sm font-heading tracking-[-0.02em] text-foreground border-b border-border/50 pb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Multi-Artwork Picker (for featured_works / latest_collection)
// ---------------------------------------------------------------------------
function MultiArtworkPicker({
  label,
  selectedIds,
  onIdsChange,
}: {
  label: string;
  selectedIds: string[];
  onIdsChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [artworks, setArtworks] = useState<
    { id: string; title: string; image_url: string; image_alt: string; year: number; medium: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    async function load() {
      setLoading(true);
      const supabase = createClient();
      let query = supabase
        .from("artworks")
        .select("id, title, image_url, image_alt, year, medium")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }
      const { data } = await query;
      setArtworks((data ?? []) as typeof artworks);
      setLoading(false);
    }
    load();
  }, [open, search]);

  function toggleId(id: string) {
    if (selectedIds.includes(id)) {
      onIdsChange(selectedIds.filter((i) => i !== id));
    } else {
      onIdsChange([...selectedIds, id]);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
        {label}
      </label>

      {/* Selected previews */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedIds.map((id) => (
            <SelectedArtworkThumbnail
              key={id}
              artworkId={id}
              onRemove={() => onIdsChange(selectedIds.filter((i) => i !== id))}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-[10px] border-2 border-dashed border-border/70 bg-white/50 px-4 py-3 text-sm text-foreground/50 hover:text-foreground hover:border-[#A8E4A0] transition-all duration-200"
      >
        {selectedIds.length > 0
          ? "Change Selected Artworks"
          : "Select Artworks"}
      </button>

      {/* Modal */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal container */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            onWheel={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-2xl max-h-[85vh] bg-white rounded-xl border border-border/70 shadow-xl flex flex-col pointer-events-auto"
              style={{ overscrollBehavior: "contain" }}
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="shrink-0 flex items-center justify-between border-b border-border/50 px-5 py-4">
                <h3 className="text-sm font-heading tracking-[-0.02em] text-foreground">
                  {label}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3l8 8M11 3l-8 8" /></svg>
                </button>
              </div>

              {/* Search */}
              <div className="shrink-0 px-5 py-3 border-b border-border/30">
                <div className="relative">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                  >
                    <circle cx="6" cy="6" r="4.5" />
                    <path d="M9.5 9.5L13 13" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search artworks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-background border border-border/70 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[2px] focus:ring-[#A8E4A0]/15"
                    autoFocus
                  />
                </div>
              </div>

              {/* Grid */}
              <div
                ref={gridRef}
                tabIndex={-1}
                className="flex-1 overflow-y-auto p-5 min-h-0 outline-none"
                style={{ overscrollBehavior: "contain" }}
                onWheel={(e) => e.stopPropagation()}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-5 w-5 rounded-full border-2 border-[#A8E4A0] border-t-transparent animate-spin" />
                  </div>
                ) : artworks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-foreground/50">
                      {search.trim()
                        ? "No artworks match your search."
                        : "No artworks found. Add artworks first."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {artworks.map((artwork) => {
                      const isSelected = selectedIds.includes(artwork.id);
                      return (
                        <button
                          key={artwork.id}
                          type="button"
                          onClick={() => toggleId(artwork.id)}
                          className={`group relative aspect-[4/5] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-[#A8E4A0] ring-2 ring-[#A8E4A0]/30"
                              : "border-border/50 hover:border-[#A8E4A0]/60"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={artwork.image_url}
                            alt={artwork.image_alt || artwork.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 pt-6">
                            <p className="text-[11px] text-white font-medium leading-tight truncate">
                              {artwork.title}
                            </p>
                            {artwork.year && (
                              <p className="text-[9px] text-white/60">
                                {artwork.year}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#A8E4A0]">
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                stroke="#222222"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M2 5l2 2 4-4" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-border/50 px-5 py-3 flex items-center justify-between">
                <p className="text-[11px] text-foreground/40">
                  {selectedIds.length} selected &middot; {artworks.length} total
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center rounded-full bg-[#A8E4A0] px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#222222] font-heading transition-all duration-300 hover:bg-[#96d88e]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SelectedArtworkThumbnail({
  artworkId,
  onRemove,
}: {
  artworkId: string;
  onRemove: () => void;
}) {
  const [artwork, setArtwork] = useState<{
    image_url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("artworks")
        .select("id, image_url, title")
        .eq("id", artworkId)
        .single();
      if (data) setArtwork(data as { image_url: string; title: string });
    }
    load();
  }, [artworkId]);

  if (!artwork) return null;

  return (
    <div className="relative inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2 py-1.5 pr-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={artwork.image_url}
        alt={artwork.title}
        className="h-8 w-8 rounded object-cover"
      />
      <span className="text-[11px] text-foreground/70 max-w-[100px] truncate">
        {artwork.title}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-foreground/40 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-200"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M2 2l6 6M8 2l-6 6" />
        </svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function HomepageSettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Full section state
  const [hero, setHero] = useState<SectionState["hero"]>(defaults.hero);
  const [featuredWorks, setFeaturedWorks] = useState<SectionState["featured_works"]>(defaults.featured_works);
  const [aboutPreview, setAboutPreview] = useState<SectionState["about_preview"]>(defaults.about_preview);
  const [landscapeBreak, setLandscapeBreak] = useState<SectionState["landscape_break"]>(defaults.landscape_break);
  const [quote, setQuote] = useState<SectionState["quote"]>(defaults.quote);
  const [process, setProcess] = useState<SectionState["process"]>(defaults.process);
  const [latestCollection, setLatestCollection] = useState<SectionState["latest_collection"]>(defaults.latest_collection);
  const [contactPreview, setContactPreview] = useState<SectionState["contact_preview"]>(defaults.contact_preview);
  const [footer, setFooter] = useState<SectionState["footer"]>(defaults.footer);

  // Load existing config
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "homepage_config")
        .single();

      if (data?.value) {
        const v = data.value as Partial<SectionState>;
        if (v.hero) setHero({ ...defaults.hero, ...v.hero });
        if (v.featured_works)
          setFeaturedWorks({ ...defaults.featured_works, ...v.featured_works });
        if (v.about_preview)
          setAboutPreview({ ...defaults.about_preview, ...v.about_preview });
        if (v.landscape_break)
          setLandscapeBreak({ ...defaults.landscape_break, ...v.landscape_break });
        if (v.quote) setQuote({ ...defaults.quote, ...v.quote });
        if (v.process) setProcess({ ...defaults.process, ...v.process });
        if (v.latest_collection)
          setLatestCollection({ ...defaults.latest_collection, ...v.latest_collection });
        if (v.contact_preview)
          setContactPreview({ ...defaults.contact_preview, ...v.contact_preview });
        if (v.footer) setFooter({ ...defaults.footer, ...v.footer });
      }
      setLoading(false);
    }
    load();
  }, []);

  // Save
  const handleSave = useCallback(async () => {
    setSaving(true);

    const config: SectionState = {
      hero,
      featured_works: featuredWorks,
      about_preview: aboutPreview,
      landscape_break: landscapeBreak,
      quote,
      process,
      latest_collection: latestCollection,
      contact_preview: contactPreview,
      footer,
    };

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("site_settings").upsert(
      {
        user_id: user?.id ?? null,
        key: "homepage_config",
        value: config as unknown as Record<string, unknown>,
      },
      { onConflict: "key,user_id" },
    );

    setSaving(false);

    if (!error) {
      toast({ title: "Homepage settings saved", variant: "success" });
    } else {
      toast({ title: "Failed to save", description: error.message, variant: "error" });
    }
  }, [
    hero,
    featuredWorks,
    aboutPreview,
    landscapeBreak,
    quote,
    process,
    latestCollection,
    contactPreview,
    footer,
  ]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border/70 bg-white p-12 text-center">
        <p className="text-sm text-foreground/50">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground">
            Homepage Settings
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Configure every section of the homepage. Images are selected from
            the Artworks library.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </div>

      {/* Section navigation */}
      <nav className="mb-8 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] font-heading">
        {[
          ["hero", "Hero"],
          ["featured", "Featured Works"],
          ["about-preview", "About"],
          ["landscape", "Landscape"],
          ["quote", "Quote"],
          ["process", "Process"],
          ["collection", "Collection"],
          ["contact", "Contact"],
          ["footer", "Footer"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#section-${id}`}
            className="rounded-full border border-border/60 px-3.5 py-1.5 text-[10px] text-foreground/60 hover:text-foreground hover:border-[#A8E4A0] transition-all duration-200"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="space-y-10 max-w-3xl">
        {/* ================================================================= */}
        {/* 1. Hero Section */}
        {/* ================================================================= */}
        <SectionCard id="section-hero" title="1. Hero Section">
          <ImagePicker
            label="Hero Background Image"
            artworkId={hero.hero_image_artwork_id}
            imageUrl={hero.hero_image_url}
            onArtworkIdChange={(id) =>
              setHero((prev) => ({ ...prev, hero_image_artwork_id: id, hero_image_url: null }))
            }
            onImageUrlChange={(url) =>
              setHero((prev) => ({ ...prev, hero_image_url: url, hero_image_artwork_id: null }))
            }
            section="hero"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Headline"
              name="hero_headline"
              value={hero.headline}
              onChange={(v) => setHero((prev) => ({ ...prev, headline: v }))}
              placeholder="Artist"
            />
            <Field
              label="Subheadline"
              name="hero_subheadline"
              value={hero.subheadline}
              onChange={(v) => setHero((prev) => ({ ...prev, subheadline: v }))}
              placeholder="Visual Storyteller"
            />
            <Field
              label="Tagline"
              name="hero_tagline"
              value={hero.tagline}
              onChange={(v) => setHero((prev) => ({ ...prev, tagline: v }))}
              placeholder="Nature Observer"
            />
            <Field
              label="Button Label — Explore Portfolio"
              name="hero_explore_text"
              value={hero.explore_portfolio_button_text}
              onChange={(v) =>
                setHero((prev) => ({
                  ...prev,
                  explore_portfolio_button_text: v,
                }))
              }
            />
            <Field
              label="Button Link — Explore Portfolio"
              name="hero_explore_link"
              value={hero.explore_portfolio_button_link}
              onChange={(v) =>
                setHero((prev) => ({
                  ...prev,
                  explore_portfolio_button_link: v,
                }))
              }
            />
            <Field
              label="Button Label — About"
              name="hero_about_text"
              value={hero.about_button_text}
              onChange={(v) =>
                setHero((prev) => ({ ...prev, about_button_text: v }))
              }
            />
            <Field
              label="Button Link — About"
              name="hero_about_link"
              value={hero.about_button_link}
              onChange={(v) =>
                setHero((prev) => ({ ...prev, about_button_link: v }))
              }
            />
          </div>
          <TextArea
            label="Hero Tagline (body text)"
            name="hero_body"
            value={hero.hero_tagline}
            onChange={(v) => setHero((prev) => ({ ...prev, hero_tagline: v }))}
            rows={2}
            placeholder="Painting quiet moments inspired by nature, memory, and light."
          />
        </SectionCard>

        {/* ================================================================= */}
        {/* 2. Featured Works */}
        {/* ================================================================= */}
        <SectionCard id="section-featured" title="2. Featured Works Section">
          <Toggle
            label="Show Section"
            checked={featuredWorks.visible}
            onChange={(v) =>
              setFeaturedWorks((prev) => ({ ...prev, visible: v }))
            }
          />
          <Field
            label="Subtitle"
            name="featured_subtitle"
            value={featuredWorks.subtitle}
            onChange={(v) =>
              setFeaturedWorks((prev) => ({ ...prev, subtitle: v }))
            }
            placeholder="Selected Works"
          />
          <Field
            label="Title"
            name="featured_title"
            value={featuredWorks.title}
            onChange={(v) =>
              setFeaturedWorks((prev) => ({ ...prev, title: v }))
            }
            placeholder="Featured Paintings"
          />
          <MultiArtworkPicker
            label="Select Artworks to Feature"
            selectedIds={featuredWorks.artwork_ids}
            onIdsChange={(ids) =>
              setFeaturedWorks((prev) => ({ ...prev, artwork_ids: ids }))
            }
          />
          <Field
            label="View All Button Text"
            name="featured_view_text"
            value={featuredWorks.view_all_button_text}
            onChange={(v) =>
              setFeaturedWorks((prev) => ({ ...prev, view_all_button_text: v }))
            }
            placeholder="View Full Portfolio"
          />
          <Field
            label="View All Button Link"
            name="featured_view_link"
            value={featuredWorks.view_all_button_link}
            onChange={(v) =>
              setFeaturedWorks((prev) => ({ ...prev, view_all_button_link: v }))
            }
            placeholder="/portfolio"
          />
        </SectionCard>

        {/* ================================================================= */}
        {/* 3. About Preview */}
        {/* ================================================================= */}
        <SectionCard id="section-about-preview" title="3. About Preview Section">
          <ImagePicker
            label="About Image"
            artworkId={aboutPreview.about_image_artwork_id}
            imageUrl={aboutPreview.about_image_url}
            onArtworkIdChange={(id) =>
              setAboutPreview((prev) => ({ ...prev, about_image_artwork_id: id, about_image_url: null }))
            }
            onImageUrlChange={(url) =>
              setAboutPreview((prev) => ({ ...prev, about_image_url: url, about_image_artwork_id: null }))
            }
            section="about-preview"
          />
          <Field
            label="Subtitle"
            name="about_subtitle"
            value={aboutPreview.subtitle}
            onChange={(v) =>
              setAboutPreview((prev) => ({ ...prev, subtitle: v }))
            }
            placeholder="About the Artist"
          />
          <Field
            label="Title"
            name="about_title"
            value={aboutPreview.title}
            onChange={(v) =>
              setAboutPreview((prev) => ({ ...prev, title: v }))
            }
            placeholder="About"
          />
          <TextArea
            label="Bio (short — shown on homepage)"
            name="about_bio_short"
            value={aboutPreview.bio_short}
            onChange={(v) =>
              setAboutPreview((prev) => ({ ...prev, bio_short: v }))
            }
            rows={3}
            placeholder="A brief description..."
          />
          <TextArea
            label="Bio (long — shown if no short bio)"
            name="about_bio_long"
            value={aboutPreview.bio_long}
            onChange={(v) =>
              setAboutPreview((prev) => ({ ...prev, bio_long: v }))
            }
            rows={5}
            placeholder="Full bio (paragraphs separated by blank line)"
          />
          <Field
            label="Button Text"
            name="about_button_text"
            value={aboutPreview.button_text}
            onChange={(v) =>
              setAboutPreview((prev) => ({ ...prev, button_text: v }))
            }
            placeholder="Read More"
          />
          <Field
            label="Button Link"
            name="about_button_link"
            value={aboutPreview.button_link}
            onChange={(v) =>
              setAboutPreview((prev) => ({ ...prev, button_link: v }))
            }
            placeholder="/about"
          />
        </SectionCard>

        {/* ================================================================= */}
        {/* 4. Landscape Break */}
        {/* ================================================================= */}
        <SectionCard id="section-landscape" title="4. Landscape Break Image">
          <ImagePicker
            label="Landscape Image"
            artworkId={landscapeBreak.image_artwork_id}
            imageUrl={landscapeBreak.image_url}
            onArtworkIdChange={(id) =>
              setLandscapeBreak((prev) => ({ ...prev, image_artwork_id: id, image_url: null }))
            }
            onImageUrlChange={(url) =>
              setLandscapeBreak((prev) => ({ ...prev, image_url: url, image_artwork_id: null }))
            }
            section="landscape-break"
          />
        </SectionCard>

        {/* ================================================================= */}
        {/* 5. Quote Section */}
        {/* ================================================================= */}
        <SectionCard id="section-quote" title="5. Quote Section">
          <Toggle
            label="Show Quote"
            checked={quote.visible}
            onChange={(v) => setQuote((prev) => ({ ...prev, visible: v }))}
          />
          <TextArea
            label="Quote Text"
            name="quote_text"
            value={quote.text}
            onChange={(v) => setQuote((prev) => ({ ...prev, text: v }))}
            rows={3}
            placeholder="I don't paint landscapes as they appear..."
          />
          <Field
            label="Attribution"
            name="quote_attribution"
            value={quote.attribution}
            onChange={(v) =>
              setQuote((prev) => ({ ...prev, attribution: v }))
            }
            placeholder="Ashbin Kafle"
          />
        </SectionCard>

        {/* ================================================================= */}
        {/* 6. Process Section */}
        {/* ================================================================= */}
        <SectionCard id="section-process" title="6. Process Section">
          <ImagePicker
            label="Process Image"
            artworkId={process.image_artwork_id}
            imageUrl={process.image_url}
            onArtworkIdChange={(id) =>
              setProcess((prev) => ({ ...prev, image_artwork_id: id, image_url: null }))
            }
            onImageUrlChange={(url) =>
              setProcess((prev) => ({ ...prev, image_url: url, image_artwork_id: null }))
            }
            section="process"
          />
          <Field
            label="Subtitle"
            name="process_subtitle"
            value={process.subtitle}
            onChange={(v) => setProcess((prev) => ({ ...prev, subtitle: v }))}
            placeholder="Studio Practice"
          />
          <Field
            label="Title"
            name="process_title"
            value={process.title}
            onChange={(v) => setProcess((prev) => ({ ...prev, title: v }))}
            placeholder="The Process"
          />
          <TextArea
            label="Process Description"
            name="process_description"
            value={process.process_description}
            onChange={(v) =>
              setProcess((prev) => ({ ...prev, process_description: v }))
            }
            rows={6}
            placeholder="Describe the creative process..."
          />
          <Field
            label="Button Text"
            name="process_button_text"
            value={process.button_text}
            onChange={(v) =>
              setProcess((prev) => ({ ...prev, button_text: v }))
            }
            placeholder="Learn More"
          />
          <Field
            label="Button Link"
            name="process_button_link"
            value={process.button_link}
            onChange={(v) =>
              setProcess((prev) => ({ ...prev, button_link: v }))
            }
            placeholder="/about"
          />
        </SectionCard>

        {/* ================================================================= */}
        {/* 7. Latest Collection */}
        {/* ================================================================= */}
        <SectionCard id="section-collection" title="7. Latest Collection Section">
          <Toggle
            label="Show Section"
            checked={latestCollection.visible}
            onChange={(v) =>
              setLatestCollection((prev) => ({ ...prev, visible: v }))
            }
          />
          <Field
            label="Subtitle"
            name="collection_subtitle"
            value={latestCollection.subtitle}
            onChange={(v) =>
              setLatestCollection((prev) => ({ ...prev, subtitle: v }))
            }
            placeholder="Collection"
          />
          <Field
            label="Title"
            name="collection_title"
            value={latestCollection.title}
            onChange={(v) =>
              setLatestCollection((prev) => ({ ...prev, title: v }))
            }
            placeholder="Latest Works"
          />
          <MultiArtworkPicker
            label="Select Artworks for Collection"
            selectedIds={latestCollection.artwork_ids}
            onIdsChange={(ids) =>
              setLatestCollection((prev) => ({ ...prev, artwork_ids: ids }))
            }
          />
          <Field
            label="View All Button Text"
            name="collection_view_text"
            value={latestCollection.view_all_button_text}
            onChange={(v) =>
              setLatestCollection((prev) => ({
                ...prev,
                view_all_button_text: v,
              }))
            }
            placeholder="View Collection"
          />
          <Field
            label="View All Button Link"
            name="collection_view_link"
            value={latestCollection.view_all_button_link}
            onChange={(v) =>
              setLatestCollection((prev) => ({
                ...prev,
                view_all_button_link: v,
              }))
            }
            placeholder="/portfolio"
          />
        </SectionCard>

        {/* ================================================================= */}
        {/* 8. Contact Preview */}
        {/* ================================================================= */}
        <SectionCard id="section-contact" title="8. Contact Preview Section">
          <Toggle
            label="Show Section"
            checked={contactPreview.visible}
            onChange={(v) =>
              setContactPreview((prev) => ({ ...prev, visible: v }))
            }
          />
          <ImagePicker
            label="Contact Image"
            artworkId={contactPreview.image_artwork_id}
            imageUrl={contactPreview.image_url}
            onArtworkIdChange={(id) =>
              setContactPreview((prev) => ({ ...prev, image_artwork_id: id, image_url: null }))
            }
            onImageUrlChange={(url) =>
              setContactPreview((prev) => ({ ...prev, image_url: url, image_artwork_id: null }))
            }
            section="contact-preview"
          />
          <Field
            label="Subtitle"
            name="contact_subtitle"
            value={contactPreview.subtitle}
            onChange={(v) =>
              setContactPreview((prev) => ({ ...prev, subtitle: v }))
            }
            placeholder="Get in Touch"
          />
          <TextArea
            label="Title"
            name="contact_title"
            value={contactPreview.title}
            onChange={(v) =>
              setContactPreview((prev) => ({ ...prev, title: v }))
            }
            rows={2}
            placeholder="Let's Create\nSomething Together"
          />
          <TextArea
            label="Body Text"
            name="contact_text"
            value={contactPreview.text}
            onChange={(v) =>
              setContactPreview((prev) => ({ ...prev, text: v }))
            }
            rows={3}
            placeholder="Available for commissions..."
          />
          <Field
            label="Available For (comma-separated)"
            name="contact_available_for"
            value={contactPreview.available_for}
            onChange={(v) =>
              setContactPreview((prev) => ({ ...prev, available_for: v }))
            }
            placeholder="Commissions, Exhibitions, Collaborations"
          />
          <Field
            label="Button Text"
            name="contact_button_text"
            value={contactPreview.button_text}
            onChange={(v) =>
              setContactPreview((prev) => ({ ...prev, button_text: v }))
            }
            placeholder="Get in Touch"
          />
          <Field
            label="Button Link"
            name="contact_button_link"
            value={contactPreview.button_link}
            onChange={(v) =>
              setContactPreview((prev) => ({ ...prev, button_link: v }))
            }
            placeholder="/contact"
          />
        </SectionCard>

        {/* ================================================================= */}
        {/* 9. Footer */}
        {/* ================================================================= */}
        <SectionCard id="section-footer" title="9. Footer Section">
          <Field
            label="About Text (shown in footer)"
            name="footer_about_text"
            value={footer.about_text}
            onChange={(v) => setFooter((prev) => ({ ...prev, about_text: v }))}
            placeholder="creating quiet moments inspired by nature, memory, and light."
          />
        </SectionCard>

        {/* Bottom save */}
        <div className="flex items-center justify-between pb-10">
          <p className="text-xs text-foreground/40">
            All images are referenced from the Artworks library.
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
