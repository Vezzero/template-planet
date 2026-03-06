"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = { userId: string; currentRole: string; banned: boolean };

export function UserActions({ userId, currentRole, banned }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const action = async (act: string) => {
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: act }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex gap-1 flex-wrap">
      {currentRole === "USER" && (
        <Button size="sm" variant="outline" onClick={() => action("promote_mod")} disabled={loading}>
          → Mod
        </Button>
      )}
      {currentRole === "MODERATOR" && (
        <Button size="sm" variant="outline" onClick={() => action("demote_user")} disabled={loading}>
          → User
        </Button>
      )}
      <Button
        size="sm"
        variant={banned ? "secondary" : "danger"}
        onClick={() => action(banned ? "unban" : "ban")}
        disabled={loading || currentRole === "ADMIN"}
      >
        {banned ? "Sbanna" : "Banna"}
      </Button>
    </div>
  );
}
