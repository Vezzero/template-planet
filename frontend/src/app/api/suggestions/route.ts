import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json();
  const { memeBaseId, type, proposedTitle, proposedDescription, proposedCategoryId, proposedTags, message } = body;

  if (!memeBaseId || !type || !["EDIT", "REMOVE"].includes(type)) {
    return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
  }

  // Verify base exists and is approved
  const base = await db.memeBase.findUnique({ where: { id: memeBaseId }, select: { id: true, status: true } });
  if (!base || base.status !== "APPROVED") {
    return NextResponse.json({ error: "Base non trovata" }, { status: 404 });
  }

  // Prevent duplicate PENDING suggestions from same user for same base
  const existing = await db.suggestion.findFirst({
    where: { userId: session.user.id, memeBaseId, status: "PENDING" },
  });
  if (existing) {
    return NextResponse.json({ error: "Hai già una proposta in attesa per questa base" }, { status: 409 });
  }

  // Validate EDIT type has at least one proposed change
  if (type === "EDIT" && !proposedTitle && !proposedDescription && proposedCategoryId === undefined && (!proposedTags || !Array.isArray(proposedTags) || proposedTags.length === 0)) {
    return NextResponse.json({ error: "Proponi almeno una modifica" }, { status: 400 });
  }

  if (type === "REMOVE" && !message?.trim()) {
    return NextResponse.json({ error: "Spiega il motivo della richiesta di rimozione" }, { status: 400 });
  }

  const suggestion = await db.suggestion.create({
    data: {
      userId: session.user.id,
      memeBaseId,
      type,
      proposedTitle: proposedTitle?.trim() || null,
      proposedDescription: proposedDescription?.trim() || null,
      proposedCategoryId: proposedCategoryId || null,
      proposedTags: proposedTags ? JSON.stringify(proposedTags) : null,
      message: message?.trim() || null,
    },
  });

  return NextResponse.json({ success: true, id: suggestion.id });
}
