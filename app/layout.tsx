import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/lenis/LenisProvider";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Ashbin Kafle — Artist",
  description:
    "A premium portfolio experience for artist Ashbin Kafle. Minimal, editorial, and immersive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-background text-foreground font-sans">
        <QueryProvider>
          <LenisProvider>{children}</LenisProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
