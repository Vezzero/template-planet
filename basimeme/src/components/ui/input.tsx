import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, ...props }, ref) => (
    <div className="relative flex items-center">
      {leftIcon && (
        <span className="absolute left-3 text-zinc-500 pointer-events-none">{leftIcon}</span>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500",
          "px-3 py-2 text-sm transition-colors",
          "focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          leftIcon && "pl-9",
          rightIcon && "pr-9",
          className
        )}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-3 text-zinc-500">{rightIcon}</span>
      )}
    </div>
  )
);
Input.displayName = "Input";

export { Input };
