"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Loader2 } from "lucide-react";

export function ModerationActions({ memeId }: { memeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  const approve = async () => {
    setLoading("approve");
    await fetch(`/api/admin/moderate/${memeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    setLoading(null);
    router.refresh();
  };

  const reject = async () => {
    setLoading("reject");
    await fetch(`/api/admin/moderate/${memeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", reason }),
    });
    setLoading(null);
    setShowReject(false);
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={approve}
          disabled={!!loading}
          className="bg-green-600 hover:bg-green-500 text-white"
        >
          {loading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Approva
        </Button>
        <Button
          variant="danger"
          onClick={() => setShowReject(!showReject)}
          disabled={!!loading}
        >
          <X className="h-4 w-4" />
          Rifiuta
        </Button>
      </div>

      {showReject && (
        <div className="space-y-2">
          <Textarea
            placeholder="Motivo del rifiuto (verrà mostrato all'autore)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
          />
          <Button
            variant="danger"
            size="sm"
            onClick={reject}
            disabled={!!loading}
          >
            {loading === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Conferma rifiuto"}
          </Button>
        </div>
      )}
    </div>
  );
}
