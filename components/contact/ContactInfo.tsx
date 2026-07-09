"use client";

import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { useContactInformation, useSocialLinks } from "@/hooks/usePublicData";
import SocialIcon from "@/components/dashboard/SocialIcon";

const fallbackContactDetails = [
  {
    label: "Email",
    value: "hello@ashbinkafle.com",
    href: "mailto:hello@ashbinkafle.com",
    type: "email",
  },
  { label: "Location", value: "Kathmandu, Nepal", type: "location" },
];

const typeIconMap: Record<string, React.ElementType> = {
  email: Mail,
  location: MapPin,
};

interface ContactEntry {
  label: string;
  value: string;
  href?: string;
  type: string;
}

export default function ContactInfo() {
  const { data: contactInfo } = useContactInformation();
  const { data: socialLinks } = useSocialLinks();

  const contactDetails: ContactEntry[] =
    contactInfo && contactInfo.length > 0
      ? contactInfo.map((c) => ({
          label: c.label,
          value: c.value,
          href: c.href ?? undefined,
          type: c.type,
        }))
      : fallbackContactDetails;

  const socialContactEntries: ContactEntry[] =
    socialLinks && socialLinks.length > 0
      ? socialLinks.map((s) => ({
          label: s.label,
          value: s.label,
          href: s.url,
          type: s.platform,
        }))
      : [];

  const allEntries = [...contactDetails, ...socialContactEntries];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap gap-x-10 gap-y-5 pt-6"
    >
      {allEntries.map((item, idx) => {
        const isSocial = [
          "instagram",
          "facebook",
          "tiktok",
          "youtube",
          "twitter",
        ].includes(item.type);
        const StaticIcon = typeIconMap[item.type];

        const content = (
          <div className="flex items-center gap-2.5 group">
            {isSocial ? (
              <SocialIcon platform={item.type} size={14} colored />
            ) : StaticIcon ? (
              <StaticIcon
                size={14}
                className="shrink-0 text-foreground/40 transition-colors duration-300 group-hover:text-foreground/70"
              />
            ) : null}
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-heading">
                {item.label}
              </p>
              <p className="text-sm leading-snug text-foreground/75 transition-colors duration-300 group-hover:text-foreground">
                {item.value}
              </p>
            </div>
          </div>
        );

        if (item.href) {
          return (
            <a
              key={`entry-${idx}`}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="no-underline"
            >
              {content}
            </a>
          );
        }
        return <div key={`entry-${idx}`}>{content}</div>;
      })}
    </motion.div>
  );
}
