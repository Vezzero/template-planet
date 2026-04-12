import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="relative mt-0"
      style={{
        borderTop: "1px solid var(--ghost)",
        backgroundColor: "var(--ink)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span
                className="font-serif italic leading-none"
                style={{ fontSize: "22px", color: "var(--paper)" }}
              >
                basimeme
              </span>
              <span
                className="inline-block rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "var(--acid)",
                }}
                aria-hidden="true"
              />
            </div>
            <p
              className="font-serif italic leading-relaxed mb-6 max-w-xs"
              style={{ fontSize: "14px", color: "var(--ghost)" }}
            >
              La libreria italiana di template meme. Trova, condividi e usa le migliori basi per i tuoi meme.
            </p>
            <p
              className="font-mono uppercase tracking-[0.2em]"
              style={{ fontSize: "10px", color: "var(--ghost)" }}
            >
              powered by{" "}
              <a
                href="https://memefattori.it"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:[color:var(--paper)] transition-colors"
                style={{ color: "var(--paper)" }}
              >
                memefattori
              </a>
            </p>
          </div>

          {/* Esplora */}
          <div>
            <h4
              className="font-mono uppercase tracking-[0.2em] mb-5 pb-2"
              style={{
                fontSize: "10px",
                color: "var(--ghost)",
                borderBottom: "1px solid rgba(90, 86, 78, 0.3)",
              }}
            >
              01 / esplora
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "catalogo" },
                { href: "/classifiche", label: "classifiche" },
                { href: "/upload", label: "carica una base" },
                { href: "/?sort=trending", label: "trending" },
                { href: "/?sort=newest", label: "nuove" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-serif italic transition-colors hover:[color:var(--acid)]"
                    style={{ fontSize: "14px", color: "var(--paper)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4
              className="font-mono uppercase tracking-[0.2em] mb-5 pb-2"
              style={{
                fontSize: "10px",
                color: "var(--ghost)",
                borderBottom: "1px solid rgba(90, 86, 78, 0.3)",
              }}
            >
              02 / info
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "about" },
                { href: "/termini", label: "termini di servizio" },
                { href: "/privacy", label: "privacy policy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-serif italic transition-colors hover:[color:var(--acid)]"
                    style={{ fontSize: "14px", color: "var(--paper)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:ciao@basimeme.it"
                  className="font-serif italic transition-colors hover:[color:var(--acid)]"
                  style={{ fontSize: "14px", color: "var(--paper)" }}
                >
                  contattaci
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(90, 86, 78, 0.3)" }}
        >
          <p
            className="font-mono uppercase tracking-[0.2em]"
            style={{ fontSize: "10px", color: "var(--ghost)" }}
          >
            © {new Date().getFullYear()} / basimeme.it / tutti i diritti riservati
          </p>
          <p
            className="font-mono uppercase tracking-[0.2em] flex items-center gap-1.5"
            style={{ fontSize: "10px", color: "var(--ghost)" }}
          >
            made with
            <span
              className="inline-block rounded-full"
              style={{ width: "6px", height: "6px", backgroundColor: "var(--acid)" }}
            />
            in italia
          </p>
        </div>
      </div>
    </footer>
  );
}
