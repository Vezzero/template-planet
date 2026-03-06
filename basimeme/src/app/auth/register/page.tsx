"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome } from "lucide-react";

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
      if (!res.ok) { setError(data.error || "Errore durante la registrazione"); return; }
      await signIn("credentials", { email: form.email, password: form.password, callbackUrl: "/" });
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-amber-400 text-black font-black text-lg mb-4">BM</div>
          <h1 className="text-2xl font-black text-white">Crea account</h1>
          <p className="text-zinc-500 text-sm mt-1">Unisciti a BasiMeme.it</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <Button variant="secondary" className="w-full" onClick={() => signIn("google", { callbackUrl: "/" })}>
            <Chrome className="h-4 w-4" />
            Registrati con Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">oppure</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              placeholder="Username (solo lettere, numeri, _)"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase() })}
              required
              minLength={3}
              maxLength={24}
            />
            <Input
              type="password"
              placeholder="Password (min 8 caratteri)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
            />
            <Button type="submit" className="w-full" loading={loading}>
              Crea account
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500">
            Hai già un account?{" "}
            <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 font-medium">
              Accedi
            </Link>
          </p>
          <p className="text-center text-xs text-zinc-600">
            Registrandoti accetti i{" "}
            <Link href="/termini" className="underline">Termini di servizio</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
