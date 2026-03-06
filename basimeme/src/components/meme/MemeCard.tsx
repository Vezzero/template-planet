"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Download, Eye, Copy, Check, Play } from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";
import { TrendingBadge } from "./TrendingBadge";
import { FileTypeBadge } from "./FileTypeBadge";
import type { MemeBaseWithRelations } from "@/types";

type Props = {
  meme: MemeBaseWithRelations;
  onUpvote?: (id: string, currentlyUpvoted: boolean) => Promise<void>;
  isLoggedIn?: boolean;
};

export function MemeCard({ meme, onUpvote, isLoggedIn }: Props) {
  const [copied, setCopied] = useState(false);
  const [upvoted, setUpvoted] = useState(meme._userHasUpvoted ?? false);
  const [upvoteCount, setUpvoteCount] = useState(meme.upvotesCount);
  const [upvoting, setUpvoting] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) { window.location.href = "/auth/login"; return; }
    if (!onUpvote || upvoting) return;
    setUpvoting(true);
    const wasUpvoted = upvoted;
    setUpvoted(!wasUpvoted);
    setUpvoteCount((c) => wasUpvoted ? c - 1 : c + 1);
    try {
      await onUpvote(meme.id, wasUpvoted);
    } catch {
      setUpvoted(wasUpvoted);
      setUpvoteCount((c) => wasUpvoted ? c + 1 : c - 1);
    } finally {
      setUpvoting(false);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(`${window.location.origin}/base/${meme.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const thumbnailSrc = meme.thumbnailUrl || meme.fileUrl;

  return (
    <Link href={`/base/${meme.slug}`} className="group block">
      <article className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden card-hover hover:border-zinc-700">
        {/* ── Thumbnail ── */}
        <div className="relative aspect-video bg-zinc-950 overflow-hidden">
          {meme.fileType === "VIDEO" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
              <div className="h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Play className="h-5 w-5 text-white fill-white ml-0.5" />
              </div>
            </div>
          ) : (
            <Image
              src={thumbnailSrc}
              alt={meme.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={meme.fileType === "GIF"}
            />
          )}

          {/* Hover overlay — show tags */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
            <div className="flex flex-wrap gap-1">
              {meme.tags.slice(0, 3).map(({ tag }) => (
                <span key={tag.id} className="text-[10px] text-white/80 bg-black/50 px-1.5 py-0.5 rounded-md border border-white/10">
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* Badges top-left */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            <FileTypeBadge fileType={meme.fileType} />
            {meme.isTrending && <TrendingBadge />}
          </div>

          {/* Category pill top-right */}
          {meme.category && (
            <div
              className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border"
              style={{
                color: meme.category.color,
                borderColor: `${meme.category.color}40`,
                background: `${meme.category.color}15`,
              }}
              onClick={(e) => { e.preventDefault(); window.location.href = `/categoria/${meme.category!.slug}`; }}
            >
              {meme.category.iconEmoji}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-3">
          <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-2.5 group-hover:text-amber-400 transition-colors duration-150">
            {meme.title}
          </h3>

          {/* Stats row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />{formatNumber(meme.viewsCount)}
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />{formatNumber(meme.downloadsCount)}
              </span>
            </div>

            <div className="flex items-center gap-0.5" onClick={(e) => e.preventDefault()}>
              <button
                className={`h-7 px-2 flex items-center gap-1 rounded-lg text-xs border transition-all ${
                  upvoted
                    ? "text-amber-400 bg-amber-400/10 border-amber-400/25 font-semibold"
                    : "text-zinc-500 border-transparent hover:text-amber-400 hover:bg-amber-400/5"
                }`}
                onClick={handleUpvote}
                title="Upvota"
              >
                <Heart className={`h-3.5 w-3.5 transition-transform ${upvoted ? "fill-current scale-110" : ""}`} />
                <span>{formatNumber(upvoteCount)}</span>
              </button>

              <button
                className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 transition-colors"
                onClick={handleCopy}
                title="Copia link"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Author */}
          <div className="mt-2.5 pt-2.5 border-t border-zinc-800/60 flex items-center gap-2">
            {meme.author.image ? (
              <Image src={meme.author.image} alt={meme.author.username} width={18} height={18} className="rounded-full" />
            ) : (
              <div className="h-4.5 w-4.5 h-[18px] w-[18px] rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-bold">
                {meme.author.username[0].toUpperCase()}
              </div>
            )}
            <span className="text-[11px] text-zinc-500 truncate flex-1">
              <Link href={`/u/${meme.author.username}`} className="hover:text-zinc-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                @{meme.author.username}
              </Link>
            </span>
            <span className="text-[11px] text-zinc-700 shrink-0">{timeAgo(meme.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
