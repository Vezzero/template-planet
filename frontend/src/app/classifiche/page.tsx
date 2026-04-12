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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Classifiche",
  description: "I creator piu attivi, i meme piu amati, le classifiche di BasiMeme.it",
};

function MedalLabel({ rank }: { rank: number }) {
  if (rank === 0)
    return (
      <span
        className="font-mono font-bold"
        style={{ fontSize: "11px", color: "var(--acid)" }}
      >
        01
      </span>
    );
  if (rank < 3)
    return (
      <span
        className="font-mono font-bold"
        style={{ fontSize: "11px", color: "var(--paper)" }}
      >
        {String(rank + 1).padStart(2, "0")}
      </span>
    );
  return (
    <span
      className="font-mono"
      style={{ fontSize: "11px", color: "var(--ghost)" }}
    >
      {String(rank + 1).padStart(2, "0")}
    </span>
  );
}

function UserRow({
  rank,
  user,
  value,
  suffix,
}: {
  rank: number;
  user: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
    points: number;
  };
  value: number | string;
  suffix: string;
}) {
  const rankInfo = getRank(user.points);
  const isTop3 = rank < 3;

  return (
    <Link
      href={`/u/${user.username}`}
      className="flex items-center gap-3 px-4 py-3 transition-colors group"
      style={{
        borderBottom: "1px solid rgba(90, 86, 78, 0.2)",
        backgroundColor: isTop3 ? "rgba(245, 241, 232, 0.02)" : "transparent",
      }}
    >
      <div className="w-6 flex items-center justify-center shrink-0">
        <MedalLabel rank={rank} />
      </div>
      {user.image ? (
        <Image
          src={user.image}
          alt={user.username}
          width={32}
          height={32}
          className="rounded-full shrink-0"
          style={{
            border: `1px solid ${rank === 0 ? "var(--acid)" : "var(--ghost)"}`,
          }}
        />
      ) : (
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center font-mono uppercase shrink-0"
          style={{
            border: `1px solid ${rank === 0 ? "var(--acid)" : "var(--ghost)"}`,
            color: "var(--paper)",
            fontSize: "12px",
          }}
        >
          {user.username[0].toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="font-serif italic transition-colors"
            style={{ fontSize: "14px", color: "var(--paper)" }}
          >
            @{user.username}
          </span>
          <span className="text-xs" title={rankInfo.label}>
            {rankInfo.emoji}
          </span>
        </div>
        {user.name && (
          <p
            className="font-mono uppercase tracking-[0.15em] truncate"
            style={{ fontSize: "9px", color: "var(--ghost)" }}
          >
            {user.name}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p
          className="font-display font-bold"
          style={{ fontSize: "16px", color: "var(--paper)" }}
        >
          {typeof value === "number" ? formatNumber(value) : value}
        </p>
        <p
          className="font-mono uppercase tracking-[0.15em]"
          style={{ fontSize: "9px", color: "var(--ghost)" }}
        >
          {suffix}
        </p>
      </div>
    </Link>
  );
}

function LeaderboardCard({
  title,
  index,
  children,
}: {
  title: string;
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(90, 86, 78, 0.35)",
        backgroundColor: "var(--ink)",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid rgba(90, 86, 78, 0.35)" }}
      >
        <span
          className="font-mono uppercase tracking-[0.2em]"
          style={{ fontSize: "9px", color: "var(--ghost)" }}
        >
          {index} /
        </span>
        <h2
          className="font-serif italic font-normal"
          style={{ fontSize: "18px", color: "var(--paper)" }}
        >
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default async function ClassifichePage() {
  const [byPoints, byBases, byUpvotes, byDownloads, bySuggestions, popularBases] =
    await Promise.all([
      getLeaderboardByPoints(10),
      getLeaderboardByBases(10),
      getLeaderboardByUpvotes(10),
      getLeaderboardByDownloads(10),
      getLeaderboardBySuggestions(10),
      getMostPopularBases(10),
    ]);

  const emptyState = (text: string) => (
    <p
      className="font-serif italic text-center py-8"
      style={{ fontSize: "14px", color: "var(--ghost)" }}
    >
      {text}
    </p>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-20 pb-32">
      {/* Header */}
      <header className="mb-16">
        <h1
          className="font-serif italic font-normal mb-3"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
            lineHeight: 1.05,
            color: "var(--paper)",
            letterSpacing: "-0.015em",
          }}
        >
          Classifiche.
        </h1>
        <p
          className="font-serif italic max-w-md"
          style={{ fontSize: "15px", color: "var(--ghost)", lineHeight: 1.5 }}
        >
          i migliori creator, le basi piu amate, i contributi piu utili.
          <br />
          guadagna punti caricando basi e proponendo modifiche.
        </p>

        {/* Rank tiers */}
        <div className="flex flex-wrap gap-2 mt-8">
          {[
            { label: "newbie", emoji: "🌱", min: "0" },
            { label: "mematore", emoji: "🧃", min: "50" },
            { label: "veterano", emoji: "🏅", min: "200" },
            { label: "pro del meme", emoji: "🔥", min: "500" },
            { label: "leggenda", emoji: "👑", min: "1000" },
          ].map(({ label, emoji, min }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 py-1.5 px-3 font-mono uppercase tracking-[0.15em]"
              style={{
                fontSize: "10px",
                border: "1px solid rgba(90, 86, 78, 0.4)",
                color: "var(--paper)",
              }}
            >
              <span>{emoji}</span>
              <span>{label}</span>
              <span style={{ color: "var(--ghost)" }}>da {min} pt</span>
            </div>
          ))}
        </div>
      </header>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <LeaderboardCard title="Top contributor" index="01">
          {byPoints.length === 0
            ? emptyState("nessun dato ancora.")
            : byPoints.map((user, i) => (
                <UserRow
                  key={user.id}
                  rank={i}
                  user={user}
                  value={user.points}
                  suffix="punti"
                />
              ))}
        </LeaderboardCard>

        <LeaderboardCard title="Piu prolifici" index="02">
          {byBases.length === 0
            ? emptyState("nessun dato ancora.")
            : byBases.map(({ user, count }, i) => (
                <UserRow key={user.id} rank={i} user={user} value={count} suffix="basi" />
              ))}
        </LeaderboardCard>

        <LeaderboardCard title="Piu amati" index="03">
          {byUpvotes.length === 0
            ? emptyState("nessun dato ancora.")
            : byUpvotes.map(({ user, count }, i) => (
                <UserRow
                  key={user.id}
                  rank={i}
                  user={user}
                  value={count}
                  suffix="upvote"
                />
              ))}
        </LeaderboardCard>

        <LeaderboardCard title="Piu scaricati" index="04">
          {byDownloads.length === 0
            ? emptyState("nessun dato ancora.")
            : byDownloads.map(({ user, count }, i) => (
                <UserRow
                  key={user.id}
                  rank={i}
                  user={user}
                  value={count}
                  suffix="download"
                />
              ))}
        </LeaderboardCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LeaderboardCard title="Migliori editor" index="05">
          {bySuggestions.length === 0
            ? emptyState("nessuna modifica approvata ancora.")
            : bySuggestions.map(({ user, count }, i) => (
                <UserRow
                  key={user.id}
                  rank={i}
                  user={user}
                  value={count}
                  suffix="modifiche"
                />
              ))}
        </LeaderboardCard>

        {/* Most popular bases */}
        <div
          style={{
            border: "1px solid rgba(90, 86, 78, 0.35)",
            backgroundColor: "var(--ink)",
          }}
        >
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: "1px solid rgba(90, 86, 78, 0.35)" }}
          >
            <span
              className="font-mono uppercase tracking-[0.2em]"
              style={{ fontSize: "9px", color: "var(--ghost)" }}
            >
              06 /
            </span>
            <h2
              className="font-serif italic font-normal"
              style={{ fontSize: "18px", color: "var(--paper)" }}
            >
              Basi piu amate
            </h2>
          </div>
          <div>
            {popularBases.length === 0
              ? emptyState("nessuna base ancora.")
              : popularBases.map((base, i) => (
                  <Link
                    key={base.id}
                    href={`/base/${base.slug}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors group"
                    style={{
                      borderBottom: "1px solid rgba(90, 86, 78, 0.2)",
                      backgroundColor:
                        i < 3 ? "rgba(245, 241, 232, 0.02)" : "transparent",
                    }}
                  >
                    <div className="w-6 flex items-center justify-center shrink-0">
                      <MedalLabel rank={i} />
                    </div>
                    <div
                      className="relative h-10 w-14 overflow-hidden shrink-0"
                      style={{
                        backgroundColor: "var(--shadow)",
                        border: "1px solid rgba(90, 86, 78, 0.3)",
                      }}
                    >
                      {base.fileType !== "VIDEO" && (
                        <Image
                          src={base.fileUrl}
                          alt={base.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-serif truncate"
                        style={{ fontSize: "14px", color: "var(--paper)" }}
                      >
                        {base.title.toLowerCase()}
                      </p>
                      {base.category && (
                        <p
                          className="font-mono uppercase tracking-[0.15em]"
                          style={{ fontSize: "9px", color: "var(--ghost)" }}
                        >
                          {base.category.iconEmoji} {base.category.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-1">
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "11px",
                          color: "var(--acid)",
                        }}
                      >
                        ▲
                      </span>
                      <span
                        className="font-display font-bold"
                        style={{ fontSize: "15px", color: "var(--paper)" }}
                      >
                        {formatNumber(base.upvotesCount)}
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
