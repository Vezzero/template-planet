import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateUniqueSlug(base: string, existing?: string[]): string {
  const slug = slugify(base);
  if (!existing || !existing.includes(slug)) return slug;
  let i = 1;
  while (existing.includes(`${slug}-${i}`)) i++;
  return `${slug}-${i}`;
}

export function getFileType(mimeType: string): "IMAGE" | "GIF" | "VIDEO" | "TEMPLATE" {
  if (mimeType === "image/gif") return "GIF";
  if (mimeType.startsWith("video/")) return "VIDEO";
  return "IMAGE";
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} ${months === 1 ? "mese" : "mesi"} fa`;
  if (weeks > 0) return `${weeks} ${weeks === 1 ? "settimana" : "settimane"} fa`;
  if (days > 0) return `${days} ${days === 1 ? "giorno" : "giorni"} fa`;
  if (hours > 0) return `${hours} ${hours === 1 ? "ora" : "ore"} fa`;
  if (minutes > 0) return `${minutes} ${minutes === 1 ? "minuto" : "minuti"} fa`;
  return "adesso";
}
