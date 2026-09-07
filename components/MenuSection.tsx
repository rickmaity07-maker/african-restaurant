"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

type MenuItem = { id: string; name: string; desc: string | null; price: string; star: boolean };
type MenuCategory = { id: string; slug: string; title: string; subtitle: string; items: MenuItem[] };

export default function MenuSection() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [active, setActive] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (data.categories?.length) setActive(data.categories[0].id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const category = categories.find((c) => c.id === active);

  if (loading) {
    return (
      <section id="menu" className="relative bg-[#0a0a0a] py-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-stone-500 text-sm tracking-widest uppercase">Loading menu…</div>
      </section>
    );
  }

  if (!category) return null;

  const mid = Math.ceil(category.items.length / 2);
  const colA = category.items.slice(0, mid);
  const colB = category.items.slice(mid);

  return (
    <section id="menu" className="relative bg-[#0a0a0a] py-32 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 border-b border-stone-800 pb-10">
          <h2 className="text-[10px] tracking-[0.4em] font-bold text-amber-500 uppercase mb-4">Tasting Notes</h2>
          <h3 className={`text-6xl md:text-8xl text-white ${playfair.className}`}>The Menu</h3>
        </div>

        <div className="flex flex-wrap gap-4 mb-16">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold border transition-all duration-300 ${
                active === c.id
                  ? "bg-amber-500 text-black border-amber-500"
                  : "border-stone-700 text-stone-300 hover:border-amber-500 hover:text-amber-500"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-stone-500 text-sm tracking-widest uppercase mb-12">{category.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
              {[colA, colB].map((col, i) => (
                <div key={i} className="flex flex-col gap-10">
                  {col.map((item) => (
                    <div key={item.id} className="group">
                      <div className="flex justify-between items-baseline gap-6 border-b border-stone-800 pb-3 group-hover:border-amber-500 transition-colors">
                        <h5 className={`text-2xl text-white group-hover:text-amber-500 transition-colors ${playfair.className}`}>
                          {item.name} {item.star && <span className="text-amber-500 text-sm align-super">★</span>}
                        </h5>
                        <span className="text-amber-500 font-medium text-lg whitespace-nowrap">{item.price}</span>
                      </div>
                      {item.desc && <p className="text-stone-400 text-sm font-light mt-2 leading-relaxed">{item.desc}</p>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}