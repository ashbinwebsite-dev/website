"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      // Focus the confirm button when dialog opens
      setTimeout(() => confirmRef.current?.focus(), 50);

      // Close on Escape
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCancel();
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm bg-white rounded-xl border border-border/70 shadow-xl p-6 animate-fade-in"
        role="alertdialog"
        aria-labelledby="confirm-title"
      >
        <div className="flex items-start gap-4">
          <div
            className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full ${
              destructive ? "bg-rose-50 text-rose-500" : "bg-foreground/5 text-foreground/60"
            }`}
          >
            <AlertTriangle size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="confirm-title"
              className="text-sm font-heading tracking-[-0.02em] text-foreground"
            >
              {title}
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-foreground/65">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
          >
            <X size={12} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-full border border-border/70 px-5 py-2 text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading hover:text-foreground hover:border-foreground/30 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em] text-white font-heading transition-all duration-200 hover:-translate-y-0.5 ${
              destructive
                ? "bg-rose-500 hover:bg-rose-600"
                : "bg-[#A8E4A0] text-[#222222] hover:bg-[#96d88e]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
