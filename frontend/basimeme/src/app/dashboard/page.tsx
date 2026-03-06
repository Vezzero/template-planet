import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserStats, getRank } from "@/lib/queries";
import { formatNumber, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Heart, Package, Clock, CheckCircle, XCircle, Star, Lightbulb, Trophy } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const [user, stats, bases] = await Promise.all([
    db.user.findUnique({ where: { id: session.user.id } }),
    getUserStats(session.user.id),
    db.memeBase.findMany({
      where: { authorId: session.user.id },
      include: {
        category: { select: { name: true, iconEmoji: true } },
        _count: { select: { upvotes: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const pending = bases.filter((b) => b.status === "PENDING");
  const rejected = bases.filter((b) => b.status === "REJECTED");
  const rank = getRank(stats.points);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start gap-5">
        {user?.image ? (
          <Image src={user.image} alt={user.username} width={72} height={72} className="rounded-full ring-2 ring-zinc-700" />
        ) : (
          <div className="h-[72px] w-[72px] rounded-full bg-amber-400 text-black flex items-center justify-center text-2xl font-black ring-2 ring-amber-400/30">
            {user?.username[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-black text-white">@{user?.username}</h1>
            <span
              className="text-sm px-2.5 py-0.5 rounded-full font-semibold border"
              style={{ color: rank.color, borderColor: `${rank.color}40`, background: `${rank.color}15` }}
            >
              {rank.emoji} {rank.label}
            </span>
          </div>
          {user?.bio && <p className="text-zinc-400 mt-1 text-sm">{user.bio}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/classifiche">
            <Button variant="secondary" size="sm">
              <Trophy className="h-4 w-4" /> Classifiche
            </Button>
          </Link>
        </div>
      </div>

      {/* Points banner */}
      <div className="bg-gradient-to-r from-amber-400/10 via-amber-400/5 to-transparent border border-amber-400/20 rounded-xl p-4 mb-6 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0">
          <Star className="h-5 w-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{formatNumber(stats.points)}</span>
            <span className="text-zinc-400 text-sm">punti</span>
          </div>
          <p className="text-zinc-500 text-xs mt-0.5">
            Guadagna +50 pt per ogni base approvata, +20 pt per ogni modifica approvata
          </p>
        </div>
        {stats.suggestionsApproved > 0 && (
          <div className="text-right shrink-0">
            <p className="text-white font-bold">{stats.suggestionsApproved}</p>
            <p className="text-zinc-500 text-xs">modifiche approvate</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Package, label: "Basi pubblicate", value: stats.basesCount, color: "text-amber-400" },
          { icon: Heart, label: "Upvote ricevuti", value: stats.upvotesReceived, color: "text-red-400" },
          { icon: Lightbulb, label: "Modifiche approvate", value: stats.suggestionsApproved, color: "text-purple-400" },
          { icon: Clock, label: "In attesa", value: pending.length, color: "text-yellow-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
            <p className="text-2xl font-black text-white">{formatNumber(value)}</p>
            <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Upload CTA */}
      <Link href="/upload" className="block mb-8">
        <div className="rounded-xl border border-dashed border-amber-400/40 bg-amber-400/5 hover:bg-amber-400/10 transition-colors p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0">
            <Upload className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Carica una nuova base</p>
            <p className="text-zinc-500 text-sm">+50 pt se approvata</p>
          </div>
        </div>
      </Link>

      {/* Bases list */}
      {bases.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Non hai ancora caricato nessuna base</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Le tue basi</h2>
          {bases.map((base) => (
            <div
              key={base.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-white truncate">{base.title}</span>
                  {base.status === "APPROVED" && (
                    <Badge variant="green"><CheckCircle className="h-3 w-3" /> Approvata</Badge>
                  )}
                  {base.status === "PENDING" && (
                    <Badge variant="amber"><Clock className="h-3 w-3" /> In attesa</Badge>
                  )}
                  {base.status === "REJECTED" && (
                    <Badge variant="red"><XCircle className="h-3 w-3" /> Rifiutata</Badge>
                  )}
                </div>
                {base.status === "REJECTED" && base.rejectionReason && (
                  <p className="text-red-400 text-xs mt-1">Motivo: {base.rejectionReason}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                  {base.category && <span>{base.category.iconEmoji} {base.category.name}</span>}
                  <span>♥ {formatNumber(base._count.upvotes)}</span>
                  <span>{timeAgo(base.createdAt)}</span>
                </div>
              </div>
              {base.status === "APPROVED" && (
                <Link href={`/base/${base.slug}`}>
                  <Button variant="ghost" size="sm">Vedi</Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
