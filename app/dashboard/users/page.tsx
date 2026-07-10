"use client";

import { useActionState } from "react";
import { inviteUser } from "@/lib/supabase/actions";
import { Loader2, Mail, Check } from "lucide-react";

type State = { error?: string; success?: boolean };

const initialState: State = {};

async function wrappedInvite(_prevState: State, formData: FormData): Promise<State> {
  return await inviteUser(formData);
}

export default function UsersPage() {
  const [state, formAction, pending] = useActionState(wrappedInvite, initialState);

  if (state?.success) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground">
            Invite User
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Send an invitation to create an admin account
          </p>
        </div>

        <div className="max-w-lg rounded-xl border border-border/70 bg-white p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#A8E4A0]">
            <Check size={20} className="text-[#222222]" />
          </div>
          <h2 className="mt-4 text-lg font-heading tracking-[-0.02em] text-foreground">
            Invitation Sent
          </h2>
          <p className="mt-2 text-sm text-foreground/60 leading-7">
            An invitation email has been sent. The user will be able to create
            their account using the link in the email.
          </p>
          <form action={formAction}>
            <button
              type="submit"
              className="mt-8 inline-flex items-center rounded-full bg-[#A8E4A0] px-6 py-2.5 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e]"
            >
              Invite Another Person
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading tracking-[-0.03em] text-foreground">
          Invite User
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Send an email invitation to create an admin account
        </p>
      </div>

      <div className="max-w-lg">
        <div className="rounded-xl border border-border/70 bg-white p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#A8E4A0]/20 mb-5">
            <Mail size={18} className="text-foreground" />
          </div>

          <h2 className="text-sm font-heading tracking-[-0.02em] text-foreground mb-1">
            Invite a New Admin
          </h2>
          <p className="text-xs text-foreground/50 mb-6 leading-6">
            Enter the email address of the person you want to invite. They will
            receive an email with a link to set up their account.
          </p>

          <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
                placeholder="collaborator@example.com"
                className="w-full bg-background border border-[#DCEFD8] rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 transition-all duration-200 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15"
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
              className="inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-xs uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96d88e] disabled:opacity-60 disabled:cursor-not-allowed gap-2"
            >
              {pending && <Loader2 size={14} className="animate-spin" />}
              {pending ? "Sending Invitation..." : "Send Invitation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
