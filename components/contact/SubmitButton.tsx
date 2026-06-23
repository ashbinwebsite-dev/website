"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export default function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative inline-flex items-center justify-center gap-2
        w-full rounded-full px-8 py-3.5
        text-sm uppercase tracking-[0.24em] font-heading
        transition-colors duration-300
        ${
          isSubmitting
            ? "bg-[#A8E4A0]/60 text-[#222222]/60 cursor-not-allowed"
            : "bg-[#A8E4A0] text-[#222222] hover:bg-[#96d88e] active:bg-[#8ace82]"
        }
      `}
      aria-label={isSubmitting ? "Sending message" : "Send message"}
    >
      {isSubmitting && (
        <motion.span
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={16} className="shrink-0" />
        </motion.span>
      )}
      <span>{isSubmitting ? "Sending…" : "Send Message"}</span>
    </motion.button>
  );
}
