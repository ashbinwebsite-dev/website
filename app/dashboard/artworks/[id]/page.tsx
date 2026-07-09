"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useToast } from "@/components/dashboard/ToastProvider";
import type { ArtworkRow } from "@/types/database/database";
import ImageUpload from "@/components/dashboard/ImageUpload";

export default function EditArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [artwork, setArtwork] = useState<ArtworkRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("artworks")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) {
        setArtwork(data as ArtworkRow);
        setImageUrl(data.image_url || "");
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const form = new FormData(e.currentTarget);

    const data = {
      title: form.get("title") as string,
      slug: (form.get("slug") as string).toLowerCase().replace(/\s+/g, "-"),
      year: parseInt(form.get("year") as string),
      medium: form.get("medium") as string,
      description: (form.get("description") as string) || null,
      availability: (form.get("availability") as string) || "available",
      image_url: form.get("image_url") as string,
      image_alt: (form.get("image_alt") as string) || "",
      published: form.get("published") === "on",
      sort_order: parseInt(form.get("sort_order") as string) || 0,
    };

    const { error: updateError } = await supabase
      .from("artworks")
      .update(data)
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    toast({ title: "Artwork updated", description: data.title, variant: "success" });
    router.push("/dashboard/artworks");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border/70 bg-white p-12 text-center">
        <p className="text-sm text-foreground/50">Loading...</p>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="rounded-xl border border-border/70 bg-white p-12 text-center">
        <p className="text-sm text-foreground/50 mb-4">Artwork not found</p>
        <Link
          href="/dashboard/artworks"
          className="text-xs uppercase tracking-[0.25em] text-foreground/50 hover:text-foreground transition-colors duration-300 font-heading"
        >
          ← Back to Artworks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/artworks"
          className="text-xs uppercase tracking-[0.25em] text-foreground/50 hover:text-foreground transition-colors duration-300 font-heading"
        >
          ← Back to Artworks
        </Link>
        <h1 className="mt-4 text-2xl font-heading tracking-[-0.03em] text-foreground">
          Edit Artwork
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border/70 bg-white p-8"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
              Title *
            </label>
            <input
              name="title"
              required
              defaultValue={artwork.title}
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
              Slug *
            </label>
            <input
              name="slug"
              required
              defaultValue={artwork.slug}
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
              Year *
            </label>
            <input
              name="year"
              type="number"
              required
              defaultValue={artwork.year}
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
              Medium *
            </label>
            <input
              name="medium"
              required
              defaultValue={artwork.medium}
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
              Availability
            </label>
            <select
              name="availability"
              defaultValue={artwork.availability}
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="commissioned">Commissioned</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
              Sort Order
            </label>
            <input
              name="sort_order"
              type="number"
              defaultValue={artwork.sort_order}
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={artwork.description ?? ""}
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15 resize-y"
            />
          </div>

          <div className="space-y-3 sm:col-span-2">
            <ImageUpload
              label="Upload Image"
              currentUrl={imageUrl}
              onUpload={(url) => setImageUrl(url)}
            />
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
                Or enter Image URL manually
              </label>
              <input
                name="image_url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15 font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
              Image Alt Text
            </label>
            <input
              name="image_alt"
              defaultValue={artwork.image_alt}
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>

          <div className="flex items-center gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                defaultChecked={artwork.published}
                className="h-4 w-4 rounded border-[#DCEFD8] text-[#A8E4A0] focus:ring-[#A8E4A0]/30"
              />
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
                Published
              </span>
            </label>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-500/90" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-full bg-[#A8E4A0] px-6 py-2.5 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/dashboard/artworks"
            className="text-xs text-foreground/50 hover:text-foreground transition-colors duration-300"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
