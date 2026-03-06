import Image from "next/image";
import { db } from "@/lib/db";
import { formatNumber, timeAgo } from "@/lib/utils";
import { UserActions } from "@/components/admin/UserActions";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    include: {
      _count: { select: { bases: true, upvotes: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white mb-8">Gestione utenti</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wide">
              <th className="text-left p-4">Utente</th>
              <th className="text-left p-4 hidden sm:table-cell">Ruolo</th>
              <th className="text-left p-4 hidden md:table-cell">Basi</th>
              <th className="text-left p-4 hidden md:table-cell">Registrato</th>
              <th className="text-left p-4">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => (
              <tr key={user.id} className={`hover:bg-zinc-800/50 transition-colors ${user.banned ? "opacity-50" : ""}`}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <Image src={user.image} alt={user.username} width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-white">@{user.username}</p>
                      <p className="text-zinc-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  {user.role === "ADMIN" ? (
                    <Badge variant="amber"><Shield className="h-3 w-3" /> Admin</Badge>
                  ) : user.role === "MODERATOR" ? (
                    <Badge variant="blue"><Shield className="h-3 w-3" /> Mod</Badge>
                  ) : (
                    <Badge><User className="h-3 w-3" /> User</Badge>
                  )}
                  {user.banned && <Badge variant="red" className="ml-1">Bannato</Badge>}
                </td>
                <td className="p-4 hidden md:table-cell text-zinc-400">{user._count.bases}</td>
                <td className="p-4 hidden md:table-cell text-zinc-500 text-xs">{timeAgo(user.createdAt)}</td>
                <td className="p-4">
                  <UserActions userId={user.id} currentRole={user.role} banned={user.banned} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
