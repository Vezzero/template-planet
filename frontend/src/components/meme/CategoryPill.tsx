import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  slug: string;
  iconEmoji?: string;
  color?: string;
  size?: "sm" | "md";
  asLink?: boolean;
  className?: string;
};

export function CategoryPill({
  name, slug, iconEmoji = "📁", color = "#f59e0b",
  size = "md", asLink = true, className,
}: Props) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium border transition-colors",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        asLink && "hover:opacity-80 cursor-pointer",
        className
      )}
      style={{
        backgroundColor: `${color}18`,
        borderColor: `${color}40`,
        color: color,
      }}
    >
      <span>{iconEmoji}</span>
      {name}
    </span>
  );

  if (!asLink) return content;
  return <Link href={`/categoria/${slug}`}>{content}</Link>;
}
