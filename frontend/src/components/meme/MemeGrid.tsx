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

export function MemeGrid({
  initialMemes,
  fetchMore,
  isLoggedIn,
  emptyMessage,
}: Props) {
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
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (memes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p
          className="font-serif italic mb-1"
          style={{ fontSize: "24px", color: "var(--paper)", lineHeight: 1.4 }}
        >
          {emptyMessage ?? "nessuna base qui ancora."}
        </p>
        <p
          className="font-serif italic"
          style={{ fontSize: "16px", color: "var(--ghost)" }}
        >
          torna presto, o caricane una.
        </p>
        <span
          className="block mt-6"
          style={{
            width: "48px",
            height: "2px",
            backgroundColor: "var(--acid)",
          }}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
        {memes.map((meme, i) => (
          <div
            key={meme.id}
            className="fade-up"
            style={{ animationDelay: `${Math.min(i * 40, 800)}ms` }}
          >
            <MemeCard
              meme={meme}
              onUpvote={toggleUpvote}
              isLoggedIn={isLoggedIn}
              index={i}
            />
          </div>
        ))}
      </div>

      {fetchMore && (
        <div ref={loaderRef} className="flex justify-center py-16">
          {loading && (
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: "var(--acid)" }}
            />
          )}
          {!hasMore && memes.length > 0 && (
            <p
              className="font-serif italic"
              style={{ color: "var(--ghost)", fontSize: "15px" }}
            >
              hai visto tutto.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
