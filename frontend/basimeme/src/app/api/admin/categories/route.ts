import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const { name, iconEmoji, color } = await req.json();
  if (!name) return NextResponse.json({ error: "Nome richiesto" }, { status: 400 });

  const slug = slugify(name);
  const maxOrder = await db.category.findFirst({ orderBy: { order: "desc" }, select: { order: true } });

  const category = await db.category.create({
    data: { name, slug, iconEmoji: iconEmoji ?? "📁", color: color ?? "#f59e0b", order: (maxOrder?.order ?? 0) + 1 },
  });

  return NextResponse.json(category, { status: 201 });
}
