"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import ImagePicker from "@/components/dashboard/ImagePicker";
import { useToast } from "@/components/dashboard/ToastProvider";
import type { AboutConfig } from "@/hooks/usePublicData";

const defaults: AboutConfig = {
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

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15" />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15 resize-y" />
    </div>
  );
}

function SectionCard({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="space-y-6 rounded-xl border border-border/70 bg-white p-8 scroll-mt-24">
      <h2 className="text-sm font-heading tracking-[-0.02em] text-foreground border-b border-border/50 pb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function AboutSettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<AboutConfig>(defaults);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("value").eq("key", "about_config").single();
      if (data?.value) {
        const v = data.value as Partial<AboutConfig>;
        setConfig((prev) => ({ ...prev, ...v }));
      }
      setLoading(false);
    }
    load();
  }, []);

  const update = useCallback(<K extends keyof AboutConfig>(key: K, value: AboutConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("site_settings").upsert(
      { user_id: user?.id ?? null, key: "about_config", value: config as unknown as Record<string, unknown> },
      { onConflict: "key,user_id" },
    );
    setSaving(false);
    toast({ title: "About page settings saved", variant: "success" });
  }, [config, toast]);

  if (loading) {
    return <div className="rounded-xl border border-border/70 bg-white p-12 text-center"><p className="text-sm text-foreground/50">Loading...</p></div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground">About Page Settings</h1>
          <p className="mt-1 text-sm text-foreground/60">Configure every section of the about page. Images are selected from the Artworks library.</p>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleSave} disabled={saving}
            className="inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] disabled:opacity-50">{saving ? "Saving..." : "Save All Settings"}</button>
        </div>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] font-heading">
        {[["hero","Hero"],["about-image","About Image"],["intro","Introduction"],["story1","Story: Journey"],["story2","Story: Process"],["story3","Story: Philosophy"],["quote","Quote"],["cta","CTA"]].map(([id,label]) => (
          <a key={id} href={`#section-${id}`} className="rounded-full border border-border/60 px-3.5 py-1.5 text-[10px] text-foreground/60 hover:text-foreground hover:border-[#A8E4A0] transition-all duration-200">{label}</a>
        ))}
      </nav>

      <div className="space-y-10 max-w-3xl">
        <SectionCard id="section-hero" title="1. Hero Section">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Full Name" value={config.hero_full_name} onChange={(v) => update("hero_full_name", v)} placeholder="Ashbin Kafle" />
            <Field label="Headline" value={config.hero_headline} onChange={(v) => update("hero_headline", v)} placeholder="Artist" />
            <Field label="Subheadline" value={config.hero_subheadline} onChange={(v) => update("hero_subheadline", v)} placeholder="Visual Storyteller" />
            <Field label="Tagline" value={config.hero_tagline} onChange={(v) => update("hero_tagline", v)} placeholder="Nature Observer" />
          </div>
          <TextArea label="Hero Tagline (body text)" value={config.hero_tagline_body} onChange={(v) => update("hero_tagline_body", v)} rows={2} />
        </SectionCard>

        <SectionCard id="section-about-image" title="2. About Image">
          <ImagePicker
            label="About Page Portrait Image"
            artworkId={config.about_image_artwork_id}
            imageUrl={config.about_image_url}
            onArtworkIdChange={(id) => {
              update("about_image_artwork_id", id);
              update("about_image_url", null);
            }}
            onImageUrlChange={(url) => {
              update("about_image_url", url);
              update("about_image_artwork_id", null);
            }}
            section="about"
          />
        </SectionCard>

        <SectionCard id="section-intro" title="3. Introduction Section">
          <Field label="Heading" value={config.introduction_heading} onChange={(v) => update("introduction_heading", v)} placeholder="Living Through Landscapes" />
          <TextArea label="Paragraphs (separate with blank line)" value={config.introduction_paragraphs} onChange={(v) => update("introduction_paragraphs", v)} rows={6} />
        </SectionCard>

        <SectionCard id="section-story1" title="4. Story: The Journey">
          <ImagePicker
            label="Story Image — The Journey"
            artworkId={config.story1_image_artwork_id}
            imageUrl={config.story1_image_url}
            onArtworkIdChange={(id) => {
              update("story1_image_artwork_id", id);
              update("story1_image_url", null);
            }}
            onImageUrlChange={(url) => {
              update("story1_image_url", url);
              update("story1_image_artwork_id", null);
            }}
            section="about-story1"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Section Label" value={config.story1_label} onChange={(v) => update("story1_label", v)} placeholder="The Journey" />
            <Field label="Title" value={config.story1_title} onChange={(v) => update("story1_title", v)} placeholder="The Journey" />
          </div>
          <TextArea label="Paragraphs (separate with blank line)" value={config.story1_paragraphs} onChange={(v) => update("story1_paragraphs", v)} rows={6} />
        </SectionCard>

        <SectionCard id="section-story2" title="5. Story: The Process">
          <ImagePicker
            label="Story Image — The Process"
            artworkId={config.story2_image_artwork_id}
            imageUrl={config.story2_image_url}
            onArtworkIdChange={(id) => {
              update("story2_image_artwork_id", id);
              update("story2_image_url", null);
            }}
            onImageUrlChange={(url) => {
              update("story2_image_url", url);
              update("story2_image_artwork_id", null);
            }}
            section="about-story2"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Section Label" value={config.story2_label} onChange={(v) => update("story2_label", v)} placeholder="The Process" />
            <Field label="Title" value={config.story2_title} onChange={(v) => update("story2_title", v)} placeholder="The Process" />
          </div>
          <TextArea label="Paragraphs (separate with blank line)" value={config.story2_paragraphs} onChange={(v) => update("story2_paragraphs", v)} rows={6} />
        </SectionCard>

        <SectionCard id="section-story3" title="6. Story: The Philosophy">
          <ImagePicker
            label="Story Image — The Philosophy"
            artworkId={config.story3_image_artwork_id}
            imageUrl={config.story3_image_url}
            onArtworkIdChange={(id) => {
              update("story3_image_artwork_id", id);
              update("story3_image_url", null);
            }}
            onImageUrlChange={(url) => {
              update("story3_image_url", url);
              update("story3_image_artwork_id", null);
            }}
            section="about-story3"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Section Label" value={config.story3_label} onChange={(v) => update("story3_label", v)} placeholder="The Philosophy" />
            <Field label="Title" value={config.story3_title} onChange={(v) => update("story3_title", v)} placeholder="The Philosophy" />
          </div>
          <TextArea label="Paragraphs (separate with blank line)" value={config.story3_paragraphs} onChange={(v) => update("story3_paragraphs", v)} rows={6} />
        </SectionCard>

        <SectionCard id="section-quote" title="7. Quote Section">
          <TextArea label="Quote Text" value={config.quote_text} onChange={(v) => update("quote_text", v)} rows={3} />
          <Field label="Attribution" value={config.quote_attribution} onChange={(v) => update("quote_attribution", v)} placeholder="Ashbin Kafle" />
        </SectionCard>

        <SectionCard id="section-cta" title="8. Final Call to Action">
          <Field label="Available For (comma-separated)" value={config.cta_available_for} onChange={(v) => update("cta_available_for", v)} placeholder="Commissions, Exhibitions, Collaborations" />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Button Text" value={config.cta_button_text} onChange={(v) => update("cta_button_text", v)} placeholder="Get in Touch" />
            <Field label="Button Link" value={config.cta_button_link} onChange={(v) => update("cta_button_link", v)} placeholder="/contact" />
          </div>
        </SectionCard>

        <div className="flex items-center justify-between pb-10">
          <p className="text-xs text-foreground/40">All images are referenced from the Artworks library.</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={handleSave} disabled={saving}
              className="inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] disabled:opacity-50">{saving ? "Saving..." : "Save All Settings"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
