"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import Image from "next/image";
import { Upload, Film, X, AlertCircle } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

type Props = {
  onFileSelect: (file: File, preview: string) => void;
  preview?: string;
  fileType?: string;
  onClear?: () => void;
};

const ACCEPTED = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
};

export function UploadDropzone({ onFileSelect, preview, fileType, onClear }: Props) {
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError("");
      if (rejected.length > 0) {
        const code = rejected[0].errors[0]?.code;
        if (code === "file-too-large") setError("File troppo grande (max 50MB)");
        else if (code === "file-invalid-type") setError("Tipo file non supportato");
        else setError("File non valido");
        return;
      }
      if (accepted.length === 0) return;
      const file = accepted[0];
      const url = URL.createObjectURL(file);
      onFileSelect(file, url);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  });

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 group">
        {fileType?.startsWith("video") ? (
          <video src={preview} className="w-full max-h-64 object-contain" controls />
        ) : (
          <div className="relative w-full aspect-video">
            <Image src={preview} alt="Preview" fill className="object-contain" unoptimized />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={onClear}
            className="bg-red-500 hover:bg-red-400 text-white rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
            Preview
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
          "flex flex-col items-center justify-center p-10 gap-3 text-center",
          isDragActive
            ? "border-amber-400 bg-amber-400/5 scale-[1.01]"
            : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-900"
        )}
      >
        <input {...getInputProps()} />
        <div className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
          isDragActive ? "bg-amber-400/20" : "bg-zinc-800"
        )}>
          {isDragActive ? (
            <Upload className="h-7 w-7 text-amber-400" />
          ) : (
            <Film className="h-7 w-7 text-zinc-400" />
          )}
        </div>

        {isDragActive ? (
          <p className="text-amber-400 font-semibold">Rilascia qui il file!</p>
        ) : (
          <>
            <div>
              <p className="font-semibold text-white">Trascina qui il tuo file</p>
              <p className="text-zinc-500 text-sm mt-1">oppure clicca per selezionarlo</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {["PNG", "JPG", "GIF", "WebP", "MP4"].map((f) => (
                <span key={f} className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-lg border border-zinc-700">
                  {f}
                </span>
              ))}
            </div>
            <p className="text-zinc-600 text-xs">Max 50MB</p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
