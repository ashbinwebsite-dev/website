"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useProfile, useSocialLinks } from "@/hooks/usePublicData";
import SocialIcon from "@/components/dashboard/SocialIcon";
import { Mail } from "lucide-react";

const fallbackSocialLinks = [
  { platform: "instagram", label: "Instagram", url: "https://instagram.com/ashbinkafle" },
];

const fallbackEmail = "hello@ashbinkafle.com";

export default function Footer() {
  const { data: profile } = useProfile();
  const { data: socialLinks } = useSocialLinks();
  const currentYear = new Date().getFullYear();

  const fullName = profile?.full_name || "Ashbin Kafle";
  const email = profile?.contact_email || fallbackEmail;
  const links = socialLinks && socialLinks.length > 0 ? socialLinks : fallbackSocialLinks;

  return (
    <footer className="border-t border-border/70 py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Navigation */}
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4">Navigation</p>
            <nav className="flex flex-col gap-2.5">
              <Link href="/portfolio" className="text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300">Portfolio</Link>
              <Link href="/about" className="text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300">About</Link>
              <Link href="/contact" className="text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300">Get in Touch</Link>
            </nav>
          </div>

          {/* Social with icons */}
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4">Social</p>
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300 group"
                >
                  <SocialIcon platform={link.platform} size={16} colored />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4">Contact</p>
            <a href={`mailto:${email}`} className="flex items-center gap-2.5 text-sm leading-6 text-foreground/70 hover:text-foreground transition duration-300 group">
              <Mail size={14} className="shrink-0 text-foreground/40 group-hover:text-foreground/70 transition-colors duration-300" />
              <span>{email}</span>
            </a>
          </div>

          {/* About */}
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4">About</p>
            <p className="text-sm leading-6 text-foreground/60 max-w-[220px]">
              {fullName} — creating quiet moments inspired by nature, memory, and light.
            </p>
          </div>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-border/70">
          <p className="text-xs text-foreground/40 tracking-[0.2em] uppercase">
            &copy; {currentYear} {fullName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
