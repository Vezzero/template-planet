import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const { id } = await params;
  const userId = session.user.id;

  try {
    await db.$transaction([
      db.upvote.create({ data: { userId, memeBaseId: id } }),
      db.memeBase.update({ where: { id }, data: { upvotesCount: { increment: 1 } } }),
    ]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Già votato" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const { id } = await params;
  const userId = session.user.id;

  try {
    await db.$transaction([
      db.upvote.delete({ where: { userId_memeBaseId: { userId, memeBaseId: id } } }),
      db.memeBase.update({ where: { id }, data: { upvotesCount: { decrement: 1 } } }),
    ]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Voto non trovato" }, { status: 404 });
  }
}
