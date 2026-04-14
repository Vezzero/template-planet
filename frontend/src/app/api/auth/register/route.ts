import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Registrazione disponibile solo con Google" },
    { status: 403 },
  );
}
