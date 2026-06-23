"use client";

import { motion } from "framer-motion";
import { Mail, Camera, MapPin } from "lucide-react";

const contactDetails = [
  {
    label: "Email",
    value: "hello@ashbinkafle.com",
    href: "mailto:hello@ashbinkafle.com",
    icon: Mail,
  },
  {
    label: "Instagram",
    value: "@ashbinkafle",
    href: "https://instagram.com/ashbinkafle",
    icon: Camera,
  },
  {
    label: "Location",
    value: "Kathmandu, Nepal",
    icon: MapPin,
  },
];

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap gap-x-10 gap-y-5 pt-6"
    >
      {contactDetails.map((item) => {
        const Icon = item.icon;
        const Content = (
          <div className="flex items-center gap-2.5 group">
            <Icon
              size={14}
              className="shrink-0 text-foreground/40 transition-colors duration-300 group-hover:text-foreground/70"
            />
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
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="no-underline"
            >
              {Content}
            </a>
          );
        }

        return <div key={item.label}>{Content}</div>;
      })}
    </motion.div>
  );
}
