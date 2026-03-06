import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") ?? "meme";

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Fetch the image server-side (no CORS restrictions)
  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
  }

  const contentType = res.headers.get("content-type") ?? "application/octet-stream";
  const buffer = await res.arrayBuffer();

  // Determine extension from content-type
  const ext = contentType.includes("png") ? "png"
    : contentType.includes("gif") ? "gif"
    : contentType.includes("webp") ? "webp"
    : contentType.includes("mp4") ? "mp4"
    : "jpg";

  const safeFilename = filename.replace(/[^a-zA-Z0-9\-_]/g, "_").slice(0, 80);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeFilename}.${ext}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
