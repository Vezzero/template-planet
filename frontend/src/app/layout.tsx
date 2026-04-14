import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BasiMeme.it - La libreria italiana di template meme",
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
    title: "BasiMeme.it - La libreria italiana di template meme",
    description: "Trova, condividi e scarica le migliori basi meme italiane.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BasiMeme.it",
    description: "La libreria italiana di template meme powered by Memefattori.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="it" className="dark">
      <body
        className={`${bricolage.variable} ${fraunces.variable} ${jetbrains.variable} antialiased min-h-screen flex flex-col`}
        style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
      >
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
