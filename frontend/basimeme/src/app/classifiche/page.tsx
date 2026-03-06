import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getLeaderboardByPoints,
  getLeaderboardByBases,
  getLeaderboardByUpvotes,
  getLeaderboardByDownloads,
  getLeaderboardBySuggestions,
  getMostPopularBases,
  getRank,
} from "@/lib/queries";
import { formatNumber } from "@/lib/utils";
import { Trophy, Crown, Medal, Star, Heart, Download, Lightbulb, Flame, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Classifiche",
  description: "I creator più attivi, i meme più amati, le classifiche di BasiMeme.it",
};

const MEDAL_COLORS = ["#f59e0b", "#9ca3af", "#b45309"];

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 0) return <Crown className="h-5 w-5" style={{ color: MEDAL_COLORS[0] }} />;
  if (rank === 1) return <Medal className="h-4 w-4" style={{ color: MEDAL_COLORS[1] }} />;
  if (rank === 2) return <Medal className="h-4 w-4" style={{ color: MEDAL_COLORS[2] }} />;
  return <span className="text-zinc-600 font-bold text-sm w-4 text-center">{rank + 1}</span>;
}

function UserRow({
  rank,
  user,
  value,
  suffix,
}: {
  rank: number;
  user: { id: string; username: string; name: string | null; image: string | null; points: number };
  value: number | string;
  suffix: string;
}) {
  const rankInfo = getRank(user.points);
  const isTop3 = rank < 3;

  return (
    <Link
      href={`/u/${user.username}`}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${
        isTop3
          ? "bg-zinc-900 border border-zinc-800 hover:border-zinc-700"
          : "hover:bg-zinc-900/60"
      }`}
    >
      <div className="w-6 flex items-center justify-center shrink-0">
        <MedalIcon rank={rank} />
      </div>
      {user.image ? (
        <Image
          src={user.image}
          alt={user.username}
          width={36}
          height={36}
          className={`rounded-full shrink-0 ${rank === 0 ? "ring-2 ring-amber-400/50" : ""}`}
        />
      ) : (
        <div
          className={`h-9 w-9 rounded-full bg-amber-400 text-black flex items-center justify-center font-black text-sm shrink-0 ${rank === 0 ? "ring-2 ring-amber-400/50" : ""}`}
        >
          {user.username[0].toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">
            @{user.username}
          </span>
          <span className="text-xs" title={rankInfo.label}>{rankInfo.emoji}</span>
        </div>
        {user.name && <p className="text-xs text-zinc-500 truncate">{user.name}</p>}
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-white text-sm">{typeof value === "number" ? formatNumber(value) : value}</p>
        <p className="text-xs text-zinc-600">{suffix}</p>
      </div>
    </Link>
  );
}

function LeaderboardCard({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className={`flex items-center gap-2.5 px-5 py-4 border-b border-zinc-800 bg-zinc-900/40`}>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="font-bold text-white">{title}</h2>
      </div>
      <div className="p-3 space-y-0.5">{children}</div>
    </div>
  );
}

export default async function ClassifichePage() {
  const [byPoints, byBases, byUpvotes, byDownloads, bySuggestions, popularBases] = await Promise.all([
    getLeaderboardByPoints(10),
    getLeaderboardByBases(10),
    getLeaderboardByUpvotes(10),
    getLeaderboardByDownloads(10),
    getLeaderboardBySuggestions(10),
    getMostPopularBases(10),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 text-sm text-amber-400 font-medium mb-5">
          <Trophy className="h-4 w-4" />
          Hall of Fame
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Classifiche</h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          I migliori creator, le basi più amate, i contributi più utili.<br />
          Guadagna punti caricando basi e proponendo modifiche.
        </p>
      </div>

      {/* Points tiers legend */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {[
          { label: "Newbie", emoji: "🌱", min: "0" },
          { label: "Mematore", emoji: "🧃", min: "50" },
          { label: "Veterano", emoji: "🏅", min: "200" },
          { label: "Pro del Meme", emoji: "🔥", min: "500" },
          { label: "Leggenda", emoji: "👑", min: "1.000" },
        ].map(({ label, emoji, min }) => (
          <div key={label} className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-xs">
            <span>{emoji}</span>
            <span className="text-white font-medium">{label}</span>
            <span className="text-zinc-500">da {min} pt</span>
          </div>
        ))}
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top by points */}
        <LeaderboardCard title="Top Contributor" icon={Star} color="bg-amber-400/10 text-amber-400">
          {byPoints.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-4">Nessun dato ancora</p>
          ) : (
            byPoints.map((user, i) => (
              <UserRow key={user.id} rank={i} user={user} value={user.points} suffix="punti" />
            ))
          )}
        </LeaderboardCard>

        {/* Top by bases */}
        <LeaderboardCard title="Più Prolifici" icon={Package} color="bg-blue-400/10 text-blue-400">
          {byBases.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-4">Nessun dato ancora</p>
          ) : (
            byBases.map(({ user, count }, i) => (
              <UserRow key={user.id} rank={i} user={user} value={count} suffix="basi" />
            ))
          )}
        </LeaderboardCard>

        {/* Top by upvotes */}
        <LeaderboardCard title="Più Amati" icon={Heart} color="bg-red-400/10 text-red-400">
          {byUpvotes.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-4">Nessun dato ancora</p>
          ) : (
            byUpvotes.map(({ user, count }, i) => (
              <UserRow key={user.id} rank={i} user={user} value={count} suffix="upvote" />
            ))
          )}
        </LeaderboardCard>

        {/* Top by downloads */}
        <LeaderboardCard title="Più Scaricati" icon={Download} color="bg-green-400/10 text-green-400">
          {byDownloads.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-4">Nessun dato ancora</p>
          ) : (
            byDownloads.map(({ user, count }, i) => (
              <UserRow key={user.id} rank={i} user={user} value={count} suffix="download" />
            ))
          )}
        </LeaderboardCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top suggesters */}
        <LeaderboardCard title="Migliori Editor" icon={Lightbulb} color="bg-purple-400/10 text-purple-400">
          {bySuggestions.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-4">Nessuna modifica approvata ancora</p>
          ) : (
            bySuggestions.map(({ user, count }, i) => (
              <UserRow key={user.id} rank={i} user={user} value={count} suffix="modifiche approvate" />
            ))
          )}
        </LeaderboardCard>

        {/* Most popular bases */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-zinc-800 bg-zinc-900/40">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-orange-400/10 text-orange-400">
              <Flame className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-white">Basi Più Amate</h2>
          </div>
          <div className="p-3 space-y-0.5">
            {popularBases.length === 0 ? (
              <p className="text-zinc-600 text-sm text-center py-4">Nessuna base ancora</p>
            ) : (
              popularBases.map((base, i) => (
                <Link
                  key={base.id}
                  href={`/base/${base.slug}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-zinc-900/60 group ${i < 3 ? "bg-zinc-900 border border-zinc-800" : ""}`}
                >
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <MedalIcon rank={i} />
                  </div>
                  <div className="relative h-10 w-16 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                    {base.fileType !== "VIDEO" && (
                      <Image src={base.fileUrl} alt={base.title} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
                      {base.title}
                    </p>
                    {base.category && (
                      <p className="text-xs text-zinc-500">{base.category.iconEmoji} {base.category.name}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-white text-sm flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" />
                      {formatNumber(base.upvotesCount)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
