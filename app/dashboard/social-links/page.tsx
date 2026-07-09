"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import SocialIcon, { SOCIAL_PLATFORMS } from "@/components/dashboard/SocialIcon";
import { useToast } from "@/components/dashboard/ToastProvider";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import type { SocialLinkRow } from "@/types/database/database";

export default function SocialLinksPage() {
  const { toast } = useToast();
  const [links, setLinks] = useState<SocialLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlatform, setNewPlatform] = useState("instagram");
  const [newUrl, setNewUrl] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function loadLinks() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true });
    setLinks((data ?? []) as SocialLinkRow[]);
    setLoading(false);
  }

  useEffect(() => { loadLinks(); }, []);

  async function addLink() {
    if (!newPlatform || !newUrl.trim()) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const platformInfo = SOCIAL_PLATFORMS.find((p) => p.value === newPlatform);
    const { error } = await supabase.from("social_links").insert({
      user_id: user.id,
      platform: newPlatform,
      label: platformInfo?.label || newPlatform,
      url: newUrl.trim(),
      sort_order: links.length,
    });

    if (!error) {
      toast({ title: "Social link added", variant: "success" });
    }
    setNewPlatform("instagram");
    setNewUrl("");
    loadLinks();
  }

  async function deleteLink(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    setDeleteConfirm(null);
    if (!error) {
      toast({ title: "Social link removed", variant: "success" });
    }
    loadLinks();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground">Social Links</h1>
        <p className="mt-1 text-sm text-foreground/60">Social media links shown in the footer and contact page</p>
      </div>

      <div className="mb-8 rounded-xl border border-border/70 bg-white p-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">Platform</label>
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">URL</label>
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder={`https://${newPlatform}.com/...`}
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>
        </div>
        <button type="button" onClick={addLink}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#A8E4A0] px-5 py-2.5 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e]">
          <Plus size={14} /> Add Link
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-border/70 bg-white p-12 text-center"><p className="text-sm text-foreground/50">Loading...</p></div>
      ) : links.length === 0 ? (
        <div className="rounded-xl border border-border/70 bg-white p-12 text-center"><p className="text-sm text-foreground/50">No social links added yet</p></div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-4 rounded-xl border border-border/70 bg-white px-5 py-4">
              <SocialIcon platform={link.platform} size={18} colored />
              <span className="rounded bg-foreground/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-foreground/50 font-heading">{link.platform}</span>
              <span className="text-sm text-foreground/70 flex-1 truncate">{link.label}</span>
              <span className="text-xs text-foreground/40 truncate max-w-[200px] hidden sm:block">{link.url}</span>
              <button type="button" onClick={() => setDeleteConfirm(link.id)} className="shrink-0 text-foreground/30 hover:text-rose-500 transition-colors duration-200">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="Delete Social Link"
        message="Are you sure you want to remove this social link? It will no longer appear on your site."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && deleteLink(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
