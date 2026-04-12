import Link from "next/link";
import type { CategoryWithCount, TagWithCount } from "@/types";
import { formatNumber } from "@/lib/utils";

type Props = {
  categories: CategoryWithCount[];
  popularTags: TagWithCount[];
};

export function Sidebar({ categories, popularTags }: Props) {
  return (
    <aside className="space-y-12">
      {/* Editorial quote */}
      <blockquote
        className="pl-5 font-serif italic"
        style={{
          borderLeft: "2px solid var(--acid)",
          fontSize: "15px",
          color: "var(--paper)",
          lineHeight: 1.5,
        }}
      >
        &ldquo;Il meme è la poesia del presente.&rdquo;
        <footer
          className="mt-3 font-mono uppercase tracking-[0.2em]"
          style={{ fontSize: "9px", color: "var(--ghost)", fontStyle: "normal" }}
        >
          / memefattori, 2024
        </footer>
      </blockquote>

      {/* Categories */}
      <div>
        <h3
          className="font-mono uppercase tracking-[0.2em] mb-4 pb-3"
          style={{
            fontSize: "10px",
            color: "var(--ghost)",
            borderBottom: "1px solid rgba(90, 86, 78, 0.3)",
          }}
        >
          § categorie
        </h3>
        <ul className="space-y-2.5">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/categoria/${cat.slug}`}
                className="group flex items-baseline justify-between gap-3"
              >
                <span
                  className="font-serif italic transition-colors group-hover:[color:var(--acid)]"
                  style={{ fontSize: "14px", color: "var(--paper)" }}
                >
                  {cat.iconEmoji} {cat.name}
                </span>
                <span
                  className="font-mono tabular-nums shrink-0"
                  style={{ fontSize: "10px", color: "var(--ghost)" }}
                >
                  {formatNumber(cat._count.bases).padStart(3, "0")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tag cloud */}
      {popularTags.length > 0 && (
        <div>
          <h3
            className="font-mono uppercase tracking-[0.2em] mb-4 pb-3"
            style={{
              fontSize: "10px",
              color: "var(--ghost)",
              borderBottom: "1px solid rgba(90, 86, 78, 0.3)",
            }}
          >
            § tag popolari
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {popularTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="py-1 px-2 font-mono uppercase tracking-[0.1em] transition-all hover:[border-color:var(--paper)] hover:[background-color:rgba(245,241,232,0.04)]"
                style={{
                  fontSize: "10px",
                  border: "1px solid rgba(90, 86, 78, 0.4)",
                  color: "var(--paper)",
                }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
