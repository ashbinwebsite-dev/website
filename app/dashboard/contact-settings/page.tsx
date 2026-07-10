"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import ImagePicker from "@/components/dashboard/ImagePicker";
import { useToast } from "@/components/dashboard/ToastProvider";
import type { ContactConfig } from "@/hooks/usePublicData";

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------
const defaults: ContactConfig = {
  image_artwork_id: null,
  image_url: null,
  subtitle: "Contact",
  title: "Get in Touch",
  body_text: "Available for commissions, exhibitions, collaborations, workshops, and landscape projects. I enjoy working with individuals, galleries, brands, and creative studios who value thoughtful visual storytelling.",
  available_for: "Commissions, Exhibitions, Collaborations, Landscape Projects",
};

// ---------------------------------------------------------------------------
// Reusable components
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ContactSettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [config, setConfig] = useState<ContactConfig>(defaults);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "contact_config")
        .single();
      if (data?.value) {
        const v = data.value as Partial<ContactConfig>;
        setConfig((prev) => ({ ...prev, ...v }));
      }
      setLoading(false);
    }
    load();
  }, []);

  const update = useCallback(<K extends keyof ContactConfig>(key: K, value: ContactConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("site_settings").upsert(
      { user_id: user?.id ?? null, key: "contact_config", value: config as unknown as Record<string, unknown> },
      { onConflict: "key,user_id" },
    );
    setSaving(false);
    toast({ title: "Contact page settings saved", variant: "success" });
  }, [config, toast]);

  if (loading) {
    return <div className="rounded-xl border border-border/70 bg-white p-12 text-center"><p className="text-sm text-foreground/50">Loading...</p></div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground">Contact Page Settings</h1>
          <p className="mt-1 text-sm text-foreground/60">Configure the contact page content. Images are selected from the Artworks library.</p>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleSave} disabled={saving}
            className="inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] disabled:opacity-50">
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </div>

      <div className="space-y-10 max-w-3xl">
        {/* 1. Contact Image */}
        <SectionCard id="section-image" title="1. Contact Image">
          <ImagePicker
            label="Contact Page Hero Image"
            artworkId={config.image_artwork_id}
            imageUrl={config.image_url}
            onArtworkIdChange={(id) => {
              update("image_artwork_id", id);
              update("image_url", null);
            }}
            onImageUrlChange={(url) => {
              update("image_url", url);
              update("image_artwork_id", null);
            }}
            section="contact"
          />
        </SectionCard>

        {/* 2. Hero Text */}
        <SectionCard id="section-hero" title="2. Hero Text">
          <Field label="Subtitle" value={config.subtitle} onChange={(v) => update("subtitle", v)} placeholder="Contact" />
          <Field label="Title" value={config.title} onChange={(v) => update("title", v)} placeholder="Get in Touch" />
          <TextArea label="Body Text" value={config.body_text} onChange={(v) => update("body_text", v)} rows={3} placeholder="Available for commissions..." />
          <Field label="Available For (comma-separated)" value={config.available_for} onChange={(v) => update("available_for", v)} placeholder="Commissions, Exhibitions, Collaborations" />
        </SectionCard>

        {/* Bottom save */}
        <div className="flex items-center justify-between pb-10">
          <p className="text-xs text-foreground/40">All images are referenced from the Artworks library.</p>
          <button type="button" onClick={handleSave} disabled={saving}
            className="inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] disabled:opacity-50">
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
