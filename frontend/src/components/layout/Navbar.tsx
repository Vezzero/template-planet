"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

const mockAuthEnabled = process.env.NEXT_PUBLIC_AUTH_MOCK_USER === "true";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!userBtnRef.current?.contains(e.target as Node)) setUserMenuOpen(false);
    };
    window.addEventListener("click", onDown);
    return () => window.removeEventListener("click", onDown);
  }, [userMenuOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: "catalogo" },
    { href: "/classifiche", label: "classifiche" },
    { href: "/upload", label: "upload" },
  ];

  const mobileLinks = [
    { href: "/", label: "catalogo", index: "01" },
    { href: "/classifiche", label: "classifiche", index: "02" },
    { href: "/upload", label: "upload", index: "03" },
    ...(session
      ? [
          { href: "/dashboard", label: "dashboard", index: "04" },
          { href: `/u/${session.user.username}`, label: "profilo", index: "05" },
        ]
      : [
          { href: "/auth/login", label: "entra con google", index: "04" },
        ]),
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          backgroundColor: scrolled ? "rgba(26, 25, 23, 0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(1.2)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.2)" : "none",
          borderBottom: `1px solid ${
            scrolled ? "rgba(90, 86, 78, 0.35)" : "rgba(90, 86, 78, 0.15)"
          }`,
          transition: "background-color 200ms ease, backdrop-filter 200ms ease, border-color 200ms ease",
        }}
      >
        <div className="px-6 md:px-12 h-16 flex items-center justify-between gap-6">
          {/* LEFT - Logo */}
          <Link href="/" className="flex items-baseline gap-2 shrink-0">
            <span
              className="font-serif italic leading-none"
              style={{ fontSize: "22px", color: "var(--paper)" }}
            >
              basimeme
            </span>
            <span
              className="inline-block rounded-full shrink-0 self-center"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "var(--acid)",
              }}
              aria-hidden="true"
            />
            <span
              className="hidden md:inline font-mono uppercase tracking-[0.2em] ml-3 self-center"
              style={{ fontSize: "9px", color: "var(--ghost)" }}
            >
              / LIB. ITA N° 001
            </span>
          </Link>

          {/* CENTER - Nav menu */}
          <nav className="hidden md:flex items-center gap-4">
            {links.map((link, i) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <div key={link.href} className="flex items-center gap-4">
                  <Link
                    href={link.href}
                    className="nav-link relative font-mono uppercase tracking-[0.2em] flex items-center gap-2 py-2"
                    style={{
                      fontSize: "11px",
                      color: isActive ? "var(--paper)" : "var(--ghost)",
                      transition: "color 200ms ease",
                    }}
                  >
                    {isActive && (
                      <span
                        className="inline-block rounded-full"
                        style={{
                          width: "4px",
                          height: "4px",
                          backgroundColor: "var(--acid)",
                        }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="nav-link-text">{link.label}</span>
                  </Link>
                  {i < links.length - 1 && (
                    <span
                      style={{ color: "var(--ghost)", opacity: 0.4, fontSize: "11px" }}
                      aria-hidden="true"
                    >
                      /
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* RIGHT - Auth + CTA */}
          <div className="flex items-center gap-4">
            {session ? (
              <div className="relative" ref={userBtnRef}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="avatar-btn flex items-center justify-center"
                  aria-label="menu utente"
                  aria-expanded={userMenuOpen}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "9999px",
                    border: `1px solid ${userMenuOpen ? "var(--acid)" : "var(--ghost)"}`,
                    overflow: "hidden",
                    transition: "border-color 200ms ease",
                  }}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.username}
                      width={30}
                      height={30}
                      className="block"
                    />
                  ) : (
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: "11px",
                        color: "var(--paper)",
                      }}
                    >
                      {session.user.username?.[0] ?? "U"}
                    </span>
                  )}
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-3 w-60"
                    style={{
                      backgroundColor: "var(--shadow)",
                      border: "1px solid var(--ghost)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="py-3 px-4"
                      style={{ borderBottom: "1px solid var(--ghost)" }}
                    >
                      <p
                        className="font-mono uppercase tracking-[0.2em] mb-0.5"
                        style={{ fontSize: "9px", color: "var(--ghost)" }}
                      >
                        / account
                      </p>
                      <p
                        className="font-serif italic"
                        style={{ fontSize: "14px", color: "var(--paper)" }}
                      >
                        @{session.user.username}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2.5 font-serif italic transition-colors hover:[background-color:rgba(245,241,232,0.04)]"
                      style={{ color: "var(--paper)", fontSize: "14px" }}
                    >
                      dashboard
                    </Link>
                    <Link
                      href={`/u/${session.user.username}`}
                      className="block px-4 py-2.5 font-serif italic transition-colors hover:[background-color:rgba(245,241,232,0.04)]"
                      style={{ color: "var(--paper)", fontSize: "14px" }}
                    >
                      i miei upload
                    </Link>
                    {(session.user.role === "ADMIN" ||
                      session.user.role === "MODERATOR") && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2.5 font-serif italic transition-colors hover:[background-color:rgba(245,241,232,0.04)]"
                        style={{ color: "var(--acid)", fontSize: "14px" }}
                      >
                        admin panel
                      </Link>
                    )}
                    <div style={{ borderTop: "1px solid var(--ghost)", opacity: 0.4 }} />
                    <button
                      type="button"
                      onClick={() => {
                        if (!mockAuthEnabled) signOut();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2.5 font-serif italic transition-colors hover:[background-color:rgba(139,26,26,0.1)]"
                      style={{ color: "var(--blood)", fontSize: "14px" }}
                    >
                      {mockAuthEnabled ? "mock attivo" : "esci"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="nav-link-plain font-mono uppercase tracking-[0.2em]"
                  style={{ fontSize: "11px", color: "var(--paper)" }}
                >
                  entra con google
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: "-6px",
                      height: "2px",
                      backgroundColor: "var(--acid)",
                    }}
                  />
                </Link>
              </div>
            )}

            {/* Upload CTA - sempre visibile */}
            <Link
              href="/upload"
              className="upload-cta hidden sm:inline-flex items-center gap-2 font-mono uppercase tracking-[0.2em] px-3 py-2"
              style={{
                fontSize: "10px",
                color: "var(--paper)",
                border: "1px solid var(--ghost)",
                transition: "border-color 200ms ease, background-color 200ms ease",
              }}
            >
              + carica
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden font-mono uppercase tracking-[0.2em]"
              style={{ color: "var(--paper)", fontSize: "11px" }}
              aria-label="apri menu"
            >
              menu
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden overflow-hidden"
          style={{ backgroundColor: "var(--ink)" }}
        >
          <div className="grain" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-6 z-[2] font-mono"
            style={{ color: "var(--paper)", fontSize: "28px", lineHeight: 1 }}
            aria-label="chiudi menu"
          >
            ×
          </button>
          <div
            className="relative z-[1] h-full flex flex-col justify-center px-8 gap-8 overflow-y-auto py-20"
          >
            {mobileLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="fade-up block"
                style={{ animationDelay: `${i * 80}ms` }}
                onClick={() => setMobileOpen(false)}
              >
                <span
                  className="block font-mono uppercase tracking-[0.2em] mb-1"
                  style={{ fontSize: "10px", color: "var(--ghost)" }}
                >
                  {link.index} /
                </span>
                <span
                  className="block font-serif italic"
                  style={{
                    fontSize: "clamp(2.5rem, 10vw, 4rem)",
                    color: "var(--paper)",
                    lineHeight: 1,
                  }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-link-text {
          position: relative;
        }
        .nav-link-text::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -4px;
          height: 1px;
          background: var(--paper);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 300ms cubic-bezier(0.77, 0, 0.18, 1);
        }
        .nav-link:hover {
          color: var(--paper) !important;
        }
        .nav-link:hover .nav-link-text::after {
          transform: scaleX(1);
        }
        .nav-link-plain:hover {
          color: var(--paper);
        }
        .upload-cta:hover {
          border-color: var(--paper);
          background-color: rgba(245, 241, 232, 0.04);
        }
        .avatar-btn:hover {
          border-color: var(--acid) !important;
        }
      `}</style>
    </>
  );
}
