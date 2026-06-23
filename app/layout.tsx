import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/lenis/LenisProvider";

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
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
