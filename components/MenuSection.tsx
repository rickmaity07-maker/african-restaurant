"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { menuCategories } from "@/lib/menuData";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

const groupA = menuCategories.slice(0, 5);
const groupB = menuCategories.slice(5);

const groupImages = {
  a: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1913&auto=format&fit=crop",
  b: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
};

const tabLabels: Record<string, string> = {
  "warme-getranke": "Shaah iyo Kofee",
  "kalte-getranke": "Cabitaan Qabow",
  fruhstuck: "Quraac",
  pfannkuchen: "Canjeelo",
  fladenbrot: "Muufo",
  maisbrei: "Soor",
  snacks: "Cunto Fudud",
  spaghetti: "Baasto",
  mittagessen: "Bariis",
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 22 },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

function CategoryPanel({
  categories,
  image,
  imageOnLeft,
  defaultId,
}: {
  categories: typeof menuCategories;
  image: string;
  imageOnLeft: boolean;
  defaultId: string;
}) {
  const [active, setActive] = useState(defaultId);
  const category = categories.find((c) => c.id === active)!;

  const mid = Math.ceil(category.items.length / 2);
  const colA = category.items.slice(0, mid);
  const colB = category.items.slice(mid);

  return (
    <div className="relative border-b border-stone-900">
      {/* ===== DESKTOP: fixed full-height split, image never resizes ===== */}
      <div className="hidden lg:grid lg:grid-cols-2 h-screen min-h-160 max-h-225">
        {/* Image column – fixed size, always fills its half */}
        <div
          className={`relative h-full ${imageOnLeft ? "order-1" : "order-2"}`}
        >
          <Image
            src={image}
            alt={category.title}
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
          <div
            className={`absolute inset-0 ${
              imageOnLeft
                ? "bg-linear-to-r from-transparent via-transparent to-[#0a0a0a]"
                : "bg-linear-to-l from-transparent via-transparent to-[#0a0a0a]"
            }`}
          />
        </div>

        {/* Text column – fills remaining half completely */}
        <div
          className={`relative h-full bg-[#0a0a0a] flex flex-col justify-center px-8 xl:px-12 2xl:px-16 overflow-y-auto ${
            imageOnLeft ? "order-2" : "order-1"
          }`}
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 shrink-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`px-3.5 py-2 text-[11px] uppercase tracking-widest font-medium border transition-all duration-300 whitespace-nowrap ${
                  active === c.id
                    ? "bg-amber-500 text-black border-amber-500"
                    : "border-stone-700 text-stone-300 hover:border-amber-500 hover:text-amber-500"
                }`}
              >
                {tabLabels[c.id] || c.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <h4
                className={`text-5xl xl:text-6xl text-amber-500 italic mb-2 ${playfair.className}`}
              >
                {category.title}
              </h4>
              <p className="text-stone-500 text-xs tracking-[0.2em] uppercase mb-8">
                {category.subtitle}
              </p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-x-10 gap-y-6"
              >
                {[colA, colB].map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-5">
                    {col.map((item) => (
                      <motion.div
                        key={item.name}
                        variants={fadeInUp}
                        className="group"
                      >
                        <div className="flex justify-between items-baseline gap-3 border-b border-stone-800/60 pb-2 group-hover:border-amber-500 transition-colors">
                          <h5
                            className={`text-xl xl:text-2xl text-white group-hover:text-amber-500 transition-colors duration-300 ${playfair.className}`}
                          >
                            {item.name}
                            {item.star && (
                              <span className="text-amber-500 text-sm align-super ml-1">
                                ★
                              </span>
                            )}
                          </h5>
                          <span className="text-amber-500 font-medium text-base xl:text-lg whitespace-nowrap">
                            {item.price}
                          </span>
                        </div>
                        {item.desc && (
                          <p className="text-stone-400 text-sm font-light mt-1.5">
                            {item.desc}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ===== MOBILE + TABLET ===== */}
      <div className="lg:hidden">
        <div className="relative h-52 sm:h-64 w-full">
          <Image
            src={image}
            alt={category.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
        </div>

        <div className="px-4 sm:px-6 pb-12 -mt-6 relative z-10">
          <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`shrink-0 px-3 py-2 text-[10px] uppercase tracking-[0.08em] font-medium border transition-all duration-300 whitespace-nowrap touch-manipulation ${
                  active === c.id
                    ? "bg-amber-500 text-black border-amber-500"
                    : "border-stone-700 text-stone-300"
                }`}
              >
                {tabLabels[c.id] || c.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <h4
                className={`text-3xl sm:text-4xl text-amber-500 italic mb-1.5 ${playfair.className}`}
              >
                {category.title}
              </h4>
              <p className="text-stone-500 text-[10px] sm:text-xs tracking-[0.15em] uppercase mb-6">
                {category.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {category.items.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-baseline gap-2 border-b border-stone-800/60 pb-1.5">
                      <h5
                        className={`text-base sm:text-lg text-white ${playfair.className}`}
                      >
                        {item.name}
                        {item.star && (
                          <span className="text-amber-500 text-xs align-super ml-1">
                            ★
                          </span>
                        )}
                      </h5>
                      <span className="text-amber-500 font-medium text-sm whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                    {item.desc && (
                      <p className="text-stone-400 text-xs sm:text-sm font-light mt-1">
                        {item.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function MenuSection() {
  return (
    <section id="menu" className="relative bg-[#0a0a0a] overflow-hidden">
      {/* Title – full width, compact */}
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-[9px] sm:text-[10px] tracking-[0.4em] font-bold text-amber-500 uppercase mb-3">
              Tasting Notes
            </h2>
            <h3
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-none ${playfair.className}`}
            >
              The Menu
            </h3>
          </div>
          <p className="text-stone-500 text-[10px] sm:text-xs tracking-[0.2em] uppercase">
            Curated for the avant-garde.
          </p>
        </div>
      </div>

      <CategoryPanel
        categories={groupA}
        image={groupImages.a}
        imageOnLeft={true}
        defaultId={groupA[0].id}
      />

      <CategoryPanel
        categories={groupB}
        image={groupImages.b}
        imageOnLeft={false}
        defaultId={groupB[0].id}
      />
    </section>
  );
} 