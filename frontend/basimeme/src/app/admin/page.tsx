import Link from "next/link";
import { db } from "@/lib/db";
import { formatNumber } from "@/lib/utils";
import { Package, Clock, Users, Heart, CheckCircle, Lightbulb, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const [pending, total, users, upvotesToday, approvedToday, pendingSuggestions, approvedSuggestions] = await Promise.all([
    db.memeBase.count({ where: { status: "PENDING" } }),
    db.memeBase.count({ where: { status: "APPROVED" } }),
    db.user.count(),
    db.upvote.count({ where: { createdAt: { gte: today } } }),
    db.memeBase.count({ where: { status: "APPROVED", approvedAt: { gte: today } } }),
    db.suggestion.count({ where: { status: "PENDING" } }),
    db.suggestion.count({ where: { status: "APPROVED" } }),
  ]);

  const stats = [
    { label: "Basi in attesa", value: pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", href: "/admin/moderazione" },
    { label: "Basi approvate", value: total, icon: Package, color: "text-green-400", bg: "bg-green-400/10", href: null },
    { label: "Utenti registrati", value: users, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", href: "/admin/utenti" },
    { label: "Upvote oggi", value: upvotesToday, icon: Heart, color: "text-red-400", bg: "bg-red-400/10", href: null },
    { label: "Approvate oggi", value: approvedToday, icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", href: null },
    { label: "Suggerimenti in attesa", value: pendingSuggestions, icon: Lightbulb, color: "text-purple-400", bg: "bg-purple-400/10", href: "/admin/suggerimenti" },
    { label: "Suggerimenti approvati", value: approvedSuggestions, icon: Lightbulb, color: "text-zinc-400", bg: "bg-zinc-800", href: null },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white mb-8">Dashboard Admin</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => {
          const inner = (
            <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-full ${href ? "hover:border-zinc-700 transition-colors" : ""}`}>
              <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-3xl font-black text-white">{formatNumber(value)}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-zinc-500 text-sm">{label}</p>
                {href && <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />}
              </div>
            </div>
          );
          return href ? (
            <Link key={label} href={href}>{inner}</Link>
          ) : (
            <div key={label}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
