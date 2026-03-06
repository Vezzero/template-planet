import Link from "next/link";
import { CategoryPill } from "@/components/meme/CategoryPill";
import type { CategoryWithCount, TagWithCount } from "@/types";
import { formatNumber } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

type Props = {
  categories: CategoryWithCount[];
  popularTags: TagWithCount[];
};

export function Sidebar({ categories, popularTags }: Props) {
  return (
    <aside className="space-y-6">
      {/* Memefattori banner */}
      <a
        href="https://memefattori.it"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/30 p-4 hover:border-amber-400/50 transition-colors"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🧃</span>
          <div>
            <p className="font-bold text-white text-sm">Memefattori</p>
            <p className="text-xs text-zinc-400">Powered by</p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-zinc-500 ml-auto" />
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          La community italiana dei creatori di meme. Unisciti anche tu!
        </p>
      </a>

      {/* Categorie */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
        <h3 className="font-bold text-white mb-3 text-sm">Categorie</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-zinc-800 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{cat.iconEmoji}</span>
                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{cat.name}</span>
              </div>
              <span className="text-xs text-zinc-600 tabular-nums">
                {formatNumber(cat._count.bases)}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tag popolari */}
      {popularTags.length > 0 && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Tag popolari</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-xs hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700 hover:border-zinc-600"
              >
                #{tag.name}
                <span className="text-zinc-600">{formatNumber(tag._count.bases)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
