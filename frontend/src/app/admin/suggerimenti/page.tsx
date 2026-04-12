import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { timeAgo } from "@/lib/utils";
import { Lightbulb, Trash2, ChevronRight, Inbox, Pencil } from "lucide-react";
import { SuggestionActions } from "@/components/admin/SuggestionActions";

export const dynamic = "force-dynamic";

export default async function AdminSuggerimentiPage() {
  const suggestions = await db.suggestion.findMany({
    where: { status: "PENDING" },
    include: {
      user: { select: { username: true, image: true } },
      memeBase: {
        include: {
          category: { select: { name: true, iconEmoji: true } },
          tags: { include: { tag: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const edits = suggestions.filter((s) => s.type === "EDIT");
  const removals = suggestions.filter((s) => s.type === "REMOVE");

  if (suggestions.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-zinc-500">
        <Inbox className="h-16 w-16 mb-4 opacity-30" />
        <p className="text-xl font-semibold">Nessuna proposta in attesa</p>
        <p className="text-sm mt-1">La coda è vuota. Ottimo!</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb className="h-6 w-6 text-amber-400" />
        <h1 className="text-2xl font-black text-white">Suggerimenti utenti</h1>
        <span className="bg-amber-400/10 text-amber-400 text-sm font-bold px-3 py-1 rounded-full border border-amber-400/20">
          {suggestions.length}
        </span>
      </div>

      {/* Edit suggestions */}
      {edits.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
            <Pencil className="h-4 w-4" /> Modifiche proposte ({edits.length})
          </h2>
          <div className="space-y-4">
            {edits.map((s) => (
              <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                {/* Base info bar */}
                <div className="flex items-center gap-3 px-5 py-3 bg-zinc-800/40 border-b border-zinc-800">
                  <div className="relative h-8 w-8 rounded overflow-hidden bg-zinc-700 shrink-0">
                    {s.memeBase.fileType !== "VIDEO" && (
                      <Image src={s.memeBase.fileUrl} alt={s.memeBase.title} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/base/${s.memeBase.slug}`}
                      target="_blank"
                      className="font-semibold text-white text-sm hover:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      {s.memeBase.title}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="text-xs text-zinc-500 flex items-center gap-2">
                    {s.user.image ? (
                      <Image src={s.user.image} alt={s.user.username} width={18} height={18} className="rounded-full" />
                    ) : (
                      <div className="h-4.5 w-4.5 rounded-full bg-amber-400 text-black text-[9px] flex items-center justify-center font-bold">
                        {s.user.username[0].toUpperCase()}
                      </div>
                    )}
                    @{s.user.username} · {timeAgo(s.createdAt)}
                  </div>
                </div>

                {/* Diff table */}
                <div className="p-5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-zinc-500 uppercase tracking-widest">
                        <th className="text-left pb-3 w-24">Campo</th>
                        <th className="text-left pb-3">Attuale</th>
                        <th className="text-center pb-3 w-8">→</th>
                        <th className="text-left pb-3 text-amber-400">Proposto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {s.proposedTitle && (
                        <tr>
                          <td className="py-2.5 pr-3 text-zinc-500 text-xs align-top">Titolo</td>
                          <td className="py-2.5 pr-3 text-zinc-300 align-top">{s.memeBase.title}</td>
                          <td className="py-2.5 text-center text-zinc-600 align-top">→</td>
                          <td className="py-2.5 pl-3 text-white font-medium align-top">{s.proposedTitle}</td>
                        </tr>
                      )}
                      {s.proposedDescription !== null && s.proposedDescription !== undefined && (
                        <tr>
                          <td className="py-2.5 pr-3 text-zinc-500 text-xs align-top">Descr.</td>
                          <td className="py-2.5 pr-3 text-zinc-400 align-top text-xs max-w-[200px]">{s.memeBase.description ?? "-"}</td>
                          <td className="py-2.5 text-center text-zinc-600 align-top">→</td>
                          <td className="py-2.5 pl-3 text-white text-xs align-top">{s.proposedDescription}</td>
                        </tr>
                      )}
                      {s.proposedCategoryId && (
                        <tr>
                          <td className="py-2.5 pr-3 text-zinc-500 text-xs align-top">Cat.</td>
                          <td className="py-2.5 pr-3 text-zinc-400 align-top">{s.memeBase.category?.name ?? "-"}</td>
                          <td className="py-2.5 text-center text-zinc-600 align-top">→</td>
                          <td className="py-2.5 pl-3 text-white align-top font-medium">{s.proposedCategoryId}</td>
                        </tr>
                      )}
                      {s.proposedTags && (
                        <tr>
                          <td className="py-2.5 pr-3 text-zinc-500 text-xs align-top">Tag</td>
                          <td className="py-2.5 pr-3 text-zinc-400 align-top text-xs">
                            {s.memeBase.tags.map((t) => `#${t.tag.name}`).join(" ") || "-"}
                          </td>
                          <td className="py-2.5 text-center text-zinc-600 align-top">→</td>
                          <td className="py-2.5 pl-3 text-white text-xs align-top">
                            {(JSON.parse(s.proposedTags) as string[]).map((t) => `#${t}`).join(" ")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {s.message && (
                    <p className="mt-3 text-xs text-zinc-500 italic">"{s.message}"</p>
                  )}

                  <div className="mt-4">
                    <SuggestionActions suggestionId={s.id} type="EDIT" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Removal suggestions */}
      {removals.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
            <Trash2 className="h-4 w-4 text-red-400" /> Richieste di rimozione ({removals.length})
          </h2>
          <div className="space-y-4">
            {removals.map((s) => (
              <div key={s.id} className="bg-zinc-900 border border-red-900/30 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-red-950/20 border-b border-red-900/20">
                  <div className="relative h-8 w-8 rounded overflow-hidden bg-zinc-700 shrink-0">
                    {s.memeBase.fileType !== "VIDEO" && (
                      <Image src={s.memeBase.fileUrl} alt={s.memeBase.title} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/base/${s.memeBase.slug}`}
                      target="_blank"
                      className="font-semibold text-white text-sm hover:text-red-400 transition-colors"
                    >
                      {s.memeBase.title}
                    </Link>
                  </div>
                  <span className="text-xs text-zinc-500">
                    @{s.user.username} · {timeAgo(s.createdAt)}
                  </span>
                </div>
                <div className="p-5">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
                    <p className="text-xs text-red-400 font-semibold mb-1">Motivo della richiesta</p>
                    <p className="text-zinc-300 text-sm">{s.message}</p>
                  </div>
                  <SuggestionActions suggestionId={s.id} type="REMOVE" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
