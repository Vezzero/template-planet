"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Upload, Search, ChevronDown, LogOut, User, LayoutDashboard, Shield, Menu, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-amber-400 text-black font-black text-sm group-hover:bg-amber-300 transition-colors">
            BM
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-white text-lg leading-none">BasiMeme</span>
            <span className="block text-zinc-500 text-[10px] leading-none">.it</span>
          </div>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/cerca"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm hover:border-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Cerca basi meme...</span>
            <kbd className="ml-1 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-600">⌘K</kbd>
          </Link>
          <Link
            href="/classifiche"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 text-sm hover:text-amber-400 hover:bg-zinc-900 transition-colors ml-1"
          >
            <Trophy className="h-3.5 w-3.5" />
            Classifiche
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/upload">
                <Button size="sm" className="hidden sm:flex">
                  <Upload className="h-4 w-4" />
                  Carica
                </Button>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-zinc-800 transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.username}
                      width={28}
                      height={28}
                      className="rounded-full ring-1 ring-zinc-700"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-bold">
                      {session.user.username?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm text-white font-medium">
                    {session.user.username}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-52 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 overflow-hidden">
                      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href={`/u/${session.user.username}`} className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <User className="h-4 w-4" /> Profilo pubblico
                      </Link>
                      <Link href="/classifiche" className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Trophy className="h-4 w-4" /> Classifiche
                      </Link>
                      {(session.user.role === "ADMIN" || session.user.role === "MODERATOR") && (
                        <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 text-sm text-amber-400 hover:bg-zinc-800 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <Shield className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-zinc-800 my-1" />
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Esci
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/classifiche" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-zinc-400 text-sm hover:text-amber-400 transition-colors">
                <Trophy className="h-3.5 w-3.5" /> Classifiche
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Accedi</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Registrati</Button>
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 px-4 py-3 flex flex-col gap-2">
          <Link href="/cerca" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm" onClick={() => setMobileMenuOpen(false)}>
            <Search className="h-4 w-4" /> Cerca basi meme...
          </Link>
          <Link href="/classifiche" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 text-sm hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>
            <Trophy className="h-4 w-4" /> Classifiche
          </Link>
          {session && (
            <Link href="/upload" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full">
                <Upload className="h-4 w-4" /> Carica una base
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
