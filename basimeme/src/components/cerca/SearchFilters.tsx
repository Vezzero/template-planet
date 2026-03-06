"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { CategoryWithCount } from "@/types";

type Props = {
  categories: CategoryWithCount[];
  currentParams: { q?: string; category?: string; type?: string; sort?: string };
};

const FILE_TYPES = [
  { value: "", label: "Tutti i tipi" },
  { value: "IMAGE", label: "🖼️ Immagini" },
  { value: "GIF", label: "⚡ GIF" },
  { value: "VIDEO", label: "🎬 Video" },
  { value: "TEMPLATE", label: "🖋️ Template" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Più recenti" },
  { value: "top", label: "Più votate" },
  { value: "trending", label: "Trending" },
];

export function SearchFilters({ categories, currentParams }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.push(`/cerca?${p.toString()}`);
  };

  return (
    <div className="space-y-5">
      {/* Sort */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
        <h3 className="text-sm font-bold text-white mb-3">Ordina per</h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("sort", opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                (currentParams.sort ?? "newest") === opt.value
                  ? "bg-amber-400/10 text-amber-400 font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* File type */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
        <h3 className="text-sm font-bold text-white mb-3">Tipo</h3>
        <div className="space-y-1">
          {FILE_TYPES.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("type", opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                (currentParams.type ?? "") === opt.value
                  ? "bg-amber-400/10 text-amber-400 font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
        <h3 className="text-sm font-bold text-white mb-3">Categoria</h3>
        <div className="space-y-1">
          <button
            onClick={() => update("category", "")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !currentParams.category
                ? "bg-amber-400/10 text-amber-400 font-medium"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            Tutte
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => update("category", cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                currentParams.category === cat.slug
                  ? "bg-amber-400/10 text-amber-400 font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span>{cat.iconEmoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
