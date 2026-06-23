"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Logo({ scrolled }: { scrolled: boolean }) {
  const pathname = usePathname();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href="/"
        className={`inline-flex items-center text-xs uppercase tracking-[0.35em] ${!scrolled && pathname === "/" ? "!text-white" : "text-black"} font-heading`}
      >
        ashbin kafle
      </Link>
    </motion.div>
  );
}
