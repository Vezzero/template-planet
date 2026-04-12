"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Upload, X, Loader2, ImageIcon, Sparkles } from "lucide-react";

type Tab = "text" | "image";

type Props = {
  initialQuery?: string;
};

export function HomeSearch({ initialQuery }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>("text");
  const [query, setQuery] = useState(initialQuery ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  // Debounced text search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== (initialQuery ?? "")) {
        const p = new URLSearchParams(params.toString());
        if (query) p.set("q", query); else p.delete("q");
        p.delete("sort"); // reset sort on new search
        router.push(`/?${p.toString()}`);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleImageDrop = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    setImageResult(null);
    setImageError(null);
    setImagePreview(URL.createObjectURL(file));
    setImageLoading(true);

    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/search-by-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) {
        setImageError(data.error ?? "Errore AI");
      } else {
        setImageResult(data.query);
        // auto-search
        const p = new URLSearchParams();
        p.set("q", data.query);
        router.push(`/?${p.toString()}`);
      }
    } catch {
      setImageError("Errore di connessione");
    } finally {
      setImageLoading(false);
    }
  }, [router, params]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageDrop(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageDrop(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageResult(null);
    setImageError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const useImageQuery = () => {
    if (!imageResult) return;
    setTab("text");
    setQuery(imageResult);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-3 bg-zinc-900/80 border border-zinc-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => { setTab("text"); setTimeout(() => textRef.current?.focus(), 50); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            tab === "text"
              ? "bg-amber-400 text-black shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          Testo
        </button>
        <button
          onClick={() => setTab("image")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            tab === "image"
              ? "bg-amber-400 text-black shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Immagine AI
        </button>
      </div>

      {/* Text search */}
      {tab === "text" && (
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
          </div>
          <input
            ref={textRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per titolo, tag, descrizione..."
            autoFocus
            className="w-full h-14 pl-11 pr-12 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-base focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Image search */}
      {tab === "image" && (
        <div className="space-y-3">
          {!imagePreview ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`relative h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                dragOver
                  ? "border-amber-400 bg-amber-400/5"
                  : "border-zinc-700 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-900"
              }`}
            >
              <div className={`p-3 rounded-full transition-colors ${dragOver ? "bg-amber-400/10" : "bg-zinc-800"}`}>
                <ImageIcon className={`h-6 w-6 ${dragOver ? "text-amber-400" : "text-zinc-500"}`} />
              </div>
              <div className="text-center">
                <p className="text-sm text-zinc-300 font-medium">Carica un meme o template</p>
                <p className="text-xs text-zinc-500 mt-0.5">Trascina qui o clicca per scegliere</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
              {/* Preview */}
              <div className="flex gap-4 p-4 items-start">
                <div className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  {imageLoading && (
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Analizzo l'immagine con AI...</span>
                    </div>
                  )}
                  {imageResult && !imageLoading && (
                    <div className="space-y-2">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Trovato dal AI</p>
                      <p className="text-white font-semibold text-sm">"{imageResult}"</p>
                      <button
                        onClick={useImageQuery}
                        className="text-xs px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-colors font-medium"
                      >
                        Cerca con questa query
                      </button>
                    </div>
                  )}
                  {imageError && !imageLoading && (
                    <div className="space-y-1">
                      <p className="text-red-400 text-sm font-medium">Errore</p>
                      <p className="text-zinc-500 text-xs">{imageError}</p>
                    </div>
                  )}
                  {!imageLoading && !imageResult && !imageError && (
                    <p className="text-zinc-400 text-sm">Immagine caricata</p>
                  )}
                </div>
                <button
                  onClick={clearImage}
                  className="shrink-0 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          <p className="text-xs text-zinc-600 text-center">
            Carica un'immagine meme - l'AI troverà le basi più simili
          </p>
        </div>
      )}
    </div>
  );
}
