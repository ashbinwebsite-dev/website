"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Image, MessageSquare, Briefcase, Share2 } from "lucide-react";

interface DashboardStats {
  artworks: number;
  messages: number;
  unreadMessages: number;
  experience: number;
  socialLinks: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    artworks: 0,
    messages: 0,
    unreadMessages: 0,
    experience: 0,
    socialLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [
        { count: artworks },
        { count: messages },
        { count: unreadMessages },
        { count: experience },
        { count: socialLinks },
      ] = await Promise.all([
        supabase
          .from("artworks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("read", false),
        supabase
          .from("experience")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("social_links")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      setStats({
        artworks: artworks ?? 0,
        messages: messages ?? 0,
        unreadMessages: unreadMessages ?? 0,
        experience: experience ?? 0,
        socialLinks: socialLinks ?? 0,
      });
      setLoading(false);
    }

    loadStats();
  }, []);

  const cards = [
    {
      label: "Artworks",
      value: stats.artworks,
      icon: Image,
      href: "/dashboard/artworks",
      color: "bg-[#A8E4A0]/20 text-foreground",
    },
    {
      label: "Messages",
      value: stats.messages,
      sub: `${stats.unreadMessages} unread`,
      icon: MessageSquare,
      href: "/dashboard/messages",
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Experience",
      value: stats.experience,
      icon: Briefcase,
      href: "/dashboard/experience",
      color: "bg-amber-100 text-amber-700",
    },
    {
      label: "Social Links",
      value: stats.socialLinks,
      icon: Share2,
      href: "/dashboard/social-links",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground">
          Overview
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Welcome to your portfolio dashboard
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-xl border border-border/70 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}
                >
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-4 text-2xl font-heading tracking-[-0.02em] text-foreground">
                {loading ? "—" : card.value}
              </p>
              <p className="mt-0.5 text-xs text-foreground/50 uppercase tracking-[0.2em]">
                {card.label}
              </p>
              {card.sub && (
                <p className="mt-1 text-xs text-foreground/40">{card.sub}</p>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl border border-border/70 bg-white p-8">
        <h2 className="text-sm font-heading tracking-[-0.02em] text-foreground mb-2">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link
            href="/dashboard/artworks/new"
            className="inline-flex items-center rounded-full bg-[#A8E4A0] px-5 py-2 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e]"
          >
            Add Artwork
          </Link>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center rounded-full border border-border/70 px-5 py-2 text-xs uppercase tracking-[0.24em] text-foreground/70 font-heading transition-all duration-300 hover:text-foreground hover:border-foreground/30"
          >
            Edit Profile
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-border/70 px-5 py-2 text-xs uppercase tracking-[0.24em] text-foreground/70 font-heading transition-all duration-300 hover:text-foreground hover:border-foreground/30"
          >
            View Site
          </Link>
        </div>
      </div>
    </div>
  );
}
