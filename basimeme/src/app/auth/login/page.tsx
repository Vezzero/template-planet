"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome } from "lucide-react";

function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Email o password non corretti"); return; }
    router.push(callbackUrl);
  };

  const handleGoogle = () => signIn("google", { callbackUrl });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <Button variant="secondary" className="w-full" onClick={handleGoogle}>
        <Chrome className="h-4 w-4" />
        Continua con Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-zinc-600 text-xs">oppure</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <form onSubmit={handleCredentials} className="space-y-3">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" loading={loading}>Accedi</Button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Non hai un account?{" "}
        <Link href="/auth/register" className="text-amber-400 hover:text-amber-300 font-medium">Registrati</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-amber-400 text-black font-black text-lg mb-4">BM</div>
          <h1 className="text-2xl font-black text-white">Bentornato!</h1>
          <p className="text-zinc-500 text-sm mt-1">Accedi a BasiMeme.it</p>
        </div>
        <Suspense fallback={<div className="h-64 skeleton rounded-2xl" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
