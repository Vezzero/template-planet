"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export function SearchBar({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(initialQuery ?? "");

  const search = useCallback(
    (q: string) => {
      const p = new URLSearchParams(params.toString());
      if (q) p.set("q", q); else p.delete("q");
      router.push(`/cerca?${p.toString()}`);
    },
    [router, params]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== initialQuery) search(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative max-w-2xl">
      <Input
        leftIcon={<Search className="h-4 w-4" />}
        rightIcon={
          query ? (
            <button onClick={() => setQuery("")} className="hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          ) : undefined
        }
        placeholder="Cerca per titolo, tag, descrizione..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-12 text-base"
        autoFocus
      />
    </div>
  );
}
