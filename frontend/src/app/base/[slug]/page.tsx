import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getMemeBySlug, getRelatedMemes, getCategories } from "@/lib/queries";
import { db } from "@/lib/db";
import { CategoryPill } from "@/components/meme/CategoryPill";
import { FileTypeBadge } from "@/components/meme/FileTypeBadge";
import { TrendingBadge } from "@/components/meme/TrendingBadge";
import { MemeGrid } from "@/components/meme/MemeGrid";
import { DownloadButton } from "@/components/meme/DownloadButton";
import { UpvoteButton } from "@/components/meme/UpvoteButton";
import { ShareButtons } from "@/components/meme/ShareButtons";
import { SuggestEditModal } from "@/components/meme/SuggestEditModal";
import { formatNumber, timeAgo, formatBytes } from "@/lib/utils";
import { Eye, Download, Calendar, HardDrive, Heart } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meme = await getMemeBySlug(slug);
  if (!meme) return { title: "Base non trovata" };
  const description = meme.description ?? `Template meme "${meme.title}" - scarica gratis su BasiMeme.it`;
  const tags = meme.tags.map(({ tag }) => tag.name);
  return {
    title: meme.title,
    description,
    keywords: ["meme", "template", meme.title, ...tags],
    openGraph: {
      title: `${meme.title} - BasiMeme.it`,
      description,
      images: meme.thumbnailUrl ? [meme.thumbnailUrl] : meme.fileType !== "VIDEO" ? [meme.fileUrl] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: meme.title,
      description,
      images: meme.fileType !== "VIDEO" ? [meme.fileUrl] : [],
    },
    alternates: {
      canonical: `https://basimeme.it/base/${slug}`,
    },
  };
}

export default async function BaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const [meme, categories] = await Promise.all([
    getMemeBySlug(slug, session?.user?.id),
    getCategories(),
  ]);

  if (!meme || meme.status !== "APPROVED") notFound();

  // Increment views (fire and forget)
  db.memeBase.update({ where: { id: meme.id }, data: { viewsCount: { increment: 1 } } }).catch(() => {});

  const related = await getRelatedMemes(meme.id, meme.categoryId, meme.authorId);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: meme.title,
    description: meme.description ?? `Template meme: ${meme.title}`,
    url: `https://basimeme.it/base/${meme.slug}`,
    contentUrl: meme.fileUrl,
    ...(meme.width && meme.height ? { width: meme.width, height: meme.height } : {}),
    creator: { "@type": "Person", name: meme.author.username },
    datePublished: meme.approvedAt?.toISOString() ?? meme.createdAt.toISOString(),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Main media ── */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 mb-4 shadow-xl">
              {meme.fileType === "VIDEO" ? (
                <video src={meme.fileUrl} controls className="w-full max-h-[520px] object-contain" />
              ) : (
                <div
                  className="relative w-full"
                  style={{ aspectRatio: meme.width && meme.height ? `${meme.width}/${meme.height}` : "4/3", maxHeight: "520px" }}
                >
                  <Image
                    src={meme.fileUrl}
                    alt={meme.title}
                    fill
                    className="object-contain"
                    priority
                    unoptimized={meme.fileType === "GIF"}
                  />
                </div>
              )}
            </div>

            {/* Mobile actions */}
            <div className="flex gap-2 lg:hidden mb-6">
              <div className="flex-1">
                <DownloadButton memeId={meme.id} fileUrl={meme.fileUrl} title={meme.title} />
              </div>
              <UpvoteButton
                memeId={meme.id}
                initialCount={meme.upvotesCount}
                initialUpvoted={meme._userHasUpvoted}
                isLoggedIn={!!session}
              />
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-10">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-400 rounded-full inline-block" />
                  Basi correlate
                </h2>
                <MemeGrid initialMemes={related as any} isLoggedIn={!!session} />
              </div>
            )}
          </div>

          {/* ── Sidebar info ── */}
          <div className="space-y-4">
            {/* Title & badges */}
            <div>
              <div className="flex items-start gap-2 flex-wrap mb-2">
                <FileTypeBadge fileType={meme.fileType} />
                {meme.isTrending && <TrendingBadge />}
              </div>
              <h1 className="text-2xl font-black text-white leading-tight">{meme.title}</h1>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 bg-zinc-900 rounded-xl border border-zinc-800 p-3 hover:border-zinc-700 transition-colors">
              {meme.author.image ? (
                <Image src={meme.author.image} alt={meme.author.username} width={40} height={40} className="rounded-full ring-2 ring-zinc-700" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-amber-400 text-black flex items-center justify-center font-black text-sm ring-2 ring-amber-400/30">
                  {meme.author.username[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500">Caricata da</p>
                <Link href={`/u/${meme.author.username}`} className="text-white font-semibold hover:text-amber-400 transition-colors text-sm">
                  @{meme.author.username}
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Eye, label: "Visualiz.", value: formatNumber(meme.viewsCount) },
                { icon: Download, label: "Download", value: formatNumber(meme.downloadsCount) },
                { icon: Heart, label: "Upvote", value: formatNumber(meme.upvotesCount) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                  <Icon className="h-3.5 w-3.5 text-zinc-500 mx-auto mb-1.5" />
                  <p className="text-white font-bold text-sm leading-none">{value}</p>
                  <p className="text-zinc-600 text-[10px] mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Caricata */}
            <div className="flex items-center gap-2 text-xs text-zinc-600 px-1">
              <Calendar className="h-3.5 w-3.5" />
              {timeAgo(meme.createdAt)}
              {meme.fileSize && (
                <>
                  <span className="text-zinc-700">·</span>
                  <HardDrive className="h-3.5 w-3.5" />
                  {formatBytes(meme.fileSize)}
                </>
              )}
              {meme.width && meme.height && (
                <>
                  <span className="text-zinc-700">·</span>
                  {meme.width}×{meme.height}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex flex-col gap-2">
              <DownloadButton memeId={meme.id} fileUrl={meme.fileUrl} title={meme.title} />
              <UpvoteButton
                memeId={meme.id}
                initialCount={meme.upvotesCount}
                initialUpvoted={meme._userHasUpvoted}
                isLoggedIn={!!session}
              />
            </div>

            {/* Share */}
            <ShareButtons slug={meme.slug} title={meme.title} />

            {/* Category */}
            {meme.category && (
              <div>
                <p className="text-xs text-zinc-500 mb-2 font-medium">Categoria</p>
                <CategoryPill
                  name={meme.category.name}
                  slug={meme.category.slug}
                  iconEmoji={meme.category.iconEmoji}
                  color={meme.category.color}
                />
              </div>
            )}

            {/* Tags */}
            {meme.tags.length > 0 && (
              <div>
                <p className="text-xs text-zinc-500 mb-2 font-medium">Tag</p>
                <div className="flex flex-wrap gap-1.5">
                  {meme.tags.map(({ tag }) => (
                    <Link
                      key={tag.id}
                      href={`/tag/${tag.slug}`}
                      className="bg-zinc-800/80 text-zinc-400 text-xs px-2.5 py-1 rounded-md border border-zinc-700 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {meme.description && (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wider">Descrizione</p>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{meme.description}</p>
              </div>
            )}

            {/* Suggest edit - only for logged-in users */}
            {session && (
              <div className="pt-2 border-t border-zinc-800/50">
                <SuggestEditModal
                  memeBaseId={meme.id}
                  currentTitle={meme.title}
                  currentDescription={meme.description}
                  currentCategoryId={meme.categoryId}
                  currentTags={meme.tags.map(({ tag }) => tag.name)}
                  categories={categories as any}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
