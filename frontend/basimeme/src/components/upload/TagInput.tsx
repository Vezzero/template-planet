"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
};

export function TagInput({ tags, onChange, maxTags = 10, placeholder = "Aggiungi tag..." }: Props) {
  const [input, setInput] = useState("");

  const addTag = (val: string) => {
    const tag = val.trim().toLowerCase().replace(/[^a-z0-9-_àèéìíòóùú ]/g, "").replace(/\s+/g, "-");
    if (!tag || tags.includes(tag) || tags.length >= maxTags) return;
    onChange([...tags, tag]);
    setInput("");
  };

  const removeTag = (t: string) => onChange(tags.filter((tag) => tag !== t));

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 min-h-[42px]",
        "focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/30 transition-colors"
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-md border border-zinc-700"
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {tags.length < maxTags && (
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => { if (input) addTag(input); }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
        />
      )}
      <span className="ml-auto text-xs text-zinc-600 self-center shrink-0">
        {tags.length}/{maxTags}
      </span>
    </div>
  );
}
