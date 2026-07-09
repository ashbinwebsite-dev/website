"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup as signupAction } from "@/lib/supabase/actions";
import { Loader2 } from "lucide-react";

type State = { error?: string; success?: boolean };

const initialState: State = {};

async function wrappedSignup(_prevState: State, formData: FormData): Promise<State> {
  return await signupAction(formData);
}

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(wrappedSignup, initialState);

  if (state?.success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#A8E4A0]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-[#222222]"
              >
                <path
                  d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground mb-2">
            Check Your Email
          </h1>
          <p className="text-sm text-foreground/60 leading-7">
            We&rsquo;ve sent a confirmation link to your email address. Please
            check your inbox and confirm your account before signing in.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-sm uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.35em] text-foreground/50 font-heading hover:text-foreground transition-colors duration-300"
          >
            ashbin kafle
          </Link>
          <h1 className="mt-8 text-3xl font-heading leading-[1.02] tracking-[-0.035em] text-foreground">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Set up your portfolio admin account
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="full_name"
              className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading"
            >
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              placeholder="Ashbin Kafle"
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/35 transition-all duration-200 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/35 transition-all duration-200 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="•••••••• (min. 6 characters)"
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/35 transition-all duration-200 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>

          {state?.error && (
            <p className="text-xs text-rose-500/90" role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[#A8E4A0] px-8 py-3.5 text-sm uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {pending && <Loader2 size={14} className="animate-spin" />}
            {pending ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-foreground/50">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-foreground/70 hover:text-foreground transition-colors duration-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
