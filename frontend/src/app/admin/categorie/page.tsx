import { db } from "@/lib/db";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { bases: true } } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white mb-8">Gestione categorie</h1>
      <CategoryManager categories={categories as any} />
    </div>
  );
}
