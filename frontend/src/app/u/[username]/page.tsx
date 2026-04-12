import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMemes, getUserStats } from "@/lib/queries";
import { MemeGrid } from "@/components/meme/MemeGrid";
import { formatNumber } from "@/lib/utils";
import { Package, Heart, ExternalLink, Twitter, Instagram } from "lucide-react";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username} - BasiMeme.it` };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;
  const session = await auth();

  const user = await db.user.findUnique({ where: { username } });
  if (!user || user.banned) notFound();

  const [{ memes }, stats] = await Promise.all([
    getMemes({ authorId: user.id, sort: "top", userId: session?.user?.id }),
    getUserStats(user.id),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {user.image ? (
            <Image src={user.image} alt={user.username} width={96} height={96} className="rounded-full" />
          ) : (
            <div className="h-24 w-24 rounded-full bg-amber-400 text-black flex items-center justify-center text-4xl font-black">
              {user.username[0].toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-black text-white">@{user.username}</h1>
            {user.name && <p className="text-zinc-400">{user.name}</p>}
            {user.bio && <p className="text-zinc-300 mt-2 max-w-lg">{user.bio}</p>}

            <div className="flex items-center gap-3 mt-3">
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-amber-400 transition-colors">
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
              {user.twitter && (
                <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {user.instagram && (
                <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-pink-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{formatNumber(stats.basesCount)}</p>
              <p className="text-zinc-500 text-xs flex items-center gap-1"><Package className="h-3 w-3" /> Basi</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">{formatNumber(stats.upvotesReceived)}</p>
              <p className="text-zinc-500 text-xs flex items-center gap-1"><Heart className="h-3 w-3" /> Upvote</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <h2 className="text-xl font-bold text-white mb-6">Basi di @{user.username}</h2>
      <MemeGrid
        initialMemes={memes as any}
        isLoggedIn={!!session}
        emptyMessage={`@${user.username} non ha ancora caricato nessuna base`}
      />
    </div>
  );
}
