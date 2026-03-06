import React from "react";
import { Badge } from "@/components/ui/badge";
import { Film, ImageIcon, Zap, Layout } from "lucide-react";

type Props = { fileType: string };

const config: Record<string, { label: string; variant: "image" | "gif" | "video" | "default"; icon: React.ElementType }> = {
  IMAGE: { label: "IMG", variant: "image", icon: ImageIcon },
  GIF: { label: "GIF", variant: "gif", icon: Zap },
  VIDEO: { label: "VIDEO", variant: "video", icon: Film },
  TEMPLATE: { label: "TEMPLATE", variant: "default", icon: Layout },
};

export function FileTypeBadge({ fileType }: Props) {
  const { label, variant, icon: Icon } = config[fileType] ?? config.IMAGE;
  return (
    <Badge variant={variant}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
