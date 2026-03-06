import Image from "next/image";
import { db } from "@/lib/db";
import { ModerationActions } from "@/components/admin/ModerationActions";
import { CategoryPill } from "@/components/meme/CategoryPill";
import { FileTypeBadge } from "@/components/meme/FileTypeBadge";
import { formatBytes, timeAgo } from "@/lib/utils";
import { Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  const bases = await db.memeBase.findMany({
    where: { status: "PENDING" },
    include: {
      author: { select: { username: true, image: true, email: true } },
      category: { select: { name: true, slug: true, iconEmoji: true, color: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (bases.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-zinc-500">
        <Inbox className="h-16 w-16 mb-4 opacity-30" />
        <p className="text-xl font-semibold">Nessuna base in attesa</p>
        <p className="text-sm mt-1">La coda è vuota. Ottimo lavoro!</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-black text-white">Coda di moderazione</h1>
        <span className="bg-amber-400/10 text-amber-400 text-sm font-bold px-3 py-1 rounded-full border border-amber-400/20">
          {bases.length}
        </span>
      </div>

      <div className="space-y-6">
        {bases.map((base) => (
          <div key={base.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-0">
              {/* Preview */}
              <div className="lg:w-72 shrink-0 bg-zinc-950">
                {base.fileType === "VIDEO" ? (
                  <video src={base.fileUrl} className="w-full h-48 lg:h-full object-contain" controls />
                ) : (
                  <div className="relative h-48 lg:h-full min-h-[12rem]">
                    <Image src={base.fileUrl} alt={base.title} fill className="object-contain" unoptimized={base.fileType === "GIF"} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <FileTypeBadge fileType={base.fileType} />
                      {base.category && (
                        <CategoryPill
                          name={base.category.name}
                          slug={base.category.slug}
                          iconEmoji={base.category.iconEmoji}
                          color={base.category.color}
                          size="sm"
                          asLink={false}
                        />
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-white">{base.title}</h2>
                  </div>
                </div>

                {base.description && (
                  <p className="text-zinc-400 text-sm mb-3 line-clamp-3">{base.description}</p>
                )}

                {base.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {base.tags.map(({ tag }) => (
                      <span key={tag.id} className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-md">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                  <span>👤 @{base.author.username}</span>
                  <span>📧 {base.author.email}</span>
                  {base.fileSize && <span>💾 {formatBytes(base.fileSize)}</span>}
                  <span>🕐 {timeAgo(base.createdAt)}</span>
                </div>

                <ModerationActions memeId={base.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
