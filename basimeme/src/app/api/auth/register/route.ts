import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(24).regex(/^[a-z0-9_]+$/i),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }
    const { email, username, password } = parsed.data;

    const [existingEmail, existingUsername] = await Promise.all([
      db.user.findUnique({ where: { email } }),
      db.user.findUnique({ where: { username: username.toLowerCase() } }),
    ]);

    if (existingEmail) return NextResponse.json({ error: "Email già registrata" }, { status: 409 });
    if (existingUsername) return NextResponse.json({ error: "Username già preso" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 12);
    await db.user.create({
      data: { email, username: username.toLowerCase(), password: hashed },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}
