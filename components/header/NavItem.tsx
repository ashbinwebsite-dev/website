"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  scrolled: boolean;
}

export default function NavItem({
  href,
  label,
  active,
  onClick,
  scrolled,
}: NavItemProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative overflow-hidden rounded-full px-4 py-2 text-sm font-heading uppercase tracking-[0.22em] text-foreground/90 transition-colors duration-300"
    >
      <span className="absolute inset-0 rounded-full bg-primary/10 opacity-0 transition duration-500 ease-[0.22,1,0.36,1] group-hover:opacity-100" />

      <span
        className={`relative z-10 ${!scrolled && pathname === "/" ? "!text-white" : "text-black"}`}
      >
        {label}
      </span>
    </Link>
  );
}
