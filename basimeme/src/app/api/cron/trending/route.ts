import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Call this endpoint every hour via Vercel Cron or external service
// Add CRON_SECRET to env for security
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48h ago

  // Get all approved bases with recent activity
  const bases = await db.memeBase.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      upvotes: { where: { createdAt: { gte: cutoff } }, select: { id: true } },
      downloadsCount: true,
      viewsCount: true,
      createdAt: true,
    },
  });

  // Compute scores and update
  const updates = bases.map((base) => {
    const upvotesRecent = base.upvotes.length;
    // Approximate recent downloads/views (no per-record timestamps, use fraction of total based on age)
    const ageMs = Date.now() - new Date(base.createdAt).getTime();
    const ageFactor = Math.min(1, 48 * 60 * 60 * 1000 / Math.max(ageMs, 1));
    const downloadsRecent = Math.floor(base.downloadsCount * ageFactor);
    const viewsRecent = Math.floor(base.viewsCount * ageFactor);

    const score = upvotesRecent * 3 + downloadsRecent * 2 + viewsRecent * 1;

    return db.memeBase.update({
      where: { id: base.id },
      data: {
        trendingScore: score,
        isTrending: score > 10,
      },
    });
  });

  await db.$transaction(updates);

  return NextResponse.json({ success: true, updated: bases.length });
}
