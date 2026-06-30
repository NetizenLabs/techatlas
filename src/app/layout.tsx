import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechAtlas | Tech Directory & Intelligence",
  description: "A structured directory of tech founders, AI tools, and companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-2 group">
              <svg className="w-6 h-6 group-hover:scale-105 transition-transform" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15" fill="#0f172a" />
                <circle cx="16" cy="16" r="10" stroke="url(#logo-glow)" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.8" />
                <path d="M16 8L21 21L16 18L11 21L16 8Z" fill="url(#logo-glow)" />
                <circle cx="16" cy="14" r="2" fill="#ffffff" />
                <defs>
                  <linearGradient id="logo-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2563eb" />
                    <stop offset="100%" stop-color="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
              <span>TechAtlas</span>
            </Link>
            <nav className="flex gap-6 text-sm font-semibold text-slate-500">
              <Link href="/news" className="hover:text-amber-600 transition-colors">News</Link>
              <Link href="/person" className="hover:text-indigo-600 transition-colors">People</Link>
              <Link href="/company" className="hover:text-blue-600 transition-colors">Companies</Link>
              <Link href="/topic" className="hover:text-emerald-600 transition-colors">Topics</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>

        <footer className="border-t border-gray-200 mt-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} TechAtlas. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
