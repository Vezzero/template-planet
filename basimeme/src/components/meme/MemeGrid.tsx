"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MemeCard } from "./MemeCard";
import type { MemeBaseWithRelations } from "@/types";
import { Loader2 } from "lucide-react";

type Props = {
  initialMemes: MemeBaseWithRelations[];
  fetchMore?: (page: number) => Promise<MemeBaseWithRelations[]>;
  isLoggedIn?: boolean;
  emptyMessage?: string;
};

async function toggleUpvote(memeId: string, currentlyUpvoted: boolean) {
  const res = await fetch(`/api/upvote/${memeId}`, {
    method: currentlyUpvoted ? "DELETE" : "POST",
  });
  if (!res.ok) throw new Error("Upvote failed");
}

export function MemeGrid({ initialMemes, fetchMore, isLoggedIn, emptyMessage }: Props) {
  const [memes, setMemes] = useState<MemeBaseWithRelations[]>(initialMemes);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!!fetchMore);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMemes(initialMemes);
    setPage(1);
    setHasMore(!!fetchMore);
  }, [initialMemes, fetchMore]);

  const loadMore = useCallback(async () => {
    if (!fetchMore || loading || !hasMore) return;
    setLoading(true);
    try {
      const next = await fetchMore(page + 1);
      if (next.length === 0) {
        setHasMore(false);
      } else {
        setMemes((prev) => [...prev, ...next]);
        setPage((p) => p + 1);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchMore, loading, hasMore, page]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (memes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <span className="text-5xl mb-4">😶</span>
        <p className="text-lg font-medium">{emptyMessage ?? "Nessuna base trovata"}</p>
        <p className="text-sm mt-1">Prova a cambiare i filtri o carica la prima!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {memes.map((meme) => (
          <MemeCard
            key={meme.id}
            meme={meme}
            onUpvote={toggleUpvote}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>

      {fetchMore && (
        <div ref={loaderRef} className="flex justify-center py-8">
          {loading && <Loader2 className="h-6 w-6 animate-spin text-amber-400" />}
          {!hasMore && memes.length > 0 && (
            <p className="text-zinc-600 text-sm">Hai visto tutto! 🎉</p>
          )}
        </div>
      )}
    </div>
  );
}
