"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login as loginAction } from "@/lib/supabase/actions";
import { Loader2 } from "lucide-react";

type State = { error?: string; success?: boolean };

const initialState: State = {};

async function wrappedLogin(_prevState: State, formData: FormData): Promise<State> {
  return await loginAction(formData);
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(wrappedLogin, initialState);

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
            Sign In
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Sign in to manage your portfolio
          </p>
        </div>

        <form action={formAction} className="space-y-5">
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
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/35 transition-all duration-200 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
            />
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors duration-300"
            >
              Forgot password?
            </Link>
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
            {pending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-foreground/50">
          Accounts are created by invitation only.
        </p>
      </div>
    </div>
  );
}
