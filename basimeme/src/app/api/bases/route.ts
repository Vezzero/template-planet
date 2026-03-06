import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const CreateBaseSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  fileUrl: z.string().url(),
  fileType: z.enum(["IMAGE", "GIF", "VIDEO", "TEMPLATE"]),
  width: z.number().optional(),
  height: z.number().optional(),
  fileSize: z.number().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateBaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dati non validi", details: parsed.error.issues }, { status: 400 });
  }

  const { title, description, fileUrl, fileType, width, height, fileSize, categoryId, tags } = parsed.data;

  // Check daily upload limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = await db.memeBase.count({
    where: { authorId: session.user.id, createdAt: { gte: today } },
  });
  if (todayCount >= 10 && session.user.role === "USER") {
    return NextResponse.json({ error: "Limite giornaliero raggiunto (10 upload/giorno)" }, { status: 429 });
  }

  // Generate unique slug
  let slug = slugify(title);
  const existing = await db.memeBase.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  // Upsert tags
  const tagRecords = await Promise.all(
    (tags ?? []).map(async (tagName) => {
      const tagSlug = slugify(tagName);
      return db.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName.toLowerCase(), slug: tagSlug },
      });
    })
  );

  const meme = await db.memeBase.create({
    data: {
      title,
      slug,
      description,
      fileUrl,
      fileType,
      width,
      height,
      fileSize,
      authorId: session.user.id,
      categoryId: categoryId || null,
      status: "PENDING",
      tags: {
        create: tagRecords.map((t) => ({ tagId: t.id })),
      },
    },
  });

  return NextResponse.json({ success: true, slug: meme.slug }, { status: 201 });
}
