import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getMemes } from "@/lib/queries";
import { db } from "@/lib/db";
import { MemeGrid } from "@/components/meme/MemeGrid";
import { Hash } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `#${slug} - Basi meme` };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const tag = await db.tag.findUnique({ where: { slug } });
  if (!tag) notFound();

  const { memes } = await getMemes({ tag: slug, sort: "top", userId: session?.user?.id });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <Hash className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">#{tag.name}</h1>
          <p className="text-zinc-500 text-sm">{memes.length} basi con questo tag</p>
        </div>
      </div>
      <MemeGrid initialMemes={memes as any} isLoggedIn={!!session} />
    </div>
  );
}
