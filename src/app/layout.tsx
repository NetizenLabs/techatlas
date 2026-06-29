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
        <header className="border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">
              TechAtlas
            </Link>
            <nav className="flex gap-6 text-sm font-medium text-gray-500">
              <Link href="/person" className="hover:text-gray-900 transition-colors">People</Link>
              <Link href="/company" className="hover:text-gray-900 transition-colors">Companies</Link>
              <Link href="/topic" className="hover:text-gray-900 transition-colors">Topics</Link>
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
