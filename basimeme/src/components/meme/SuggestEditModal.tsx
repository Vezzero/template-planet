"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/upload/TagInput";
import { Pencil, Trash2, X, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";

type Category = { id: string; name: string; iconEmoji: string };

type Props = {
  memeBaseId: string;
  currentTitle: string;
  currentDescription?: string | null;
  currentCategoryId?: string | null;
  currentTags: string[];
  categories: Category[];
};

type Tab = "edit" | "remove";

export function SuggestEditModal({ memeBaseId, currentTitle, currentDescription, currentCategoryId, currentTags, categories }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("edit");
  const [step, setStep] = useState<"form" | "loading" | "done">("form");
  const [error, setError] = useState("");

  // Edit form
  const [proposedTitle, setProposedTitle] = useState("");
  const [proposedDescription, setProposedDescription] = useState("");
  const [proposedCategoryId, setProposedCategoryId] = useState("");
  const [proposedTags, setProposedTags] = useState<string[]>([]);

  // Remove form
  const [removeMessage, setRemoveMessage] = useState("");

  const resetForm = () => {
    setStep("form");
    setError("");
    setProposedTitle("");
    setProposedDescription("");
    setProposedCategoryId("");
    setProposedTags([]);
    setRemoveMessage("");
  };

  const handleSubmit = async () => {
    setError("");
    setStep("loading");

    const body =
      tab === "edit"
        ? {
            memeBaseId,
            type: "EDIT",
            proposedTitle: proposedTitle || undefined,
            proposedDescription: proposedDescription || undefined,
            proposedCategoryId: proposedCategoryId || undefined,
            proposedTags: proposedTags.length > 0 ? proposedTags : undefined,
          }
        : { memeBaseId, type: "REMOVE", message: removeMessage };

    const res = await fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Errore durante l'invio");
      setStep("form");
      return;
    }

    setStep("done");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" />
        Proponi una modifica
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setOpen(false); resetForm(); }} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div>
            <h2 className="font-bold text-white text-lg">Proponi una modifica</h2>
            <p className="text-zinc-500 text-xs mt-0.5 truncate max-w-sm">{currentTitle}</p>
          </div>
          <button onClick={() => { setOpen(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === "done" ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="font-semibold text-white mb-1">Proposta inviata!</p>
            <p className="text-zinc-400 text-sm">
              {tab === "edit" ? "I moderatori esamineranno la tua proposta di modifica." : "I moderatori valuteranno la richiesta di rimozione."}
              {" "}Se approvata, guadagnerai punti esperienza.
            </p>
            <Button className="mt-5 w-full" onClick={() => { setOpen(false); resetForm(); }}>
              Chiudi
            </Button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              <button
                onClick={() => setTab("edit")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${tab === "edit" ? "text-amber-400 border-b-2 border-amber-400" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Pencil className="h-4 w-4" /> Modifica info
              </button>
              <button
                onClick={() => setTab("remove")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${tab === "remove" ? "text-red-400 border-b-2 border-red-400" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Trash2 className="h-4 w-4" /> Richiedi rimozione
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {tab === "edit" ? (
                <>
                  <p className="text-zinc-500 text-xs">Compila solo i campi che vuoi modificare. Lascia vuoti quelli che vanno bene.</p>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Titolo proposto
                      <span className="text-zinc-600 ml-1">attuale: "{currentTitle}"</span>
                    </label>
                    <Input
                      placeholder={currentTitle}
                      value={proposedTitle}
                      onChange={(e) => setProposedTitle(e.target.value)}
                      maxLength={120}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Descrizione proposta</label>
                    <Textarea
                      placeholder={currentDescription ?? "Nessuna descrizione attuale"}
                      value={proposedDescription}
                      onChange={(e) => setProposedDescription(e.target.value)}
                      rows={3}
                      maxLength={2000}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Categoria proposta</label>
                    <select
                      value={proposedCategoryId}
                      onChange={(e) => setProposedCategoryId(e.target.value)}
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                    >
                      <option value="">— Mantieni categoria attuale —</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.iconEmoji} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Tag proposti <span className="text-zinc-600">(sostituiranno quelli attuali)</span>
                    </label>
                    <TagInput
                      tags={proposedTags}
                      onChange={setProposedTags}
                      placeholder={currentTags.length > 0 ? `Attuali: ${currentTags.join(", ")}` : "Aggiungi tag..."}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400 text-sm font-medium mb-1">Richiesta di rimozione</p>
                    <p className="text-zinc-400 text-xs">
                      Segnala questa base per violazione del copyright, contenuto inappropriato o qualsiasi altro motivo valido.
                      I moderatori esamineranno la tua richiesta.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Motivo della richiesta <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      placeholder="Es. Immagine protetta da copyright, contenuto offensivo, duplicato di..."
                      value={removeMessage}
                      onChange={(e) => setRemoveMessage(e.target.value)}
                      rows={4}
                      maxLength={1000}
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-zinc-800 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => { setOpen(false); resetForm(); }}>
                Annulla
              </Button>
              <Button
                className="flex-1"
                variant={tab === "remove" ? "danger" : "default"}
                onClick={handleSubmit}
                disabled={step === "loading"}
              >
                {step === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {tab === "edit" ? "Invia proposta" : "Segnala rimozione"}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
