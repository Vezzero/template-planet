import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "AI search non configurata. Aggiungi ANTHROPIC_API_KEY in .env" },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nessuna immagine ricevuta" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = file.type || "image/jpeg";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: base64 },
              },
              {
                type: "text",
                text: `Questa è un'immagine meme o un template per meme. Analizzala e restituisci SOLO una stringa di ricerca in italiano (max 5 parole chiave separate da spazio) che descriva il soggetto/personaggio/situazione mostrata, utile per trovare template simili in una libreria di basi meme. Rispondi SOLO con le parole chiave, nessun'altra spiegazione.`,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json({ error: "Errore AI" }, { status: 500 });
    }

    const data = await res.json();
    const query = data.content?.[0]?.text?.trim() ?? "";

    return NextResponse.json({ query });
  } catch (err) {
    console.error("search-by-image error:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
