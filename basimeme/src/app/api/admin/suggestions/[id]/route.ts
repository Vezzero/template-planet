import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { awardPoints } from "@/lib/queries";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const { id } = await params;
  const { action, adminNote } = await req.json();

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Azione non valida" }, { status: 400 });
  }

  const suggestion = await db.suggestion.findUnique({
    where: { id },
    include: {
      memeBase: {
        include: { tags: { include: { tag: true } } },
      },
    },
  });

  if (!suggestion || suggestion.status !== "PENDING") {
    return NextResponse.json({ error: "Suggerimento non trovato o già elaborato" }, { status: 404 });
  }

  if (action === "reject") {
    await db.suggestion.update({
      where: { id },
      data: { status: "REJECTED", adminNote: adminNote ?? null, resolvedAt: new Date(), resolvedById: session.user.id },
    });
    return NextResponse.json({ success: true });
  }

  // APPROVE ─────────────────────────────────────────────────────────────────
  if (suggestion.type === "REMOVE") {
    // Mark the meme as removed
    await db.$transaction([
      db.memeBase.update({ where: { id: suggestion.memeBaseId }, data: { status: "REMOVED" } }),
      db.suggestion.update({
        where: { id },
        data: { status: "APPROVED", adminNote: adminNote ?? null, resolvedAt: new Date(), resolvedById: session.user.id },
      }),
      db.adminLog.create({
        data: {
          adminId: session.user.id,
          action: "REMOVE_BASE",
          targetType: "MemeBase",
          targetId: suggestion.memeBaseId,
          details: suggestion.message ?? undefined,
        },
      }),
    ]);
    await awardPoints(suggestion.userId, 15, "SUGGESTION_REMOVE_APPROVED", id);
  } else {
    // Apply the edit to the meme
    const updateData: Record<string, unknown> = {};
    if (suggestion.proposedTitle) updateData.title = suggestion.proposedTitle;
    if (suggestion.proposedDescription) updateData.description = suggestion.proposedDescription;
    if (suggestion.proposedCategoryId) updateData.categoryId = suggestion.proposedCategoryId;

    await db.$transaction(async (tx) => {
      if (Object.keys(updateData).length > 0) {
        await tx.memeBase.update({ where: { id: suggestion.memeBaseId }, data: updateData });
      }

      // Apply new tags if proposed
      if (suggestion.proposedTags) {
        const tagNames: string[] = JSON.parse(suggestion.proposedTags);
        if (tagNames.length > 0) {
          const tagRecords = await Promise.all(
            tagNames.map(async (name) => {
              const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
              return tx.tag.upsert({
                where: { slug },
                update: {},
                create: { name: name.toLowerCase(), slug },
              });
            })
          );
          await tx.memeBaseTag.deleteMany({ where: { memeBaseId: suggestion.memeBaseId } });
          await tx.memeBaseTag.createMany({
            data: tagRecords.map((t) => ({ memeBaseId: suggestion.memeBaseId, tagId: t.id })),
          });
        }
      }

      await tx.suggestion.update({
        where: { id },
        data: { status: "APPROVED", adminNote: adminNote ?? null, resolvedAt: new Date(), resolvedById: session.user.id },
      });

      await tx.adminLog.create({
        data: {
          adminId: session.user.id,
          action: "APPROVE_SUGGESTION",
          targetType: "Suggestion",
          targetId: id,
        },
      });
    });

    await awardPoints(suggestion.userId, 20, "SUGGESTION_EDIT_APPROVED", id);
  }

  return NextResponse.json({ success: true });
}
