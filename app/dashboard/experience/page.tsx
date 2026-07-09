"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/components/dashboard/ToastProvider";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import type { ExperienceRow } from "@/types/database/database";

export default function ExperiencePage() {
  const { toast } = useToast();
  const [items, setItems] = useState<ExperienceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newYear, setNewYear] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function loadItems() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("experience")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true });

    setItems((data ?? []) as ExperienceRow[]);
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function addItem() {
    if (!newYear.trim() || !newLabel.trim()) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("experience").insert({
      user_id: user.id,
      year: newYear.trim(),
      label: newLabel.trim(),
      sort_order: items.length,
    });

    if (!error) {
      toast({ title: "Milestone added", variant: "success" });
    }
    setNewYear("");
    setNewLabel("");
    loadItems();
  }

  async function deleteItem(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("experience").delete().eq("id", id);
    setDeleteConfirm(null);
    if (!error) {
      toast({ title: "Milestone deleted", variant: "success" });
    }
    loadItems();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground">
          Experience
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Timeline milestones shown on the About page
        </p>
      </div>

      {/* Add new */}
      <div className="mb-8 rounded-xl border border-border/70 bg-white p-6">
        <div className="flex items-end gap-3">
          <div className="space-y-1.5 flex-1">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
              Year
            </label>
            <input
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="2024"
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>
          <div className="space-y-1.5 flex-[2]">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading">
              Milestone
            </label>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Started painting professionally"
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#A8E4A0] px-5 py-3 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e]"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-xl border border-border/70 bg-white p-12 text-center">
          <p className="text-sm text-foreground/50">Loading...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border/70 bg-white p-12 text-center">
          <p className="text-sm text-foreground/50">
            No milestones added yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-border/70 bg-white px-5 py-4"
            >
              <GripVertical size={14} className="shrink-0 text-foreground/20" />
              <span className="text-sm font-heading text-foreground w-16">
                {item.year}
              </span>
              <span className="flex-1 text-sm text-foreground/70">
                {item.label}
              </span>
              <button
                type="button"
                onClick={() => setDeleteConfirm(item.id)}
                className="shrink-0 text-foreground/30 hover:text-rose-500 transition-colors duration-200"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="Delete Milestone"
        message="Are you sure you want to delete this milestone? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && deleteItem(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
