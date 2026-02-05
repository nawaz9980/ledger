import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Staffs Bill Management",
  description: "Premium bill management for modern companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased min-h-screen flex flex-col bg-slate-50 font-sans`}
      >
        <Navbar />
        <main className="flex-1 container py-6 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  );
}
