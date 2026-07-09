import Link from "next/link";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-2xl font-heading tracking-[-0.04em] text-foreground">
          Authentication Error
        </h1>
        <p className="text-sm leading-7 text-foreground/70">
          Something went wrong during authentication. Please try again.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center rounded-full bg-[#A8E4A0] px-7 py-3 text-sm uppercase tracking-[0.24em] text-[#222222] font-heading transition-all duration-300 hover:-translate-y-0.5"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
