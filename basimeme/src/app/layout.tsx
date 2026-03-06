import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "BasiMeme.it — La libreria italiana di template meme",
    template: "%s | BasiMeme.it",
  },
  description:
    "Trova, condividi e scarica le migliori basi meme italiane. La libreria di template meme powered by Memefattori.",
  keywords: ["meme", "basi meme", "template meme", "meme italiani", "memefattori"],
  authors: [{ name: "Memefattori" }],
  creator: "Memefattori",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://basimeme.it",
    siteName: "BasiMeme.it",
    title: "BasiMeme.it — La libreria italiana di template meme",
    description: "Trova, condividi e scarica le migliori basi meme italiane.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BasiMeme.it",
    description: "La libreria italiana di template meme powered by Memefattori.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark">
      <body className={`${inter.variable} bg-zinc-950 text-white antialiased min-h-screen flex flex-col`}>
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
