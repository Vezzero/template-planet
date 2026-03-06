import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getMemes, getCategories } from "@/lib/queries";
import { MemeGrid } from "@/components/meme/MemeGrid";
import { SearchBar } from "@/components/cerca/SearchBar";
import { SearchFilters } from "@/components/cerca/SearchFilters";
import type { SortOption, FileTypeFilter } from "@/types";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Cerca basi meme" };

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: string;
    sort?: string;
  }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth();

  const [{ memes }, categories] = await Promise.all([
    getMemes({
      search: params.q,
      category: params.category,
      fileType: params.type as any,
      sort: (params.sort as SortOption) || "newest",
      userId: session?.user?.id,
    }),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-4 flex items-center gap-3">
          <Search className="h-7 w-7 text-amber-400" />
          Cerca basi meme
        </h1>
        <Suspense>
          <SearchBar initialQuery={params.q} />
        </Suspense>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          {params.q && (
            <p className="text-zinc-400 text-sm mb-4">
              {memes.length} risultati per{" "}
              <span className="text-white font-semibold">"{params.q}"</span>
            </p>
          )}
          <MemeGrid
            initialMemes={memes as any}
            isLoggedIn={!!session}
            emptyMessage={params.q ? `Nessun risultato per "${params.q}"` : "Usa la barra di ricerca"}
          />
        </div>

        <div className="hidden lg:block w-64 shrink-0">
          <Suspense>
            <SearchFilters categories={categories} currentParams={params as any} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
