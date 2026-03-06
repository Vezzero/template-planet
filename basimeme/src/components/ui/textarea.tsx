import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500",
      "px-3 py-2 text-sm transition-colors resize-none",
      "focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
