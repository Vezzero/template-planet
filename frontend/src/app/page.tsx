import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getMemes, getCategories, getPopularTags } from "@/lib/queries";
import { MemeGrid } from "@/components/meme/MemeGrid";
import { HomeTabs } from "@/components/home/HomeTabs";
import { Sidebar } from "@/components/home/Sidebar";
import { HeroEditorial } from "@/components/home/HeroEditorial";
import type { SortOption } from "@/types";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ sort?: string; category?: string; q?: string }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sort = (params.sort as SortOption) || "trending";
  const session = await auth();

  const [{ memes, total }, categories, popularTags] = await Promise.all([
    getMemes({ sort, page: 1, userId: session?.user?.id, search: params.q }),
    getCategories(),
    getPopularTags(15),
  ]);

  return (
    <div>
      {/* ── HERO ────────────────────────────────────────────── */}
      <HeroEditorial
        totalTemplates={total}
        categoriesCount={categories.length}
        initialQuery={params.q}
      />

      {/* ── § 02 / CATALOGO ─────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 pt-24 pb-32">
        {/* Section header */}
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            {/* Left: title block */}
            <div className="flex-1 max-w-xl">
              <h2
                className="font-serif italic font-normal mb-3"
                style={{
                  fontSize: "clamp(2rem, 4.2vw, 3rem)",
                  lineHeight: 1.05,
                  color: "var(--paper)",
                  letterSpacing: "-0.015em",
                }}
              >
                Le basi più cercate.
              </h2>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "15px",
                  color: "var(--ghost)",
                  lineHeight: 1.5,
                }}
              >
                ordina, filtra, copia il link. è tutto gratis.
              </p>
            </div>

            {/* Right: separator + tabs */}
            <div className="flex items-stretch gap-8">
              <div
                className="hidden lg:block"
                style={{
                  width: "1px",
                  backgroundColor: "var(--ghost)",
                  opacity: 0.3,
                }}
                aria-hidden="true"
              />
              <div className="flex items-end">
                <Suspense
                  fallback={<div className="h-6 w-64 skeleton" />}
                >
                  <HomeTabs current={sort} />
                </Suspense>
              </div>
            </div>
          </div>
        </header>

        {/* Category pills */}
        <div
          className="flex items-stretch gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4"
          role="list"
        >
          <Link
            href="/"
            role="listitem"
            className="shrink-0 py-2.5 px-4 font-mono uppercase tracking-[0.15em] transition-all hover:[border-color:var(--paper)] hover:[background-color:rgba(245,241,232,0.04)]"
            style={{
              fontSize: "11px",
              border: "1px solid rgba(90, 86, 78, 0.4)",
              backgroundColor: "transparent",
              color: "var(--paper)",
            }}
          >
            tutte
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              role="listitem"
              className="shrink-0 py-2.5 px-4 font-mono uppercase tracking-[0.15em] transition-all flex items-center gap-2 hover:[border-color:var(--paper)] hover:[background-color:rgba(245,241,232,0.04)]"
              style={{
                fontSize: "11px",
                border: "1px solid rgba(90, 86, 78, 0.4)",
                backgroundColor: "transparent",
                color: "var(--paper)",
              }}
            >
              <span>{cat.iconEmoji}</span>
              <span>{cat.name}</span>
              {cat._count.bases > 0 && (
                <span style={{ color: "var(--ghost)", opacity: 0.6 }}>
                  ({cat._count.bases})
                </span>
              )}
            </Link>
          ))}

          {/* Vertical separator */}
          <div
            className="shrink-0 self-center mx-2"
            style={{
              width: "1px",
              height: "30px",
              backgroundColor: "var(--ghost)",
              opacity: 0.3,
            }}
            aria-hidden="true"
          />

          {/* Classifiche pill - acid treatment */}
          <Link
            href="/classifiche"
            role="listitem"
            className="pill-classifiche shrink-0 py-2.5 px-4 font-mono uppercase tracking-[0.15em] transition-all flex items-center gap-2 hover:[background-color:rgba(212,255,0,0.08)]"
            style={{
              fontSize: "11px",
              border: "1px solid var(--acid)",
              backgroundColor: "transparent",
              color: "var(--acid)",
            }}
          >
            <span>classifiche</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Grid + sidebar */}
        <div className="flex gap-16 pt-4">
          <div className="flex-1 min-w-0">
            {params.q && (
              <div
                className="mb-6 pb-4"
                style={{ borderBottom: "1px solid rgba(90, 86, 78, 0.3)" }}
              >
                <p
                  className="font-mono uppercase tracking-[0.15em]"
                  style={{ fontSize: "11px", color: "var(--ghost)" }}
                >
                  <span style={{ color: "var(--paper)" }}>
                    {memes.length}
                  </span>{" "}
                  risultati per{" "}
                  <span
                    className="font-serif italic normal-case"
                    style={{
                      color: "var(--acid)",
                      letterSpacing: 0,
                      fontSize: "13px",
                    }}
                  >
                    &ldquo;{params.q}&rdquo;
                  </span>
                  <Link
                    href="/"
                    className="ml-5 transition-colors hover:[color:var(--paper)]"
                    style={{ color: "var(--ghost)" }}
                  >
                    × rimuovi
                  </Link>
                </p>
              </div>
            )}

            <MemeGrid
              initialMemes={memes as any}
              isLoggedIn={!!session}
              emptyMessage={
                params.q
                  ? `nessun risultato per "${params.q}".`
                  : "nessuna base qui ancora."
              }
            />
          </div>

          <div className="hidden lg:block w-64 shrink-0 pt-4">
            <Sidebar
              categories={categories as any}
              popularTags={popularTags as any}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
