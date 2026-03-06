"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Flame, Clock, Trophy } from "lucide-react";

const tabs = [
  { value: "trending", label: "Trending", icon: Flame },
  { value: "newest", label: "Nuovi", icon: Clock },
  { value: "top", label: "Top di sempre", icon: Trophy },
] as const;

export function HomeTabs({ current }: { current: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const setTab = (value: string) => {
    const p = new URLSearchParams(params.toString());
    p.set("sort", value);
    router.push(`/?${p.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800 w-fit">
      {tabs.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTab(value)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
            current === value
              ? "bg-amber-400 text-black shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
