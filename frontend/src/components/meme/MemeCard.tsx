"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";
import type { MemeBaseWithRelations } from "@/types";

type Props = {
  meme: MemeBaseWithRelations;
  onUpvote?: (id: string, currentlyUpvoted: boolean) => Promise<void>;
  isLoggedIn?: boolean;
  index?: number;
};

export function MemeCard({ meme, onUpvote, isLoggedIn, index }: Props) {
  const [copied, setCopied] = useState(false);
  const [upvoted, setUpvoted] = useState(meme._userHasUpvoted ?? false);
  const [upvoteCount, setUpvoteCount] = useState(meme.upvotesCount);
  const [upvoting, setUpvoting] = useState(false);
  const [upvoteBounce, setUpvoteBounce] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      window.location.href = "/auth/login";
      return;
    }
    if (!onUpvote || upvoting) return;
    setUpvoting(true);
    setUpvoteBounce(true);
    setTimeout(() => setUpvoteBounce(false), 400);
    const wasUpvoted = upvoted;
    setUpvoted(!wasUpvoted);
    setUpvoteCount((c) => (wasUpvoted ? c - 1 : c + 1));
    try {
      await onUpvote(meme.id, wasUpvoted);
    } catch {
      setUpvoted(wasUpvoted);
      setUpvoteCount((c) => (wasUpvoted ? c + 1 : c - 1));
    } finally {
      setUpvoting(false);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(
      `${window.location.origin}/base/${meme.slug}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const thumbnailSrc = meme.thumbnailUrl || meme.fileUrl;
  const cardIndex = (index ?? 0) + 1;
  const indexLabel = String(cardIndex).padStart(2, "0");

  return (
    <>
      <Link
        href={`/base/${meme.slug}`}
        className="meme-card-root group block"
        data-cursor-hover
      >
        <article>
          {/* Media */}
          <div className="meme-card-media relative aspect-[4/5] overflow-hidden">
            {meme.fileType === "VIDEO" ? (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: "var(--shadow)" }}
              >
                <div
                  className="h-14 w-14 rounded-full flex items-center justify-center"
                  style={{ border: "1px solid var(--paper)" }}
                >
                  <Play
                    className="h-5 w-5 ml-0.5"
                    style={{ color: "var(--paper)", fill: "var(--paper)" }}
                  />
                </div>
              </div>
            ) : (
              <Image
                src={thumbnailSrc}
                alt={meme.title}
                fill
                className="meme-card-img object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                unoptimized={meme.fileType === "GIF"}
              />
            )}

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="copy-btn absolute top-3 right-3 z-[2] font-mono uppercase tracking-[0.15em] px-2 py-1"
              style={{
                fontSize: "9px",
                color: "var(--paper)",
                backgroundColor: "rgba(10, 9, 8, 0.75)",
                border: "1px solid rgba(245, 241, 232, 0.2)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                transition: "border-color 200ms ease, color 200ms ease",
              }}
              aria-label="copia link"
            >
              {copied ? "✓ copiato" : "↗ copia"}
            </button>

            {/* Hover overlay */}
            <div
              className="meme-card-overlay absolute inset-0 flex items-end p-4"
              style={{ backgroundColor: "rgba(10, 9, 8, 0.62)" }}
            >
              <div className="space-y-2">
                <p
                  className="font-mono uppercase tracking-[0.2em]"
                  style={{
                    fontSize: "9px",
                    color: "rgba(245, 241, 232, 0.7)",
                  }}
                >
                  @{meme.author.username} · {timeAgo(meme.createdAt)}
                </p>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {meme.tags.slice(0, 5).map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="font-mono"
                      style={{
                        fontSize: "9px",
                        color: "rgba(245, 241, 232, 0.7)",
                      }}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="font-mono uppercase tracking-[0.2em] shrink-0"
                style={{ fontSize: "9px", color: "var(--ghost)" }}
              >
                {indexLabel} /
              </span>
              <h3
                className="meme-card-title font-serif line-clamp-1 flex-1 min-w-0"
                style={{
                  fontSize: "16px",
                  color: "var(--paper)",
                  lineHeight: 1.3,
                  transition: "color 200ms ease",
                }}
              >
                {meme.title.toLowerCase()}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {meme.category && (
                <>
                  <span
                    className="font-mono uppercase tracking-[0.15em]"
                    style={{ fontSize: "10px", color: "var(--ghost)" }}
                  >
                    {meme.category.name}
                  </span>
                  <span
                    className="inline-block rounded-full"
                    style={{
                      width: "2px",
                      height: "2px",
                      backgroundColor: "var(--ghost)",
                    }}
                    aria-hidden="true"
                  />
                </>
              )}
              <button
                type="button"
                onClick={handleUpvote}
                className="upvote-btn inline-flex items-center gap-1 font-mono"
                style={{
                  fontSize: "11px",
                  color: upvoted ? "var(--acid)" : "var(--ghost)",
                  transition: "color 200ms ease",
                }}
                aria-label={upvoted ? "rimuovi voto" : "vota"}
              >
                <span
                  style={{
                    fontSize: "10px",
                    display: "inline-block",
                    transform: upvoteBounce ? "scale(1.4)" : "scale(1)",
                    transition: "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  ▲
                </span>
                {formatNumber(upvoteCount)}
              </button>
            </div>
          </div>
        </article>
      </Link>

      <style jsx>{`
        .meme-card-root :global(.meme-card-media) {
          background-color: var(--shadow);
          border: 1px solid rgba(90, 86, 78, 0.35);
          transition: border-color 240ms ease;
        }
        .meme-card-root:hover :global(.meme-card-media) {
          border-color: var(--paper);
        }
        .meme-card-root :global(.meme-card-img) {
          filter: contrast(1.05) saturate(0.92);
          transition: filter 400ms ease;
        }
        .meme-card-root:hover :global(.meme-card-img) {
          filter: contrast(1.08) saturate(1.05);
        }
        .meme-card-root :global(.meme-card-overlay) {
          opacity: 0;
          transition: opacity 300ms ease;
          pointer-events: none;
        }
        .meme-card-root:hover :global(.meme-card-overlay) {
          opacity: 1;
        }
        .meme-card-root :global(.copy-btn):hover {
          border-color: var(--paper) !important;
        }
      `}</style>
    </>
  );
}
