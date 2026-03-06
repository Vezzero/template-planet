import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getMemes, getCategories, getPopularTags } from "@/lib/queries";
import { MemeGrid } from "@/components/meme/MemeGrid";
import { HomeTabs } from "@/components/home/HomeTabs";
import { Sidebar } from "@/components/home/Sidebar";
import { Button } from "@/components/ui/button";
import { Search, Upload, Zap, Trophy, ArrowRight } from "lucide-react";
import type { SortOption } from "@/types";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ sort?: string; category?: string }> };

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sort = (params.sort as SortOption) || "trending";
  const session = await auth();

  const [{ memes, total }, categories, popularTags] = await Promise.all([
    getMemes({ sort, page: 1, userId: session?.user?.id }),
    getCategories(),
    getPopularTags(15),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative text-center py-14 mb-10 overflow-hidden rounded-2xl">
        {/* Background layer */}
        <div className="absolute inset-0 dot-pattern opacity-40 rounded-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950 rounded-2xl" />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-400/10 blur-3xl rounded-full" />

        <div className="relative z-10 px-4">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-1.5 text-sm text-zinc-300 font-medium mb-6 shadow-sm">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Powered by Memefattori
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white mb-4 leading-[0.95] tracking-tight">
            La libreria di<br />
            <span className="gradient-text">basi meme</span><br />
            <span className="text-zinc-400 font-light text-4xl sm:text-5xl">italiana.</span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed mt-4">
            Template selezionati, taggati, approvati dalla community.
            Scarica gratis, usa ovunque.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/cerca">
              <Button size="lg" variant="secondary">
                <Search className="h-4 w-4" />
                Cerca una base
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="lg">
                <Upload className="h-4 w-4" />
                Carica la tua base
              </Button>
            </Link>
          </div>

          {/* Mini stats */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-zinc-600">
            <span><strong className="text-zinc-300">{total}+</strong> template</span>
            <span className="text-zinc-800">·</span>
            <span><strong className="text-zinc-300">{categories.length}</strong> categorie</span>
            <span className="text-zinc-800">·</span>
            <span><strong className="text-zinc-300">100%</strong> gratis</span>
          </div>
        </div>
      </section>

      {/* ── Category quick links ──────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm whitespace-nowrap hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all shrink-0"
          >
            <span>{cat.iconEmoji}</span>
            <span>{cat.name}</span>
            {cat._count.bases > 0 && (
              <span className="text-zinc-600 text-xs">({cat._count.bases})</span>
            )}
          </Link>
        ))}
        <Link
          href="/classifiche"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm whitespace-nowrap hover:bg-amber-400/20 transition-all shrink-0"
        >
          <Trophy className="h-3.5 w-3.5" />
          Classifiche
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <Suspense fallback={<div className="h-10 w-64 skeleton rounded-xl" />}>
              <HomeTabs current={sort} />
            </Suspense>
          </div>

          <MemeGrid
            initialMemes={memes as any}
            isLoggedIn={!!session}
            emptyMessage="Nessuna base trovata in questa sezione"
          />
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <Sidebar categories={categories as any} popularTags={popularTags as any} />
        </div>
      </div>
    </div>
  );
}
