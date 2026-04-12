"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "errore durante la registrazione");
        return;
      }
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        callbackUrl: "/",
      });
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--ink)" }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-baseline gap-2 mb-6 justify-center">
            <span
              className="font-serif italic leading-none"
              style={{ fontSize: "22px", color: "var(--paper)" }}
            >
              basimeme
            </span>
            <span
              className="inline-block rounded-full"
              style={{ width: "6px", height: "6px", backgroundColor: "var(--acid)" }}
            />
          </div>
          <h1
            className="font-serif italic font-normal text-center"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              color: "var(--paper)",
              lineHeight: 1.1,
            }}
          >
            crea account.
          </h1>
          <p
            className="font-mono uppercase tracking-[0.2em] text-center mt-3"
            style={{ fontSize: "10px", color: "var(--ghost)" }}
          >
            unisciti a basimeme.it
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8 space-y-6"
          style={{
            border: "1px solid rgba(90, 86, 78, 0.35)",
            backgroundColor: "var(--ink)",
          }}
        >
          {/* Google */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full py-3 font-mono uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
            style={{
              fontSize: "11px",
              color: "var(--paper)",
              border: "1px solid var(--ghost)",
              backgroundColor: "transparent",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            registrati con google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div
              className="flex-1"
              style={{ height: "1px", backgroundColor: "var(--ghost)", opacity: 0.3 }}
            />
            <span
              className="font-mono uppercase tracking-[0.2em]"
              style={{ fontSize: "9px", color: "var(--ghost)" }}
            >
              oppure
            </span>
            <div
              className="flex-1"
              style={{ height: "1px", backgroundColor: "var(--ghost)", opacity: 0.3 }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="font-mono uppercase tracking-[0.15em] px-4 py-2.5"
                style={{
                  fontSize: "10px",
                  color: "var(--blood)",
                  border: "1px solid var(--blood)",
                  backgroundColor: "rgba(139, 26, 26, 0.08)",
                }}
              >
                ! {error}
              </div>
            )}
            <div>
              <label
                className="block font-mono uppercase tracking-[0.2em] mb-2"
                style={{ fontSize: "9px", color: "var(--ghost)" }}
              >
                email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full py-2.5 px-0 bg-transparent font-serif text-base outline-none transition-colors"
                style={{
                  color: "var(--paper)",
                  borderBottom: "1px solid var(--ghost)",
                  caretColor: "var(--acid)",
                }}
                placeholder="nome@email.com"
              />
            </div>
            <div>
              <label
                className="block font-mono uppercase tracking-[0.2em] mb-2"
                style={{ fontSize: "9px", color: "var(--ghost)" }}
              >
                username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase(),
                  })
                }
                required
                minLength={3}
                maxLength={24}
                className="w-full py-2.5 px-0 bg-transparent font-serif text-base outline-none transition-colors"
                style={{
                  color: "var(--paper)",
                  borderBottom: "1px solid var(--ghost)",
                  caretColor: "var(--acid)",
                }}
                placeholder="solo lettere, numeri, _"
              />
            </div>
            <div>
              <label
                className="block font-mono uppercase tracking-[0.2em] mb-2"
                style={{ fontSize: "9px", color: "var(--ghost)" }}
              >
                password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                className="w-full py-2.5 px-0 bg-transparent font-serif text-base outline-none transition-colors"
                style={{
                  color: "var(--paper)",
                  borderBottom: "1px solid var(--ghost)",
                  caretColor: "var(--acid)",
                }}
                placeholder="min 8 caratteri"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-mono uppercase tracking-[0.2em] transition-all disabled:opacity-50"
              style={{
                fontSize: "11px",
                color: "var(--ink)",
                backgroundColor: "var(--paper)",
              }}
            >
              {loading ? "..." : "crea account"}
            </button>
          </form>

          {/* Login link */}
          <p
            className="text-center font-mono uppercase tracking-[0.15em]"
            style={{ fontSize: "10px", color: "var(--ghost)" }}
          >
            hai gia un account?{" "}
            <Link href="/auth/login" className="relative" style={{ color: "var(--paper)" }}>
              accedi
              <span
                className="absolute left-0 right-0"
                style={{ bottom: "-3px", height: "1px", backgroundColor: "var(--acid)" }}
              />
            </Link>
          </p>

          {/* ToS */}
          <p
            className="text-center font-mono uppercase tracking-[0.15em]"
            style={{ fontSize: "9px", color: "var(--ghost)" }}
          >
            registrandoti accetti i{" "}
            <Link
              href="/termini"
              className="transition-colors"
              style={{ color: "var(--paper)", textDecoration: "underline" }}
            >
              termini di servizio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
