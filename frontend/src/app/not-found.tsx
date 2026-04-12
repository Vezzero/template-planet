import Link from "next/link";
import { NotFoundPong } from "@/components/ui/animated-pong-404";

export const metadata = {
  title: "404 - Pagina non trovata",
  description: "La pagina che cerchi non esiste piu.",
};

export default function NotFound() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "calc(100svh - 64px)",
        backgroundColor: "var(--ink)",
      }}
      aria-label="404 - Pagina non trovata"
    >
      <NotFoundPong />

      {/* Top-left meta */}
      <div
        className="absolute top-6 left-6 z-10 font-mono uppercase tracking-[0.2em] flex items-center gap-2 pointer-events-none"
        style={{ fontSize: "10px", color: "var(--ghost)" }}
      >
        <span style={{ color: "var(--acid)" }}>│</span>
        ERR / 404 / NOT FOUND
      </div>

      {/* Top-right meta */}
      <div
        className="absolute top-6 right-6 z-10 font-mono uppercase tracking-[0.2em] pointer-events-none"
        style={{ fontSize: "10px", color: "var(--ghost)" }}
      >
        BASIMEME / LIB. ITA N° 001
      </div>

      {/* Center bottom CTA */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10">
        <Link
          href="/"
          className="cta-404 font-mono uppercase tracking-[0.2em] px-5 py-3 border inline-flex items-center gap-2 transition-all"
          style={{
            fontSize: "11px",
            color: "var(--paper)",
            borderColor: "var(--ghost)",
            backgroundColor: "rgba(10, 9, 8, 0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          ← torna a basimeme
        </Link>
      </div>

      {/* Bottom-left page marker */}
      <div
        className="absolute bottom-6 left-6 z-10 font-mono uppercase tracking-[0.2em] pointer-events-none"
        style={{ fontSize: "10px", color: "var(--ghost)" }}
      >
        404 / 999
      </div>

      {/* Bottom-right hint */}
      <div
        className="absolute bottom-6 right-6 z-10 font-mono uppercase tracking-[0.2em] pointer-events-none"
        style={{ fontSize: "10px", color: "var(--ghost)" }}
      >
        ● autoplay pong
      </div>
    </section>
  );
}
