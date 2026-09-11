"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/languageContext";

type Item = { id: string; name: string; desc: string | null; price: string; star: boolean; available: boolean };
type SubCategory = { id: string; slug: string; title: string; subtitle: string; order: number; items: Item[] };
type MainCategory = { id: string; slug: string; title: string; subtitle: string; order: number; children: SubCategory[] };

export default function MenuEditor({ initial }: { initial: MainCategory[] }) {
  const { t } = useLanguage();
  const [mainCategories, setMainCategories] = useState<MainCategory[]>(initial);
  const [newMainTitle, setNewMainTitle] = useState("");
  const [newMainSubtitle, setNewMainSubtitle] = useState("");
  const [newMainSlug, setNewMainSlug] = useState("");
  const [editingMainId, setEditingMainId] = useState<string | null>(null);

  async function addMainCategory() {
    if (!newMainTitle.trim() || !newMainSlug.trim()) return;
    const res = await fetch("/api/admin/menu-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newMainTitle, subtitle: newMainSubtitle, slug: newMainSlug, isMainCategory: true }),
    });
    const { category } = await res.json();
    setMainCategories((c) => [...c, { ...category, children: [] }]);
    setNewMainTitle("");
    setNewMainSubtitle("");
    setNewMainSlug("");
  }

  async function updateMainCategory(id: string, patch: Partial<MainCategory>) {
    setMainCategories((c) => c.map((cat) => (cat.id === id ? { ...cat, ...patch } : cat)));
    await fetch(`/api/admin/menu-categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function deleteMainCategory(id: string) {
    if (!confirm(t.admin.deleteCategoryConfirm || "Delete this whole category and its subcategories?")) return;
    setMainCategories((c) => c.filter((cat) => cat.id !== id));
    await fetch(`/api/admin/menu-categories/${id}`, { method: "DELETE" });
  }

  async function addSubCategory(mainId: string) {
    const mainCat = mainCategories.find((c) => c.id === mainId);
    if (!mainCat) return;
    const res = await fetch("/api/admin/menu-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Subcategory", subtitle: "", isMainCategory: false, parentId: mainId }),
    });
    const { category } = await res.json();
    setMainCategories((c) =>
      c.map((cat) => (cat.id === mainId ? { ...cat, children: [...cat.children, { ...category, items: [] }] } : cat))
    );
  }

  async function deleteSubCategory(mainId: string, subId: string) {
    if (!confirm(t.admin.deleteCategoryConfirm || "Delete this subcategory and its items?")) return;
    setMainCategories((c) =>
      c.map((cat) => (cat.id === mainId ? { ...cat, children: cat.children.filter((sub) => sub.id !== subId) } : cat))
    );
    await fetch(`/api/admin/menu-categories/${subId}`, { method: "DELETE" });
  }

  async function addItem(subCategoryId: string) {
    const res = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: subCategoryId, name: "New item", price: "0,00 €" }),
    });
    const { item } = await res.json();
    setMainCategories((cats) =>
      cats.map((cat) => ({
        ...cat,
        children: cat.children.map((sub) =>
          sub.id === subCategoryId ? { ...sub, items: [...sub.items, item] } : sub
        ),
      }))
    );
  }

  async function updateItem(subCategoryId: string, itemId: string, patch: Partial<Item>) {
    setMainCategories((cats) =>
      cats.map((cat) => ({
        ...cat,
        children: cat.children.map((sub) =>
          sub.id === subCategoryId
            ? { ...sub, items: sub.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
            : sub
        ),
      }))
    );
    await fetch(`/api/admin/menu/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function deleteItem(subCategoryId: string, itemId: string) {
    setMainCategories((cats) =>
      cats.map((cat) => ({
        ...cat,
        children: cat.children.map((sub) =>
          sub.id === subCategoryId ? { ...sub, items: sub.items.filter((i) => i.id !== itemId) } : sub
        ),
      }))
    );
    await fetch(`/api/admin/menu/${itemId}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Main Categories */}
      {mainCategories.map((main) => (
        <div key={main.id} className="border border-white/10 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl text-white">{main.title}</h2>
              <p className="text-stone-500 text-xs">{main.subtitle}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingMainId(editingMainId === main.id ? null : main.id)}
                className="text-xs text-amber-500 hover:text-amber-400"
              >
                {editingMainId === main.id ? "Cancel" : "Edit"}
              </button>
              <button onClick={() => addSubCategory(main.id)} className="text-xs text-amber-500 hover:text-amber-400">
                {t.admin.addItem} Subcategory
              </button>
              <button onClick={() => deleteMainCategory(main.id)} className="text-xs text-red-400 hover:text-red-300">
                {t.admin.deleteCategory}
              </button>
            </div>
          </div>

          {editingMainId === main.id && (
            <div className="mb-6 space-y-3 p-4 bg-white/5 rounded">
              <input
                value={main.title}
                onChange={(e) => updateMainCategory(main.id, { title: e.target.value })}
                className="bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-2 w-full"
                placeholder={t.admin.categoryTitlePlaceholder}
              />
              <input
                value={main.subtitle}
                onChange={(e) => updateMainCategory(main.id, { subtitle: e.target.value })}
                className="bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-2 w-full"
                placeholder={t.admin.categorySubtitlePlaceholder}
              />
              <input
                value={main.slug}
                onChange={(e) => updateMainCategory(main.id, { slug: e.target.value })}
                className="bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-2 w-full"
                placeholder="slug (e.g. breakfast)"
              />
            </div>
          )}

          {/* Subcategories */}
          {main.children.map((sub) => (
            <div key={sub.id} className="border-t border-white/5 pt-4 ml-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg text-amber-400">{sub.title}</h3>
                  <p className="text-stone-500 text-xs">{sub.subtitle}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => addItem(sub.id)} className="text-xs text-amber-500 hover:text-amber-400">
                    {t.admin.addItem}
                  </button>
                  <button onClick={() => deleteSubCategory(main.id, sub.id)} className="text-xs text-red-400 hover:text-red-300">
                    {t.admin.deleteCategory}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {sub.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-center border-t border-white/5 pt-3">
                    <input
                      defaultValue={item.name}
                      onBlur={(e) => updateItem(sub.id, item.id, { name: e.target.value })}
                      className="col-span-3 bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-1"
                      placeholder={t.admin.itemName}
                    />
                    <input
                      defaultValue={item.desc ?? ""}
                      onBlur={(e) => updateItem(sub.id, item.id, { desc: e.target.value })}
                      className="col-span-4 bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-1"
                      placeholder={t.admin.itemDescription}
                    />
                    <input
                      defaultValue={item.price}
                      onBlur={(e) => updateItem(sub.id, item.id, { price: e.target.value })}
                      className="col-span-2 bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-1"
                      placeholder={t.admin.itemPrice}
                    />
                    <label className="col-span-1 flex items-center gap-1 text-xs text-stone-400">
                      <input
                        type="checkbox"
                        defaultChecked={item.available}
                        onChange={(e) => updateItem(sub.id, item.id, { available: e.target.checked })}
                      />
                      {t.admin.live}
                    </label>
                    <label className="col-span-1 flex items-center gap-1 text-xs text-stone-400">
                      <input
                        type="checkbox"
                        defaultChecked={item.star}
                        onChange={(e) => updateItem(sub.id, item.id, { star: e.target.checked })}
                      />
                      {t.admin.starred}
                    </label>
                    <button
                      onClick={() => deleteItem(sub.id, item.id)}
                      className="col-span-1 text-red-400 hover:text-red-300 text-xs text-right"
                    >
                      {t.admin.delete}
                    </button>
                  </div>
                ))}
                {sub.items.length === 0 && <p className="text-stone-600 text-xs">{t.admin.noItemsYet}</p>}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Add Main Category */}
      <div className="border border-dashed border-white/20 p-6 flex flex-col gap-3">
        <h3 className="text-sm text-white uppercase tracking-widest">{t.admin.addCategory} (Main Category)</h3>
        <input
          value={newMainTitle}
          onChange={(e) => setNewMainTitle(e.target.value)}
          placeholder={t.admin.categoryTitlePlaceholder}
          className="bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-2"
        />
        <input
          value={newMainSubtitle}
          onChange={(e) => setNewMainSubtitle(e.target.value)}
          placeholder={t.admin.categorySubtitlePlaceholder}
          className="bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-2"
        />
        <input
          value={newMainSlug}
          onChange={(e) => setNewMainSlug(e.target.value)}
          placeholder="slug (e.g. breakfast)"
          className="bg-transparent border-b border-stone-700 focus:border-amber-500 outline-none text-sm py-2"
        />
        <button onClick={addMainCategory} className="mt-2 py-3 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest w-fit px-6">
          {t.admin.addCategory}
        </button>
      </div>
    </div>
  );
}