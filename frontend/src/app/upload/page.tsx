"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { TagInput } from "@/components/upload/TagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, Upload } from "lucide-react";

type Category = { id: string; name: string; iconEmoji: string };

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    tags: [] as string[],
  });
  const [step, setStep] = useState<"form" | "uploading" | "done">("form");
  const [error, setError] = useState("");
  const [resultSlug, setResultSlug] = useState("");

  // Load categories on mount
  useState(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  });

  const handleFileSelect = (f: File, p: string) => {
    setFile(f);
    setPreview(p);
    if (!form.title) {
      setForm((prev) => ({ ...prev, title: f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Seleziona un file"); return; }
    if (!form.title.trim()) { setError("Inserisci un titolo"); return; }

    setStep("uploading");
    setError("");

    try {
      let publicUrl: string;
      let fileType: string;

      // 1. Prova presigned URL (R2) - fallback su upload locale
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, fileSize: file.size }),
      });

      if (presignRes.status === 503) {
        // R2 non configurato → upload locale in public/uploads/
        const fd = new FormData();
        fd.append("file", file);
        const localRes = await fetch("/api/upload/local", { method: "POST", body: fd });
        if (!localRes.ok) {
          const err = await localRes.json();
          throw new Error(err.error);
        }
        ({ publicUrl, fileType } = await localRes.json());
      } else if (!presignRes.ok) {
        const err = await presignRes.json();
        throw new Error(err.error);
      } else {
        const { uploadUrl, publicUrl: r2Url, fileType: r2Type } = await presignRes.json();
        // Upload diretto a R2
        await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        publicUrl = r2Url;
        fileType = r2Type;
      }

      // 3. Crea record nel database
      const createRes = await fetch("/api/bases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          fileUrl: publicUrl,
          fileType,
          fileSize: file.size,
          categoryId: form.categoryId || undefined,
          tags: form.tags,
        }),
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error);
      }
      const { slug } = await createRes.json();
      setResultSlug(slug);
      setStep("done");
    } catch (err: any) {
      setError(err.message || "Errore durante l'upload");
      setStep("form");
    }
  };

  if (step === "done") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10">
          <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-2">Upload completato!</h1>
          <p className="text-zinc-400 mb-6">
            La tua base è stata inviata ed è in attesa di approvazione da parte dei moderatori.
            Ti notificheremo quando sarà pubblicata.
          </p>
          <div className="flex items-center justify-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 mb-6">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">In attesa di approvazione</span>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => router.push("/dashboard")}>
              Le mie basi
            </Button>
            <Button onClick={() => { setStep("form"); setFile(null); setPreview(""); setForm({ title: "", description: "", categoryId: "", tags: [] }); }}>
              Carica un'altra
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Upload className="h-7 w-7 text-amber-400" />
          Carica una base
        </h1>
        <p className="text-zinc-400 mt-2">
          Condividi il tuo template meme con la community. Sarà revisionato dai moderatori prima della pubblicazione.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File upload */}
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            File <span className="text-red-400">*</span>
          </label>
          <UploadDropzone
            onFileSelect={handleFileSelect}
            preview={preview}
            fileType={file?.type}
            onClear={() => { setFile(null); setPreview(""); }}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            Titolo <span className="text-red-400">*</span>
          </label>
          <Input
            placeholder="Es. Distracted Boyfriend, Drake meme..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={120}
          />
          <p className="text-xs text-zinc-600 mt-1">{form.title.length}/120</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            Descrizione <span className="text-zinc-600">(opzionale)</span>
          </label>
          <Textarea
            placeholder="Descrivi la base meme, il suo utilizzo, l'origine..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            maxLength={2000}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Categoria</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full rounded-lg bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
          >
            <option value="">- Seleziona una categoria -</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.iconEmoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            Tag <span className="text-zinc-600">(max 10)</span>
          </label>
          <TagInput
            tags={form.tags}
            onChange={(tags) => setForm({ ...form, tags })}
            placeholder="reazione, drakeposting, italiano..."
          />
          <p className="text-xs text-zinc-600 mt-1">Premi Invio o virgola per aggiungere un tag</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={step === "uploading"}
          disabled={!file}
        >
          {step === "uploading" ? "Caricamento in corso..." : "Invia per approvazione"}
        </Button>
      </form>
    </div>
  );
}
