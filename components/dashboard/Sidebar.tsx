"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  Image,
  LayoutDashboard,
  FileText,
  Send,
  Briefcase,
  Share2,
  UserPlus,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/supabase/actions";

const navItems = [
  { label: "Artworks", href: "/dashboard/artworks", icon: Image },
  { label: "Homepage", href: "/dashboard/homepage", icon: LayoutDashboard },
  { label: "About Page", href: "/dashboard/about-settings", icon: FileText },
  { label: "Contact Page", href: "/dashboard/contact-settings", icon: Send },
  { label: "Experience", href: "/dashboard/experience", icon: Briefcase },
  { label: "Social Links", href: "/dashboard/social-links", icon: Share2 },
  // { label: "Invite User", href: "/dashboard/users", icon: UserPlus },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col border-r border-border/70 bg-white/50 backdrop-blur-sm">
      <div className="flex h-[80px] items-center px-6 border-b border-border/50">
        <Link
          href="/dashboard/artworks"
          className="text-xs uppercase tracking-[0.35em] text-foreground/70 font-heading hover:text-foreground transition-colors duration-300"
        >
          Dashboard
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                    isActive
                      ? "bg-[#A8E4A0]/20 text-foreground font-medium"
                      : "text-foreground/60 hover:text-foreground hover:bg-foreground/5",
                  )}
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border/50 p-3">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
          >
            <LogOut size={16} className="shrink-0" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
