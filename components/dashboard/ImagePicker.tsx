"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, X, Check, ImageIcon, Upload } from "lucide-react";
import type { ArtworkRow } from "@/types/database/database";

interface ImagePickerProps {
  /** Label shown above the picker */
  label: string;
  /** Currently selected artwork ID (if picking from gallery) */
  artworkId: string | null;
  /** Currently uploaded image URL (if custom upload) */
  imageUrl: string | null;
  /** Called when an artwork is selected from the gallery */
  onArtworkIdChange: (id: string | null) => void;
  /** Called when a custom image is uploaded or cleared */
  onImageUrlChange: (url: string | null) => void;
  /** Storage folder prefix for organizing uploads */
  section?: string;
}

/**
 * Extracts the storage path from a Supabase Storage public URL.
 * URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
 */
function extractStoragePath(url: string): string | null {
  try {
    const parts = url.split("/storage/v1/object/public/");
    if (parts.length < 2) return null;
    // parts[1] = "<bucket>/<path>"
    const slashIndex = parts[1].indexOf("/");
    if (slashIndex === -1) return null;
    return parts[1].substring(slashIndex + 1); // the path after bucket name
  } catch {
    return null;
  }
}

/**
 * Deletes a file from Supabase Storage by its public URL.
 */
async function deleteFromStorage(url: string): Promise<void> {
  const storagePath = extractStoragePath(url);
  if (!storagePath) return;
  try {
    const supabase = createClient();
    await supabase.storage.from("portfolio").remove([storagePath]);
  } catch {
    // Silently fail — non-critical cleanup
  }
}

export default function ImagePicker({
  label,
  artworkId,
  imageUrl,
  onArtworkIdChange,
  onImageUrlChange,
  section = "sections",
}: ImagePickerProps) {
  const [openGallery, setOpenGallery] = useState(false);
  const [artworks, setArtworks] = useState<ArtworkRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewArtwork, setPreviewArtwork] = useState<ArtworkRow | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!openGallery) return;
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
  }, [openGallery]);

  // Focus grid when modal opens
  useEffect(() => {
    if (openGallery && gridRef.current) {
      requestAnimationFrame(() => {
        gridRef.current?.focus();
      });
    }
  }, [openGallery]);

  // Load artwork preview data when artworkId changes
  useEffect(() => {
    if (!artworkId) {
      setPreviewArtwork(null);
      return;
    }
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("artworks")
        .select("id, title, image_url, image_alt, year, medium")
        .eq("id", artworkId)
        .single();
      if (data) setPreviewArtwork(data as ArtworkRow);
    }
    load();
  }, [artworkId]);

  // Load artworks when gallery modal opens
  useEffect(() => {
    if (!openGallery) return;
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
      setArtworks((data ?? []) as ArtworkRow[]);
      setLoading(false);
    }
    load();
  }, [openGallery, search]);

  // The preview URL: from selected artwork or custom upload
  const previewUrl = previewArtwork?.image_url || imageUrl || null;
  const hasImage = !!previewUrl;
  const isCustomImage = !!imageUrl;

  function handleSelectArtwork(artwork: ArtworkRow) {
    // If there was a custom image, delete it from storage
    if (imageUrl) {
      deleteFromStorage(imageUrl);
    }
    onArtworkIdChange(artwork.id);
    setOpenGallery(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${section}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Delete old custom image from storage before replacing
      if (imageUrl) {
        deleteFromStorage(imageUrl);
      }

      onImageUrlChange(publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleClear() {
    // Delete custom image from storage
    if (imageUrl) {
      deleteFromStorage(imageUrl);
    }
    onArtworkIdChange(null);
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
        {label}
      </label>

      {/* Hidden file input for uploads */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview area */}
      {hasImage ? (
        <div className="relative inline-block rounded-[10px] overflow-hidden border border-border/70 bg-[#eaf5ea]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl!}
            alt="Preview"
            className="max-h-36 w-auto object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-6">
            {previewArtwork ? (
              <>
                <p className="text-xs text-white font-medium truncate">
                  {previewArtwork.title}
                </p>
                {previewArtwork.year && (
                  <p className="text-[10px] text-white/70">
                    {previewArtwork.medium} &middot; {previewArtwork.year}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-white/80">Custom uploaded image</p>
            )}
          </div>
          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              type="button"
              onClick={() => setOpenGallery(true)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 border border-border/60 text-foreground/70 hover:text-foreground transition-colors duration-200"
              title="Choose from gallery"
            >
              <Search size={12} />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 border border-border/60 text-foreground/70 hover:text-foreground transition-colors duration-200"
              title="Upload new image"
            >
              {uploading ? (
                <div className="h-3 w-3 rounded-full border-[1.5px] border-[#A8E4A0] border-t-transparent animate-spin" />
              ) : (
                <Upload size={12} />
              )}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 border border-border/60 text-rose-400 hover:text-rose-600 transition-colors duration-200"
              title="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        /* Empty state — show both options */
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setOpenGallery(true)}
            className="flex items-center gap-3 rounded-[10px] border-2 border-dashed border-border/70 bg-white/50 px-5 py-8 text-sm text-foreground/50 hover:text-foreground hover:border-[#A8E4A0] transition-all duration-200 flex-1 justify-center"
          >
            <ImageIcon size={16} />
            <span>Choose from Gallery</span>
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-3 rounded-[10px] border-2 border-dashed border-border/70 bg-white/50 px-5 py-8 text-sm text-foreground/50 hover:text-foreground hover:border-[#A8E4A0] transition-all duration-200 flex-1 justify-center"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-[#A8E4A0] border-t-transparent animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload size={16} />
                <span>Upload Image</span>
              </div>
            )}
          </button>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-rose-500/90">{uploadError}</p>
      )}

      {/* Gallery Modal */}
      {openGallery && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenGallery(false)}
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
                  Select Artwork
                </h3>
                <button
                  type="button"
                  onClick={() => setOpenGallery(false)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Search */}
              <div className="shrink-0 px-5 py-3 border-b border-border/30">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                  />
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
                    {artworks.map((artwork) => (
                      <button
                        key={artwork.id}
                        type="button"
                        onClick={() => handleSelectArtwork(artwork)}
                        className={`group relative aspect-[4/5] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          artworkId === artwork.id
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
                        {artworkId === artwork.id && (
                          <div className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#A8E4A0]">
                            <Check size={10} className="text-[#222222]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-border/50 px-5 py-3 flex justify-between items-center">
                <p className="text-[11px] text-foreground/40">
                  {artworks.length > 0
                    ? `${artworks.length} artwork${artworks.length !== 1 ? "s" : ""}`
                    : "No artworks"}
                </p>
                <button
                  type="button"
                  onClick={() => setOpenGallery(false)}
                  className="text-xs text-foreground/50 hover:text-foreground transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
