"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Settings {
  site_title: string;
  site_description: string;
}

import { useToast } from "@/components/dashboard/ToastProvider";

export default function SettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Default values
  const [settings, setSettings] = useState<Settings>({
    site_title: "Ashbin Kafle — Artist",
    site_description: "A premium portfolio experience for artist Ashbin Kafle. Minimal, editorial, and immersive.",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: siteData } = await supabase
        .from("site_settings")
        .select("key, value");

      if (siteData) {
        const mapped: Partial<Settings> = {};
        for (const s of siteData) {
          const v = s.value as Record<string, string>;
          if (s.key === "site_metadata") {
            mapped.site_title = v.title ?? settings.site_title;
            mapped.site_description = v.description ?? settings.site_description;
          }
        }
        setSettings((prev) => ({ ...prev, ...mapped }));
      }
    }
    load();
  }, []);

  async function saveSetting(key: string, value: unknown) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("site_settings").upsert(
      { user_id: user?.id ?? null, key, value: value as Record<string, unknown> },
      { onConflict: "key,user_id" },
    );
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);

    await Promise.all([
      saveSetting("site_metadata", {
        title: form.get("site_title"),
        description: form.get("site_description"),
      }),
    ]);

    setSaving(false);
    toast({ title: "Settings saved", variant: "success" });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Site metadata and SEO settings
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        {/* SEO */}
        <div className="space-y-6 rounded-xl border border-border/70 bg-white p-8">
          <h2 className="text-sm font-heading tracking-[-0.02em] text-foreground border-b border-border/50 pb-3">
            Site Metadata
          </h2>
          <Field name="site_title" label="Site Title" defaultValue={settings.site_title} />
          <TextArea name="site_description" label="Site Description (meta)" rows={3} defaultValue={settings.site_description} />
        </div>



        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
      />
    </div>
  );
}

function TextArea({ label, name, rows = 4, defaultValue }: { label: string; name: string; rows?: number; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">{label}</label>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15 resize-y"
      />
    </div>
  );
}
