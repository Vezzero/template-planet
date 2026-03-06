import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPresignedUploadUrl, getPublicUrl } from "@/lib/r2";
import { getFileType } from "@/lib/utils";
import { randomBytes } from "crypto";

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm",
];
const MAX_MB = 50;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  if (!process.env.R2_ACCOUNT_ID) {
    return NextResponse.json({ error: "R2_NOT_CONFIGURED" }, { status: 503 });
  }

  try {
    const { fileName, contentType, fileSize } = await req.json();

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "Tipo file non supportato" }, { status: 400 });
    }
    if (fileSize > MAX_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File troppo grande (max ${MAX_MB}MB)` }, { status: 400 });
    }

    const ext = fileName.split(".").pop()?.toLowerCase() ?? "bin";
    const key = `uploads/${session.user.id}/${randomBytes(8).toString("hex")}.${ext}`;

    const uploadUrl = await getPresignedUploadUrl(key, contentType, MAX_MB);
    const publicUrl = getPublicUrl(key);
    const fileType = getFileType(contentType);

    return NextResponse.json({ uploadUrl, publicUrl, key, fileType });
  } catch (err: any) {
    console.error("Presign error:", err);
    return NextResponse.json({ error: "Errore generazione URL upload" }, { status: 500 });
  }
}
