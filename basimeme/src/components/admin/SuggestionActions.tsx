"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, MessageSquare } from "lucide-react";

type Props = { suggestionId: string; type: "EDIT" | "REMOVE" };

export function SuggestionActions({ suggestionId, type }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [showNote, setShowNote] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-xs text-zinc-500 italic">Elaborato.</p>;
  }

  const handle = async (action: "approve" | "reject") => {
    setLoading(action);
    const res = await fetch(`/api/admin/suggestions/${suggestionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, adminNote: adminNote || undefined }),
    });
    setLoading(null);
    if (res.ok) {
      setDone(true);
      router.refresh();
    }
  };

  return (
    <div className="space-y-3">
      {showNote && (
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Nota per l'utente (opzionale)</label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={2}
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2 resize-none focus:outline-none focus:border-zinc-500"
            placeholder="Es. Immagine già presente, modifica non necessaria..."
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => handle("approve")}
          disabled={!!loading}
          className="bg-green-600 hover:bg-green-500 text-white"
        >
          {loading === "approve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          {type === "REMOVE" ? "Approva rimozione" : "Approva modifica"}
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => handle("reject")}
          disabled={!!loading}
        >
          {loading === "reject" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
          Rifiuta
        </Button>
        <button
          onClick={() => setShowNote(!showNote)}
          className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
        >
          <MessageSquare className="h-3 w-3" />
          {showNote ? "Nascondi nota" : "Aggiungi nota"}
        </button>
      </div>
    </div>
  );
}
