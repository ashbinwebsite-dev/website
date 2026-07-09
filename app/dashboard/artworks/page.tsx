"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/dashboard/ToastProvider";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import type { ArtworkRow } from "@/types/database/database";

export default function ArtworksPage() {
  const { toast } = useToast();
  const [artworks, setArtworks] = useState<ArtworkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  async function loadArtworks() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("artworks")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    setArtworks((data ?? []) as ArtworkRow[]);
    setLoading(false);
  }

  useEffect(() => {
    loadArtworks();
  }, []);

  async function togglePublished(id: string, current: boolean) {
    const supabase = createClient();
    await supabase.from("artworks").update({ published: !current }).eq("id", id);
    loadArtworks();
  }

  async function deleteArtwork(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("artworks").delete().eq("id", id);
    setDeleteConfirm(null);
    if (!error) {
      toast({ title: "Artwork deleted", variant: "success" });
    }
    loadArtworks();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground">
            Artworks
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Manage your portfolio pieces
          </p>
        </div>
        <Link
          href="/dashboard/artworks/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#A8E4A0] px-5 py-2.5 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e]"
        >
          <Plus size={14} />
          Add Artwork
        </Link>
      </div>

      {loading ? (
        <div className="rounded-xl border border-border/70 bg-white p-12 text-center">
          <p className="text-sm text-foreground/50">Loading...</p>
        </div>
      ) : artworks.length === 0 ? (
        <div className="rounded-xl border border-border/70 bg-white p-12 text-center">
          <p className="text-sm text-foreground/50 mb-4">No artworks yet</p>
          <Link
            href="/dashboard/artworks/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#A8E4A0] px-5 py-2.5 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e]"
          >
            <Plus size={14} />
            Add Your First Artwork
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-left">
                <th className="px-5 py-4 text-xs uppercase tracking-[0.2em] text-foreground/50 font-heading">
                  Title
                </th>
                <th className="px-5 py-4 text-xs uppercase tracking-[0.2em] text-foreground/50 font-heading">
                  Year
                </th>
                <th className="px-5 py-4 text-xs uppercase tracking-[0.2em] text-foreground/50 font-heading">
                  Medium
                </th>
                <th className="px-5 py-4 text-xs uppercase tracking-[0.2em] text-foreground/50 font-heading">
                  Status
                </th>
                <th className="px-5 py-4 text-xs uppercase tracking-[0.2em] text-foreground/50 font-heading">
                  Published
                </th>
                <th className="px-5 py-4 text-xs uppercase tracking-[0.2em] text-foreground/50 font-heading">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {artworks.map((artwork) => (
                <tr
                  key={artwork.id}
                  className="border-b border-border/30 last:border-b-0 hover:bg-foreground/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm text-foreground font-medium">
                      {artwork.title}
                    </p>
                    {artwork.slug && (
                      <p className="text-xs text-foreground/40 mt-0.5">
                        /{artwork.slug}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground/70">
                    {artwork.year}
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground/70">
                    {artwork.medium}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] font-medium ${
                        artwork.availability === "available"
                          ? "bg-green-100 text-green-700"
                          : artwork.availability === "sold"
                            ? "bg-rose-100 text-rose-600"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {artwork.availability}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        togglePublished(artwork.id, artwork.published)
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] font-medium transition-colors duration-200 ${
                        artwork.published
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {artwork.published ? (
                        <>
                          <Eye size={10} /> Live
                        </>
                      ) : (
                        <>
                          <EyeOff size={10} /> Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/artworks/${artwork.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all duration-200"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ id: artwork.id, title: artwork.title })}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-rose-400 hover:text-rose-600 hover:border-rose-300 transition-all duration-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="Delete Artwork"
        message={`Are you sure you want to delete "${deleteConfirm?.title ?? ""}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && deleteArtwork(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
