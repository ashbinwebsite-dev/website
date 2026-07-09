"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import FormField from "./FormField";
import SubmitButton from "./SubmitButton";
import ContactInfo from "./ContactInfo";
import { createClient } from "@/lib/supabase/client";

const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  number: z
    .string()
    .min(1, "Please enter your phone number")
    .regex(/^[\d\s\-\+\(\)]+$/, "Please enter a valid phone number"),
  message: z.string().min(1, "Please enter your message"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

const fieldAnimation = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.25 + i * 0.07,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      number: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitStatus("loading");

    try {
      // Save to Supabase messages table
      const supabase = createClient();
      const { error: dbError } = await supabase.from("messages").insert({
        name: data.name,
        email: data.email,
        phone: data.number,
        subject: "Website Enquiry",
        message: data.message,
      });

      if (dbError) throw dbError;

      // Send email notification via API
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            number: data.number,
            message: data.message,
          }),
        });
      } catch {
        // Email notification is optional — don't block success if it fails
        console.warn("Email notification failed, but message was saved.");
      }

      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    }
  };

  if (submitStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#A8E4A0]"
        >
          <Check size={22} className="text-[#222222]" />
        </motion.span>
        <p className="text-xl font-heading text-foreground">
          Message sent
        </p>
        <p className="mt-2 text-sm leading-7 text-foreground/70 max-w-xs">
          Thank you for reaching out. Ashbin typically responds within two
          business days.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fieldAnimation}
        >
          <FormField
            label="Name"
            placeholder="Your name"
            autocomplete="name"
            error={errors.name}
            {...register("name")}
          />
        </motion.div>

        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fieldAnimation}
        >
          <FormField
            label="Email"
            type="email"
            placeholder="your@email.com"
            autocomplete="email"
            error={errors.email}
            {...register("email")}
          />
        </motion.div>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fieldAnimation}
        >
          <FormField
            label="Phone Number"
            type="tel"
            placeholder="+44 7700 900000"
            autocomplete="tel"
            error={errors.number}
            {...register("number")}
          />
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fieldAnimation}
        >
          <FormField
            label="Message"
            type="textarea"
            placeholder="Tell me about your project or enquiry…"
            error={errors.message}
            {...register("message")}
          />
        </motion.div>
      </div>

      {submitStatus === "error" && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xs text-rose-500/90"
          role="alert"
        >
          Something went wrong. Please try again or email directly.
        </motion.p>
      )}

      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={fieldAnimation}
        className="mt-6"
      >
        <SubmitButton isSubmitting={submitStatus === "loading"} />
      </motion.div>

      <ContactInfo />
    </form>
  );
}
