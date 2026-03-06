import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-zinc-800 text-zinc-300 border border-zinc-700",
        amber: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
        green: "bg-green-500/10 text-green-400 border border-green-500/20",
        red: "bg-red-500/10 text-red-400 border border-red-500/20",
        blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        gif: "bg-green-500/15 text-green-300 border border-green-500/25",
        video: "bg-blue-500/15 text-blue-300 border border-blue-500/25",
        image: "bg-zinc-700/50 text-zinc-300 border border-zinc-600/50",
        trending: "bg-orange-500/15 text-orange-300 border border-orange-500/25",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
