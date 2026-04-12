"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp, Paperclip, Loader2, X } from "lucide-react";

type Props = {
  initialQuery?: string;
};

/**
 * ChatGPT-style search input.
 * Clean, rounded, centered, minimal.
 * Supports text search + image drop for AI search.
 */
export function HeroSearchEditorial({ initialQuery }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(initialQuery ?? "");
  const [focused, setFocused] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submit = useCallback(() => {
    const p = new URLSearchParams(params.toString());
    if (query.trim()) p.set("q", query.trim());
    else p.delete("q");
    p.delete("sort");
    router.push(`/?${p.toString()}`);
  }, [query, params, router]);

  const handleImage = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setImageLoading(true);
      setImageError(null);
      try {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("/api/search-by-image", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || data.error) {
          setImageError(data.error ?? "Errore AI");
        } else {
          const p = new URLSearchParams();
          p.set("q", data.query);
          router.push(`/?${p.toString()}`);
        }
      } catch {
        setImageError("Errore di connessione");
      } finally {
        setImageLoading(false);
      }
    },
    [router]
  );

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [query]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImage(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImage(file);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className="relative rounded-[28px] transition-all duration-200"
        style={{
          backgroundColor: "var(--shadow)",
          border: `1px solid ${
            dragOver ? "var(--acid)" : focused ? "rgba(245, 241, 232, 0.3)" : "rgba(245, 241, 232, 0.12)"
          }`,
          boxShadow: focused
            ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(212, 255, 0, 0.08)"
            : "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex items-end gap-2 px-4 py-3">
          {/* Upload button */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="shrink-0 p-2 rounded-full transition-colors hover:bg-white/5"
            style={{ color: "var(--ghost)" }}
            aria-label="carica un'immagine"
            title="Carica un meme per trovare la base con AI"
          >
            {imageLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--acid)" }} />
            ) : (
              <Paperclip className="h-5 w-5" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />

          {/* Textarea */}
          <textarea
            ref={inputRef}
            rows={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            placeholder="Cerca una base meme, o trascina qui un'immagine"
            className="flex-1 bg-transparent border-0 outline-none resize-none font-serif text-base md:text-[17px] leading-6 py-2"
            style={{
              color: "var(--paper)",
              caretColor: "var(--acid)",
              minHeight: "24px",
              maxHeight: "160px",
            }}
          />

          {/* Clear button */}
          {query && !imageLoading && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 p-2 rounded-full transition-colors hover:bg-white/5"
              style={{ color: "var(--ghost)" }}
              aria-label="cancella"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Submit button */}
          <button
            type="button"
            onClick={submit}
            disabled={!query.trim() && !imageLoading}
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
            style={{
              backgroundColor: query.trim() ? "var(--acid)" : "var(--ghost)",
              color: "var(--ink)",
            }}
            aria-label="cerca"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        {dragOver && (
          <div
            className="absolute inset-0 rounded-[28px] flex items-center justify-center pointer-events-none"
            style={{
              backgroundColor: "rgba(212, 255, 0, 0.08)",
              color: "var(--acid)",
            }}
          >
            <span className="font-mono text-xs uppercase tracking-widest">
              rilascia per cercare con AI
            </span>
          </div>
        )}
      </div>

      {imageError && (
        <p
          className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.15em]"
          style={{ color: "var(--blood)" }}
        >
          ! {imageError}
        </p>
      )}

      <p
        className="mt-3 text-center font-serif text-[13px] italic"
        style={{ color: "var(--ghost)" }}
      >
        scrivi, o trascina un meme - l&apos;AI trova la base
      </p>
    </div>
  );
}
