"use client";

import { Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  const handleGoogle = () => signIn("google", { callbackUrl });

  return (
    <div
      className="p-8 space-y-6"
      style={{
        border: "1px solid rgba(90, 86, 78, 0.35)",
        backgroundColor: "var(--ink)",
      }}
    >
      <button
        type="button"
        onClick={handleGoogle}
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
        continua con google
      </button>
      <p
        className="text-center font-mono uppercase tracking-[0.15em]"
        style={{ fontSize: "10px", color: "var(--ghost)", lineHeight: 1.8 }}
      >
        accesso disponibile solo con account google.
        <br />
        il profilo viene creato automaticamente al primo accesso.
      </p>

      <p
        className="text-center font-mono uppercase tracking-[0.15em]"
        style={{ fontSize: "10px", color: "var(--ghost)" }}
      >
        non hai ancora un account?{" "}
        <Link
          href="/auth/register"
          className="relative"
          style={{ color: "var(--paper)" }}
        >
          usa google
          <span
            className="absolute left-0 right-0"
            style={{ bottom: "-3px", height: "1px", backgroundColor: "var(--acid)" }}
          />
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--ink)" }}
    >
      <div className="w-full max-w-sm">
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
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", color: "var(--paper)", lineHeight: 1.1 }}
          >
            bentornato.
          </h1>
          <p
            className="font-mono uppercase tracking-[0.2em] text-center mt-3"
            style={{ fontSize: "10px", color: "var(--ghost)" }}
          >
            accedi a basimeme.it con google
          </p>
        </div>
        <Suspense fallback={<div className="h-64 skeleton" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
