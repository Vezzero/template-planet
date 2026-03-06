import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getMemes, getCategories } from "@/lib/queries";
import { db } from "@/lib/db";
import { MemeGrid } from "@/components/meme/MemeGrid";
import { CategoryPill } from "@/components/meme/CategoryPill";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await db.category.findUnique({ where: { slug } });
  if (!cat) return { title: "Categoria non trovata" };
  return { title: `${cat.iconEmoji} ${cat.name} — Basi meme` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const category = await db.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const [{ memes }, allCategories] = await Promise.all([
    getMemes({ category: slug, sort: "top", userId: session?.user?.id }),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{category.iconEmoji}</span>
          <h1 className="text-3xl font-black text-white">{category.name}</h1>
        </div>
        {category.description && (
          <p className="text-zinc-400 mt-1">{category.description}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          {allCategories.filter((c) => c.slug !== slug).map((cat) => (
            <CategoryPill
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              iconEmoji={cat.iconEmoji}
              color={cat.color}
              size="sm"
            />
          ))}
        </div>
      </div>

      <MemeGrid initialMemes={memes as any} isLoggedIn={!!session} />
    </div>
  );
}
