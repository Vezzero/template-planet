"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

type Props = { memeId: string; fileUrl: string; title: string };

export function DownloadButton({ memeId, fileUrl, title }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Increment download counter (fire-and-forget)
      fetch(`/api/download/${memeId}`, { method: "POST" });

      // Fetch via server-side proxy to bypass CORS and force real download
      const proxyUrl = `/api/download-file?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(title)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="lg" className="w-full" onClick={handleDownload} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      Scarica
    </Button>
  );
}
