"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { formatNumber } from "@/lib/utils";

type Props = {
  memeId: string;
  initialCount: number;
  initialUpvoted: boolean;
  isLoggedIn: boolean;
};

export function UpvoteButton({ memeId, initialCount, initialUpvoted, isLoggedIn }: Props) {
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!isLoggedIn) { window.location.href = "/auth/login"; return; }
    setLoading(true);
    const wasUpvoted = upvoted;
    setUpvoted(!wasUpvoted);
    setCount((c) => wasUpvoted ? c - 1 : c + 1);
    try {
      await fetch(`/api/upvote/${memeId}`, { method: wasUpvoted ? "DELETE" : "POST" });
    } catch {
      setUpvoted(wasUpvoted);
      setCount((c) => wasUpvoted ? c + 1 : c - 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={upvoted ? "upvoted" : "secondary"}
      size="lg"
      className="w-full"
      onClick={toggle}
      disabled={loading}
    >
      <Heart className={`h-4 w-4 ${upvoted ? "fill-current" : ""}`} />
      {upvoted ? "Hai votato" : "Upvote"}
      <span className="ml-auto font-bold tabular-nums">{formatNumber(count)}</span>
    </Button>
  );
}
