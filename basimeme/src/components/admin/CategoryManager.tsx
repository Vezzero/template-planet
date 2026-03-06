"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical } from "lucide-react";

type Category = {
  id: string; name: string; slug: string;
  iconEmoji: string; color: string; order: number;
  _count: { bases: number };
};

type Props = { categories: Category[] };

export function CategoryManager({ categories }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", iconEmoji: "📁", color: "#f59e0b" });
  const [loading, setLoading] = useState(false);

  const addCategory = async () => {
    if (!newCat.name.trim()) return;
    setLoading(true);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    setLoading(false);
    setAdding(false);
    setNewCat({ name: "", iconEmoji: "📁", color: "#f59e0b" });
    router.refresh();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Sicuro? Le basi associate perderanno la categoria.")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setAdding(!adding)}>
          <Plus className="h-4 w-4" />
          Nuova categoria
        </Button>
      </div>

      {adding && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-white">Nuova categoria</h3>
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Nome" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} />
            <Input placeholder="Emoji" value={newCat.iconEmoji} onChange={(e) => setNewCat({ ...newCat, iconEmoji: e.target.value })} maxLength={4} />
            <div className="flex items-center gap-2">
              <input type="color" value={newCat.color} onChange={(e) => setNewCat({ ...newCat, color: e.target.value })} className="h-9 w-12 rounded border border-zinc-700 bg-zinc-900 cursor-pointer" />
              <span className="text-sm text-zinc-400">Colore</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addCategory} loading={loading} size="sm">Crea</Button>
            <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Annulla</Button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase">
              <th className="text-left p-4 w-8"></th>
              <th className="text-left p-4">Categoria</th>
              <th className="text-left p-4">Slug</th>
              <th className="text-left p-4">Basi</th>
              <th className="text-left p-4">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 text-zinc-600 cursor-grab"><GripVertical className="h-4 w-4" /></td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.iconEmoji}</span>
                    <span className="font-medium text-white">{cat.name}</span>
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  </div>
                </td>
                <td className="p-4 text-zinc-500 font-mono text-xs">{cat.slug}</td>
                <td className="p-4 text-zinc-400">{cat._count.bases}</td>
                <td className="p-4">
                  <Button
                    size="icon-sm"
                    variant="danger"
                    onClick={() => deleteCategory(cat.id)}
                    disabled={cat._count.bases > 0}
                    title={cat._count.bases > 0 ? "Ha basi associate" : "Elimina"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
