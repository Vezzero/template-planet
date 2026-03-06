import { cn } from "@/lib/utils";

export function TrendingBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-bold",
        "bg-orange-500/20 text-orange-300 border border-orange-500/30",
        "animate-pulse",
        className
      )}
    >
      🔥 Trending
    </span>
  );
}
