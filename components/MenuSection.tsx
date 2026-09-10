"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { useLanguage } from "@/lib/languageContext";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

type MenuItem = { id: string; name: string; desc: string | null; price: string; star: boolean };
type MenuCategory = { id: string; slug: string; title: string; subtitle: string; items: MenuItem[] };

// Map database item names to translation keys
const itemTranslationMap: Record<string, { nameKey: string; descKey?: string }> = {
  "Shaah Somali": { nameKey: "shaahSomali", descKey: "shaahSomaliDesc" },
  "Schwarzer Kaffee": { nameKey: "schwarzerKaffee" },
  "Cappuccino": { nameKey: "cappuccino" },
  "Café Latte": { nameKey: "cafeLatte" },
  "Latte Macchiato": { nameKey: "latteMacchiato" },
  "Espresso": { nameKey: "espresso" },
  "Doppelter Espresso": { nameKey: "doppelterEspresso" },
  "Tiger Spice": { nameKey: "tigerSpice" },
  "Power Matcha": { nameKey: "powerMatcha" },
  "Mango": { nameKey: "mango" },
  "Mango-Milch": { nameKey: "mangoMilch" },
  "Avocado": { nameKey: "avocado" },
  "Avocado-Milch": { nameKey: "avocadoMilch" },
  "Avocado-Milch-Banaana": { nameKey: "avocadoMilchBanaana" },
  "Strawberry": { nameKey: "strawberry" },
  "Strawberry Mix": { nameKey: "strawberryMix" },
  "Banana": { nameKey: "banana" },
  "Banana-Max": { nameKey: "bananaMax" },
  "Cola / Fanta / Sprite": { nameKey: "colaFantaSprite" },
  "Orange und Ayran": { nameKey: "orangeAyran" },
  "Kleines Wasser": { nameKey: "kleinesWasser", descKey: "kleinesWasserDesc" },
  "Shakshuka": { nameKey: "shakshuka" },
  "Basaliya iyo Thunfisch": { nameKey: "basaliyaThunfisch", descKey: "basaliyaThunfischDesc" },
  "Fuul iyo Thunfisch": { nameKey: "fuulThunfisch", descKey: "fuulThunfischDesc" },
  "Canjeelo 2x": { nameKey: "canjeelo2x" },
  "Canjeelo iyo Suqaar": { nameKey: "canjeeloSuqaar", descKey: "canjeeloSuqaarDesc" },
  "Canjeelo iyo Beer": { nameKey: "canjeeloBeer", descKey: "canjeeloBeerDesc" },
  "Canjeelo iyo Kalliyo": { nameKey: "canjeeloKalliyo", descKey: "canjeeloKalliyoDesc" },
  "Canjeelo iyo Kalaankal": { nameKey: "canjeeloKalaankal", descKey: "canjeeloKalaankalDesc" },
  "Malawax": { nameKey: "malawax", descKey: "malawaxDesc" },
  "Malawax iyo Caano-Macaan": { nameKey: "malawaxCaanoMacaan", descKey: "malawaxCaanoMacaanDesc" },
  "Malawax iyo Suqaar": { nameKey: "malawaxSuqaar" },
  "Malawax iyo Kalaankal": { nameKey: "malawaxKalaankal" },
  "Muufo": { nameKey: "muufo", descKey: "muufoDesc" },
  "Muufo iyo Maraq": { nameKey: "muufoMaraq", descKey: "muufoMaraqDesc" },
  "Muufo iyo Suqaar": { nameKey: "muufoSuqaar", descKey: "muufoSuqaarDesc" },
  "Muufo iyo Kalaankal": { nameKey: "muufoKalaankal", descKey: "muufoKalaankalDesc" },
  "Sabaayad": { nameKey: "sabaayad", descKey: "sabaayadDesc" },
  "Sabaayad iyo Suqaar": { nameKey: "sabaayadSuqaar", descKey: "sabaayadSuqaarDesc" },
  "Sabaayad iyo Kalaankal": { nameKey: "sabaayadKalaankal", descKey: "sabaayadKalaankalDesc" },
  "Sabaayad iyo Beer": { nameKey: "sabaayadBeer", descKey: "sabaayadBeerDesc" },
  "Sabaayad iyo Kalliyo": { nameKey: "sabaayadKalliyo", descKey: "sabaayadKalliyoDesc" },
  "Soor iyo Caano": { nameKey: "soorCaano", descKey: "soorCaanoDesc" },
  "Soor iyo Koosto": { nameKey: "soorKoosto", descKey: "soorKoostoDesc" },
  "Soor iyo Suqaar": { nameKey: "soorSuqaar", descKey: "soorSuqaarDesc" },
  "Sambusa": { nameKey: "sambusa", descKey: "sambusaDesc" },
  "Bur / Quraac": { nameKey: "burQuraac", descKey: "burQuraacDesc" },
  "Mash Mash": { nameKey: "mashMash", descKey: "mashMashDesc" },
  "Bajiyo": { nameKey: "bajiyo", descKey: "bajiyoDesc" },
  "Doolshe": { nameKey: "doolshe", descKey: "doolsheDesc" },
  "Baan Keek": { nameKey: "baanKeek", descKey: "baanKeekDesc" },
  "Checken Crispy": { nameKey: "checkenCrispy" },
  "Checken Wings": { nameKey: "checkenWings" },
  "Pommes": { nameKey: "pommes" },
  "Baasto iyo Suugo": { nameKey: "baastoSuugo", descKey: "baastoSuugoDesc" },
  "Baasto iyo Suqaar": { nameKey: "baastoSuqaar", descKey: "baastoSuqaarDesc" },
  "Baasto iyo Kalaankal": { nameKey: "baastoKalaankal", descKey: "baastoKalaankalDesc" },
  "Baasto iyo Hilib Ari": { nameKey: "baastoHilibAri", descKey: "baastoHilibAriDesc" },
  "Bariis iyo Checking": { nameKey: "bariisChecking", descKey: "bariisCheckingDesc" },
  "Bariis iyo Suqaar": { nameKey: "bariisSuqaar", descKey: "bariisSuqaarDesc" },
  "Bariis iyo Malaay": { nameKey: "bariisMalaay", descKey: "bariisMalaayDesc" },
  "Bariis iyo Kalaankal": { nameKey: "bariisKalaankal", descKey: "bariisKalaankalDesc" },
  "Bariis iyo Hilib Ari": { nameKey: "bariisHilibAri", descKey: "bariisHilibAriDesc" },
  "Bariis, Baasto iyo Hilib Ari": { nameKey: "bariisBaastoHilibAri", descKey: "bariisBaastoHilibAriDesc" },
  "Bariis labo qof": { nameKey: "bariisLaboQof", descKey: "bariisLaboQofDesc" },
  "Bariis 3 qof": { nameKey: "bariis3Qof", descKey: "bariis3QofDesc" },
  "Bariis 4 qof": { nameKey: "bariis4Qof", descKey: "bariis4QofDesc" },
  "Bariis 5/6 qof": { nameKey: "bariis56Qof", descKey: "bariis56QofDesc" },
};

// Map category slugs to translation keys
const categoryTitleMap: Record<string, string> = {
  "warme-getranke": "warmeGetrankeTitle",
  "kalte-getranke": "kalteGetrankeTitle",
  fruhstuck: "fruhstuckTitle",
  pfannkuchen: "pfannkuchenTitle",
  fladenbrot: "fladenbrotTitle",
  maisbrei: "maisbreiTitle",
  snacks: "snacksTitle",
  spaghetti: "spaghettiTitle",
  mittagessen: "mittagessenTitle",
};

const categorySubtitleMap: Record<string, string> = {
  "warme-getranke": "warmeGetrankeSubtitle",
  "kalte-getranke": "kalteGetrankeSubtitle",
  fruhstuck: "fruhstuckSubtitle",
  pfannkuchen: "pfannkuchenSubtitle",
  fladenbrot: "fladenbrotSubtitle",
  maisbrei: "maisbreiSubtitle",
  snacks: "snacksSubtitle",
  spaghetti: "spaghettiSubtitle",
  mittagessen: "mittagessenSubtitle",
};

export default function MenuSection() {
  const { t, lang } = useLanguage();
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

  // Get translated category title and subtitle (always run hooks)
  const translatedCategoryTitle = category ? (categoryTitleMap[category.slug] ? (t.menu[categoryTitleMap[category.slug] as keyof typeof t.menu] as string) : category.title) : "";
  const translatedCategorySubtitle = category ? (categorySubtitleMap[category.slug] ? (t.menu[categorySubtitleMap[category.slug] as keyof typeof t.menu] as string) : category.subtitle) : "";

  // Translate items (always run hooks)
  const translatedItems = useMemo(() => {
    if (!category) return [];
    return category.items.map((item) => {
      const translation = itemTranslationMap[item.name];
      if (translation) {
        return {
          ...item,
          name: t.menu[translation.nameKey as keyof typeof t.menu] as string,
          desc: translation.descKey ? t.menu[translation.descKey as keyof typeof t.menu] as string : item.desc,
        };
      }
      return item;
    });
  }, [category?.items, t.menu, lang]);

  const mid = Math.ceil(translatedItems.length / 2);
  const colA = translatedItems.slice(0, mid);
  const colB = translatedItems.slice(mid);

  if (loading) {
    return (
      <section id="menu" className="relative bg-[#0a0a0a] py-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-stone-500 text-sm tracking-widest uppercase">Loading menu…</div>
      </section>
    );
  }

  if (!category) return null;

  return (
    <section id="menu" className="relative bg-[#0a0a0a] py-32 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 border-b border-stone-800 pb-10">
          <h2 className="text-[10px] tracking-[0.4em] font-bold text-amber-500 uppercase mb-4">{t.menu.title}</h2>
          <h3 className={`text-6xl md:text-8xl text-white ${playfair.className}`}>{t.menu.subtitle}</h3>
        </div>

        <div className="flex gap-4 mb-16 overflow-x-auto pb-4 scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold border transition-all duration-300 whitespace-nowrap ${
                active === c.id
                  ? "bg-amber-500 text-black border-amber-500"
                  : "border-stone-700 text-stone-300 hover:border-amber-500 hover:text-amber-500"
              }`}
            >
              {t.menu.categories[c.slug] || c.title}
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
            <p className="text-stone-500 text-sm tracking-widest uppercase mb-12">{translatedCategorySubtitle}</p>
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