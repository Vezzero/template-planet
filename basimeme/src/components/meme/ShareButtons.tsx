"use client";

import { useState } from "react";
import { Copy, Check, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { slug: string; title: string };

export function ShareButtons({ slug, title }: Props) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/base/${slug}` : `/base/${slug}`;
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`${title} — BasiMeme.it`);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <p className="text-xs text-zinc-500 mb-2">Condividi</p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={copy}>
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiato!" : "Copia link"}
        </Button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
          target="_blank" rel="noopener noreferrer"
        >
          <Button variant="secondary" size="icon" title="Condividi su Twitter">
            <Twitter className="h-4 w-4" />
          </Button>
        </a>
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
          target="_blank" rel="noopener noreferrer"
        >
          <Button variant="secondary" size="icon" title="Condividi su WhatsApp">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}
