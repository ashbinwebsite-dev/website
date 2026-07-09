"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  bucket?: string;
  folder?: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  bucket = "portfolio",
  folder = "uploads",
  currentUrl,
  onUpload,
  label = "Upload Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    setPreview(null);
    onUpload("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
        {label}
      </label>

      {preview ? (
        <div className="relative inline-block rounded-[10px] overflow-hidden border border-border/70 bg-[#eaf5ea]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 w-auto object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 border border-border/60 text-foreground/70 hover:text-foreground transition-colors duration-200"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-3 rounded-[10px] border-2 border-dashed border-border/70 bg-white/50 px-5 py-8 text-sm text-foreground/50 hover:text-foreground hover:border-[#A8E4A0] transition-all duration-200 w-full justify-center"
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-[#A8E4A0] border-t-transparent animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload size={16} />
              <span>{label}</span>
            </div>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-xs text-rose-500/90">{error}</p>}
    </div>
  );
}
