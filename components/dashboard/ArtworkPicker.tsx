"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, X, Check, ImageIcon } from "lucide-react";
import type { ArtworkRow } from "@/types/database/database";

interface ArtworkPickerProps {
  /** The currently selected artwork ID (or null) */
  selectedId: string | null;
  /** Called when an artwork is selected (id) or cleared (null) */
  onSelect: (id: string | null) => void;
  /** Label shown above the picker */
  label?: string;
}

export default function ArtworkPicker({
  selectedId,
  onSelect,
  label = "Select Artwork",
}: ArtworkPickerProps) {
  const [open, setOpen] = useState(false);
  const [artworks, setArtworks] = useState<ArtworkRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkRow | null>(
    null,
  );
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

  // Focus grid when modal opens so wheel events are captured
  useEffect(() => {
    if (open && gridRef.current) {
      // Small delay to ensure DOM is painted
      requestAnimationFrame(() => {
        gridRef.current?.focus();
      });
    }
  }, [open]);

  // Load the selected artwork preview data
  useEffect(() => {
    if (!selectedId) {
      setSelectedArtwork(null);
      return;
    }
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("artworks")
        .select("id, title, image_url, image_alt, year, medium")
        .eq("id", selectedId)
        .single();
      if (data) setSelectedArtwork(data as ArtworkRow);
    }
    load();
  }, [selectedId]);

  // Load artworks when modal opens
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
      setArtworks((data ?? []) as ArtworkRow[]);
      setLoading(false);
    }
    load();
  }, [open, search]);

  function handleSelect(artwork: ArtworkRow) {
    onSelect(artwork.id);
    setSelectedArtwork(artwork);
    setOpen(false);
  }

  function handleClear() {
    onSelect(null);
    setSelectedArtwork(null);
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
        {label}
      </label>

      {/* Preview of selected artwork */}
      {selectedArtwork ? (
        <div className="relative inline-block rounded-[10px] overflow-hidden border border-border/70 bg-[#eaf5ea]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedArtwork.image_url}
            alt={selectedArtwork.image_alt || selectedArtwork.title}
            className="max-h-36 w-auto object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-6">
            <p className="text-xs text-white font-medium truncate">
              {selectedArtwork.title}
            </p>
            {selectedArtwork.year && (
              <p className="text-[10px] text-white/70">
                {selectedArtwork.medium} &middot; {selectedArtwork.year}
              </p>
            )}
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 border border-border/60 text-foreground/70 hover:text-foreground transition-colors duration-200"
              title="Change image"
            >
              <Search size={12} />
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
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-[10px] border-2 border-dashed border-border/70 bg-white/50 px-5 py-8 text-sm text-foreground/50 hover:text-foreground hover:border-[#A8E4A0] transition-all duration-200 w-full justify-center"
        >
          <ImageIcon size={16} />
          <span>{label}</span>
        </button>
      )}

      {/* Modal */}
      {open && (
        <>
          {/* Backdrop - separate layer, click to close */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal container - centers the modal, pointer-events-none so clicks pass through to backdrop */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            onWheel={(e) => {
              // Stop wheel events at this container level from reaching the body
              e.stopPropagation();
            }}
          >
            <div
              className="w-full max-w-2xl max-h-[85vh] bg-white rounded-xl border border-border/70 shadow-xl flex flex-col pointer-events-auto"
              style={{ overscrollBehavior: "contain" }}
              onWheel={(e) => {
                // Stop wheel events at the modal level
                e.stopPropagation();
              }}
            >
              {/* Header - shrink-0 ensures it doesn't compress */}
              <div className="shrink-0 flex items-center justify-between border-b border-border/50 px-5 py-4">
                <h3 className="text-sm font-heading tracking-[-0.02em] text-foreground">
                  Select Artwork
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Search - shrink-0 */}
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

              {/* Grid - flex-1 fills remaining space, min-h-0 allows shrinking, overflow-y-auto enables scrolling */}
              <div
                ref={gridRef}
                tabIndex={-1}
                className="flex-1 overflow-y-auto p-5 min-h-0 outline-none"
                style={{ overscrollBehavior: "contain" }}
                onWheel={(e) => {
                  // Stop wheel events at the grid level too
                  e.stopPropagation();
                }}
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
                        onClick={() => handleSelect(artwork)}
                        className={`group relative aspect-[4/5] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedId === artwork.id
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
                        {selectedId === artwork.id && (
                          <div className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#A8E4A0]">
                            <Check size={10} className="text-[#222222]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer - shrink-0 */}
              <div className="shrink-0 border-t border-border/50 px-5 py-3 flex justify-between items-center">
                <p className="text-[11px] text-foreground/40">
                  {artworks.length > 0
                    ? `${artworks.length} artwork${artworks.length !== 1 ? "s" : ""}`
                    : "No artworks"}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
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
