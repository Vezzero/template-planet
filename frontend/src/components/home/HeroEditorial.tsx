import { HeroSearchEditorial } from "./HeroSearchEditorial";
import { HeroFloatingWords } from "./HeroFloatingWords";

type Props = {
  totalTemplates: number;
  categoriesCount: number;
  initialQuery?: string;
};

export function HeroEditorial({ totalTemplates, categoriesCount, initialQuery }: Props) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--ink)",
        color: "var(--paper)",
      }}
      aria-label="Hero"
    >
      {/* Subtle grain */}
      <div className="grain" aria-hidden="true" />

      {/* Floating background words (scramble in/out) */}
      <HeroFloatingWords />

      <div
        className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center"
        style={{ minHeight: "70svh", paddingTop: "8vh", paddingBottom: "6vh" }}
      >
        {/* Light title */}
        <h1
          className="fade-up font-serif font-normal mb-4"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            lineHeight: 1.05,
            color: "var(--paper)",
            letterSpacing: "-0.02em",
            animationDelay: "0.2s",
          }}
        >
          Quale base meme{" "}
          <em
            style={{
              fontStyle: "italic",
              color: "var(--acid)",
              fontWeight: 400,
            }}
          >
            stai cercando?
          </em>
        </h1>

        <p
          className="fade-up font-serif text-base md:text-lg mb-10 max-w-lg"
          style={{
            color: "var(--ghost)",
            lineHeight: 1.5,
            animationDelay: "0.3s",
          }}
        >
          Scrivi il titolo, un tag, un riferimento. Oppure carica un meme e l&apos;AI trova
          la base per te.
        </p>

        {/* Search */}
        <div className="w-full fade-up" style={{ animationDelay: "0.4s" }}>
          <HeroSearchEditorial initialQuery={initialQuery} />
        </div>

        {/* Stats inline */}
        <div
          className="fade-up mt-10 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: "var(--ghost)", animationDelay: "0.5s" }}
        >
          <span>
            <strong style={{ color: "var(--paper)", fontWeight: 600 }}>{totalTemplates}</strong>{" "}
            template
          </span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>
            <strong style={{ color: "var(--paper)", fontWeight: 600 }}>{categoriesCount}</strong>{" "}
            categorie
          </span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>
            <strong style={{ color: "var(--acid)", fontWeight: 600 }}>100%</strong> gratis
          </span>
        </div>
      </div>
    </section>
  );
}
