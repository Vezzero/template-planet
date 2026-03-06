import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Solo gli admin possono fare questo" }, { status: 403 });
  }

  const { id } = await params;
  const { action } = await req.json();

  const updates: Record<string, unknown> = {};

  if (action === "promote_mod") updates.role = "MODERATOR";
  else if (action === "demote_user") updates.role = "USER";
  else if (action === "ban") updates.banned = true;
  else if (action === "unban") updates.banned = false;
  else return NextResponse.json({ error: "Azione non valida" }, { status: 400 });

  await db.$transaction([
    db.user.update({ where: { id }, data: updates }),
    db.adminLog.create({
      data: {
        adminId: session.user.id,
        action: action.toUpperCase(),
        targetType: "User",
        targetId: id,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
