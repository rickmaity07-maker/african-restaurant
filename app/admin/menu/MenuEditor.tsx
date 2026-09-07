"use client";
import { useState } from "react";

type Item = { id: string; name: string; desc: string | null; price: string; star: boolean; available: boolean };
type Category = { id: string; title: string; subtitle: string; items: Item[] };

export default function MenuEditor({ initial }: { initial: Category[] }) {
  const [categories, setCategories] = useState(initial);
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatSubtitle, setNewCatSubtitle] = useState("");

  async function addCategory() {
    if (!newCatTitle.trim()) return;
    const res = await fetch("/api/admin/menu-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newCatTitle, subtitle: newCatSubtitle }),
    });
    const { category } = await res.json();
    setCategories((c) => [...c, { ...category, items: [] }]);
    setNewCatTitle("");
    setNewCatSubtitle("");
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this whole category and its items?")) return;
    setCategories((c) => c.filter((cat) => cat.id !== id));
    await fetch(`/api/admin/menu-categories/${id}`, { method: "DELETE" });
  }

  async function addItem(categoryId: string) {
    const res = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name: "New item", price: "0,00 €" }),
    });
    const { item } = await res.json();
    setCategories((cats) =>
      cats.map((c) => (c.id === categoryId ? { ...c, items: [...c.items, item] } : c))
    );
  }

  async function updateItem(categoryId: string, itemId: string, patch: Partial<Item>) {
    setCategories((cats) =>
      cats.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
          : c
      )
    );
    await fetch(`/api/admin/menu/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function deleteItem(categoryId: string, itemId: string) {
    setCategories((cats) =>
      cats.map((c) => (c.id === categoryId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c))
    );
    await fetch(`/api/admin/menu/${itemId}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col gap-12">
      {categories.map((cat) => (
        <div key={cat.id} className="border border-white/10 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl text-white">{cat.title}</h2>
              <p className="text-stone-500 text-xs">{cat.subtitle}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => addItem(cat.id)} className="text-xs text-amber-500 hover:text-amber-400">
                + Add item
              </button>
              <button onClick={() => deleteCategory(cat.id)} className="text-xs text-red-400 hover:text-red-300">
                Delete category
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {cat.items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-center border-t border-white/5 pt-3">
                <input
                  defaultValue={item.name}
                  onBlur={(e) => updateItem(cat.id, item.id, { name: e.target.value })}
                  className="col-span-3 bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-1"
                  placeholder="Name"
                />
                <input
                  defaultValue={item.desc ?? ""}
                  onBlur={(e) => updateItem(cat.id, item.id, { desc: e.target.value })}
                  className="col-span-4 bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-1"
                  placeholder="Description"
                />
                <input
                  defaultValue={item.price}
                  onBlur={(e) => updateItem(cat.id, item.id, { price: e.target.value })}
                  className="col-span-2 bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-1"
                  placeholder="Price"
                />
                <label className="col-span-1 flex items-center gap-1 text-xs text-stone-400">
                  <input
                    type="checkbox"
                    defaultChecked={item.available}
                    onChange={(e) => updateItem(cat.id, item.id, { available: e.target.checked })}
                  />
                  Live
                </label>
                <label className="col-span-1 flex items-center gap-1 text-xs text-stone-400">
                  <input
                    type="checkbox"
                    defaultChecked={item.star}
                    onChange={(e) => updateItem(cat.id, item.id, { star: e.target.checked })}
                  />
                  ★
                </label>
                <button
                  onClick={() => deleteItem(cat.id, item.id)}
                  className="col-span-1 text-red-400 hover:text-red-300 text-xs text-right"
                >
                  Delete
                </button>
              </div>
            ))}
            {cat.items.length === 0 && <p className="text-stone-600 text-xs">No items yet.</p>}
          </div>
        </div>
      ))}

      <div className="border border-dashed border-white/20 p-6 flex flex-col gap-3">
        <h3 className="text-sm text-white uppercase tracking-widest">Add category</h3>
        <input
          value={newCatTitle}
          onChange={(e) => setNewCatTitle(e.target.value)}
          placeholder="Title (e.g. Desserts)"
          className="bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-2"
        />
        <input
          value={newCatSubtitle}
          onChange={(e) => setNewCatSubtitle(e.target.value)}
          placeholder="Subtitle (e.g. Sweet endings)"
          className="bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-2"
        />
        <button onClick={addCategory} className="mt-2 py-3 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest w-fit px-6">
          Add category
        </button>
      </div>
    </div>
  );
}