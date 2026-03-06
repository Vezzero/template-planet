import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LayoutDashboard, Clock, FolderOpen, Users, Lightbulb } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    redirect("/");
  }

  const [pendingBases, pendingSuggestions] = await Promise.all([
    db.memeBase.count({ where: { status: "PENDING" } }),
    db.suggestion.count({ where: { status: "PENDING" } }),
  ]);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, badge: 0 },
    { href: "/admin/moderazione", label: "Moderazione", icon: Clock, badge: pendingBases },
    { href: "/admin/suggerimenti", label: "Suggerimenti", icon: Lightbulb, badge: pendingSuggestions },
    { href: "/admin/categorie", label: "Categorie", icon: FolderOpen, badge: 0 },
    { href: "/admin/utenti", label: "Utenti", icon: Users, badge: 0 },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-zinc-800 bg-zinc-950 p-4 shrink-0 hidden md:block">
        <div className="mb-6">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-3 mb-1">Admin Panel</p>
          <p className="text-xs text-zinc-600 px-3">@{session.user.username}</p>
        </div>
        <nav className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="text-xs bg-amber-400 text-black font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
