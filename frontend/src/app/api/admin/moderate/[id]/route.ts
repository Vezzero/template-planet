import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { awardPoints } from "@/lib/queries";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const { id } = await params;
  const { action, reason } = await req.json();

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Azione non valida" }, { status: 400 });
  }

  const base = await db.memeBase.findUnique({ where: { id }, select: { authorId: true, status: true } });
  if (!base) return NextResponse.json({ error: "Non trovato" }, { status: 404 });

  const data =
    action === "approve"
      ? { status: "APPROVED", approvedAt: new Date() }
      : { status: "REJECTED", rejectionReason: reason ?? null };

  await db.$transaction([
    db.memeBase.update({ where: { id }, data }),
    db.adminLog.create({
      data: {
        adminId: session.user.id,
        action: action === "approve" ? "APPROVE_BASE" : "REJECT_BASE",
        targetType: "MemeBase",
        targetId: id,
        details: reason ?? undefined,
      },
    }),
  ]);

  // Award points when approving a new base (only if it was PENDING → APPROVED)
  if (action === "approve" && base.status === "PENDING") {
    await awardPoints(base.authorId, 50, "BASE_APPROVED", id);
  }

  return NextResponse.json({ success: true });
}
