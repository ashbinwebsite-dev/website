"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const navItems = [
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Get in Touch", href: "#contact" },
];

interface MobileMenuProps {
  open: boolean;
  activeSection: string;
  onClose: () => void;
}

export default function MobileMenu({
  open,
  activeSection,
  onClose,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -28 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-background/98 backdrop-blur-xl"
        >
          <div className="flex h-full flex-col justify-between p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.35em] text-foreground/90 font-heading">
                Navigation
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-white/90 text-foreground transition duration-300 hover:border-primary/70"
              >
                <X size={20} />
              </button>
            </div>

            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.07,
                    delayChildren: 0.12,
                  },
                },
              }}
              className="space-y-6"
            >
              {navItems.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block text-3xl font-heading uppercase tracking-[0.25em] transition-colors duration-400 ${
                      activeSection === item.href.slice(1)
                        ? "text-foreground"
                        : "text-foreground/75 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <div className="space-y-3 border-t border-border/80 pt-6">
              <p className="max-w-xl text-sm leading-7 text-foreground/80">
                For commissions, collaborations, or press inquiries, reach out
                directly to keep the conversation quiet and intentional.
              </p>
              <a
                href="mailto:hello@ashbinkafle.com"
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm uppercase tracking-[0.24em] text-foreground transition duration-300 hover:border-primary hover:text-primary"
              >
                Contact
              </a>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
