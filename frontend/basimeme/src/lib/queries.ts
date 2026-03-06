import { db } from "@/lib/db";

const MEME_INCLUDE = {
  author: { select: { id: true, username: true, image: true, name: true } },
  category: { select: { id: true, name: true, slug: true, iconEmoji: true, color: true } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
} as const;

const PAGE_SIZE = 24;

type GetMemesOptions = {
  sort?: "trending" | "newest" | "top";
  category?: string;
  tag?: string;
  fileType?: string;
  status?: string;
  authorId?: string;
  search?: string;
  page?: number;
  userId?: string;
};

export async function getMemes(options: GetMemesOptions = {}) {
  const {
    sort = "newest",
    category,
    tag,
    fileType,
    status = "APPROVED",
    authorId,
    search,
    page = 1,
    userId,
  } = options;

  const where: Record<string, unknown> = { status };
  if (authorId) where.authorId = authorId;
  if (fileType) where.fileType = fileType;
  if (category) where.category = { slug: category };
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { tags: { some: { tag: { name: { contains: search } } } } },
    ];
  }

  const orderBy =
    sort === "trending"
      ? { trendingScore: "desc" as const }
      : sort === "top"
      ? { upvotesCount: "desc" as const }
      : { createdAt: "desc" as const };

  const [memes, total] = await Promise.all([
    db.memeBase.findMany({
      where,
      include: MEME_INCLUDE,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.memeBase.count({ where }),
  ]);

  let upvotedIds: Set<string> = new Set();
  if (userId && memes.length > 0) {
    const upvotes = await db.upvote.findMany({
      where: { userId, memeBaseId: { in: memes.map((m) => m.id) } },
      select: { memeBaseId: true },
    });
    upvotedIds = new Set(upvotes.map((u) => u.memeBaseId));
  }

  return {
    memes: memes.map((m) => ({ ...m, _userHasUpvoted: upvotedIds.has(m.id) })),
    total,
    pages: Math.ceil(total / PAGE_SIZE),
    page,
  };
}

export async function getMemeBySlug(slug: string, userId?: string) {
  const meme = await db.memeBase.findUnique({
    where: { slug },
    include: {
      ...MEME_INCLUDE,
      _count: { select: { upvotes: true } },
    },
  });
  if (!meme) return null;

  let _userHasUpvoted = false;
  if (userId) {
    const upvote = await db.upvote.findUnique({
      where: { userId_memeBaseId: { userId, memeBaseId: meme.id } },
    });
    _userHasUpvoted = !!upvote;
  }

  return { ...meme, _userHasUpvoted };
}

export async function getRelatedMemes(memeId: string, categoryId?: string | null, authorId?: string) {
  return db.memeBase.findMany({
    where: {
      status: "APPROVED",
      id: { not: memeId },
      OR: [
        categoryId ? { categoryId } : {},
        authorId ? { authorId } : {},
      ].filter((o) => Object.keys(o).length > 0),
    },
    include: MEME_INCLUDE,
    orderBy: { upvotesCount: "desc" },
    take: 6,
  });
}

export async function getCategories() {
  return db.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { bases: { where: { status: "APPROVED" } } } } },
  });
}

export async function getPopularTags(limit = 20) {
  return db.tag.findMany({
    include: { _count: { select: { bases: { where: { memeBase: { status: "APPROVED" } } } } } },
    orderBy: { bases: { _count: "desc" } },
    take: limit,
  });
}

export async function getUserStats(userId: string) {
  const [basesCount, upvotesReceived, suggestionsApproved, user] = await Promise.all([
    db.memeBase.count({ where: { authorId: userId, status: "APPROVED" } }),
    db.upvote.count({ where: { memeBase: { authorId: userId } } }),
    db.suggestion.count({ where: { userId, status: "APPROVED" } }),
    db.user.findUnique({ where: { id: userId }, select: { points: true } }),
  ]);
  return { basesCount, upvotesReceived, suggestionsApproved, points: user?.points ?? 0 };
}

// ── Scoring ────────────────────────────────────────────────────────────────────

export async function awardPoints(userId: string, points: number, reason: string, refId?: string) {
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { points: { increment: points } } }),
    db.scoreEvent.create({ data: { userId, points, reason, refId } }),
  ]);
}

export function getRank(points: number) {
  if (points >= 1000) return { label: "Leggenda", emoji: "👑", color: "#f59e0b" };
  if (points >= 500)  return { label: "Pro del Meme", emoji: "🔥", color: "#ef4444" };
  if (points >= 200)  return { label: "Veterano", emoji: "🏅", color: "#8b5cf6" };
  if (points >= 50)   return { label: "Mematore", emoji: "🧃", color: "#22c55e" };
  return { label: "Newbie", emoji: "🌱", color: "#71717a" };
}

// ── Leaderboards ───────────────────────────────────────────────────────────────

export async function getLeaderboardByPoints(limit = 15) {
  return db.user.findMany({
    where: { points: { gt: 0 } },
    orderBy: { points: "desc" },
    take: limit,
    select: { id: true, username: true, name: true, image: true, points: true },
  });
}

export async function getLeaderboardByBases(limit = 15) {
  // Use groupBy on meme_bases to get top authors by approved base count
  const grouped = await db.memeBase.groupBy({
    by: ["authorId"],
    where: { status: "APPROVED" },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });
  const userIds = grouped.map((g) => g.authorId);
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true, name: true, image: true, points: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));
  return grouped.map((g) => ({
    user: userMap.get(g.authorId)!,
    count: g._count.id,
  })).filter((x) => x.user);
}

export async function getLeaderboardByUpvotes(limit = 15) {
  const grouped = await db.memeBase.groupBy({
    by: ["authorId"],
    where: { status: "APPROVED" },
    _sum: { upvotesCount: true },
    orderBy: { _sum: { upvotesCount: "desc" } },
    take: limit,
  });
  const userIds = grouped.map((g) => g.authorId);
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true, name: true, image: true, points: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));
  return grouped
    .filter((g) => (g._sum.upvotesCount ?? 0) > 0)
    .map((g) => ({
      user: userMap.get(g.authorId)!,
      count: g._sum.upvotesCount ?? 0,
    })).filter((x) => x.user);
}

export async function getLeaderboardByDownloads(limit = 15) {
  const grouped = await db.memeBase.groupBy({
    by: ["authorId"],
    where: { status: "APPROVED" },
    _sum: { downloadsCount: true },
    orderBy: { _sum: { downloadsCount: "desc" } },
    take: limit,
  });
  const userIds = grouped.map((g) => g.authorId);
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true, name: true, image: true, points: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));
  return grouped
    .filter((g) => (g._sum.downloadsCount ?? 0) > 0)
    .map((g) => ({
      user: userMap.get(g.authorId)!,
      count: g._sum.downloadsCount ?? 0,
    })).filter((x) => x.user);
}

export async function getLeaderboardBySuggestions(limit = 15) {
  const grouped = await db.suggestion.groupBy({
    by: ["userId"],
    where: { status: "APPROVED" },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });
  const userIds = grouped.map((g) => g.userId);
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true, name: true, image: true, points: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));
  return grouped.map((g) => ({
    user: userMap.get(g.userId)!,
    count: g._count.id,
  })).filter((x) => x.user);
}

export async function getMostPopularBases(limit = 10) {
  return db.memeBase.findMany({
    where: { status: "APPROVED" },
    orderBy: { upvotesCount: "desc" },
    take: limit,
    include: {
      author: { select: { username: true } },
      category: { select: { name: true, iconEmoji: true, slug: true, color: true } },
    },
  });
}
