// Run once: node scripts/seed-menu.mjs
// Moves the menu from lib/menuData.ts into the database so the admin panel can edit it.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const menuCategories = [
  { id: "warme-getranke", title: "Shaah iyo Kofee", subtitle: "Warme Getränke / Hot Drinks", items: [
    { name: "Shaah Somali", desc: "Somali Chai", price: "2,00 €", star: true },
    { name: "Schwarzer Kaffee", price: "2,85 €" },
    { name: "Cappuccino", price: "3,50 €" },
    { name: "Café Latte", price: "3,50 €" },
    { name: "Latte Macchiato", price: "3,50 €" },
    { name: "Espresso", price: "3,00 €" },
    { name: "Doppelter Espresso", price: "5,00 €" },
    { name: "Tiger Spice", price: "4,00 €" },
    { name: "Power Matcha", price: "4,00 €" },
  ]},
  { id: "kalte-getranke", title: "Cabitaan Qabow", subtitle: "Kaltgetränke & Mix-Smoothies / Cold Drinks", items: [
    { name: "Mango", price: "4,25 € / 4,99 €" },
    { name: "Mango-Milch", price: "4,25 € / 4,99 €", star: true },
    { name: "Avocado", price: "4,25 € / 4,99 €" },
    { name: "Avocado-Milch", price: "4,25 € / 4,99 €" },
    { name: "Avocado-Milch-Banaana", price: "4,25 € / 4,99 €" },
    { name: "Strawberry", price: "4,25 € / 4,99 €" },
    { name: "Strawberry Mix", price: "4,25 € / 4,99 €" },
    { name: "Banana", price: "4,25 € / 4,99 €" },
    { name: "Banana-Max", price: "4,25 € / 4,99 €" },
    { name: "Cola / Fanta / Sprite", price: "2,00 € / 2,99 €" },
    { name: "Orange und Ayran", price: "2,00 € / 2,99 €" },
    { name: "Kleines Wasser", desc: "Stilles oder sprudelndes Mineralwasser", price: "2,00 € / 2,99 €" },
  ]},
  { id: "fruhstuck", title: "Quraac", subtitle: "Frühstück / Breakfast", items: [
    { name: "Shakshuka", price: "12 €" },
    { name: "Basaliya iyo Thunfisch", desc: "Bazella mit Thunfisch", price: "11 €" },
    { name: "Fuul iyo Thunfisch", desc: "Bohnen mit Thunfisch", price: "11 €", star: true },
  ]},
  { id: "pfannkuchen", title: "Canjeelo & Malawax", subtitle: "Somalische Pfannkuchen / Pancakes", items: [
    { name: "Canjeelo 2x", price: "1,0 €" },
    { name: "Canjeelo iyo Suqaar", desc: "mit gekochtem Fleisch und würziger Suppe", price: "13 €" },
    { name: "Canjeelo iyo Beer", desc: "serviert mit gebratener Leber", price: "13 €", star: true },
    { name: "Canjeelo iyo Kalliyo", desc: "serviert mit gebratenen Nieren", price: "13 €" },
    { name: "Canjeelo iyo Kalaankal", desc: "mit trocknem gebratenem Fleisch", price: "14 €" },
    { name: "Malawax", desc: "Nur Pfannkuchen", price: "1,0 €" },
    { name: "Malawax iyo Caano-Macaan", desc: "mit gesüßter Kondensmilch", price: "1,5 €", star: true },
    { name: "Malawax iyo Suqaar", price: "13 €" },
    { name: "Malawax iyo Kalaankal", price: "14 €" },
  ]},
  { id: "fladenbrot", title: "Muufo & Sabaayad", subtitle: "Somalisches Fladenbrot / Flatbread", items: [
    { name: "Muufo", desc: "Nur Fladenbrot", price: "2,0 €" },
    { name: "Muufo iyo Maraq", desc: "mit aromatischer Suppe", price: "8,0 €" },
    { name: "Muufo iyo Suqaar", desc: "mit gekochtem Fleisch und würziger Suppe", price: "13 €" },
    { name: "Muufo iyo Kalaankal", desc: "mit trocknem gebratenem Fleisch", price: "14 €", star: true },
    { name: "Sabaayad", desc: "Nur schichtiges Fladenbrot", price: "2,0 €" },
    { name: "Sabaayad iyo Suqaar", desc: "mit gekochtem Fleisch und würziger Suppe", price: "13 €", star: true },
    { name: "Sabaayad iyo Kalaankal", desc: "mit trocknem gebratenem Fleisch", price: "14 €" },
    { name: "Sabaayad iyo Beer", desc: "serviert mit gebratener Leber", price: "14 €" },
    { name: "Sabaayad iyo Kalliyo", desc: "serviert mit gebratenen Nieren", price: "14 €" },
  ]},
  { id: "maisbrei", title: "Soor", subtitle: "Maisbrei / Corn Porridge", items: [
    { name: "Soor iyo Caano", desc: "Maisbrei mit warmer Milch", price: "10 €" },
    { name: "Soor iyo Koosto", desc: "Maisbrei mit Spinat", price: "12 €", star: true },
    { name: "Soor iyo Suqaar", desc: "mit gekochtem Fleisch und würziger Suppe", price: "13 €" },
  ]},
  { id: "snacks", title: "Cunto Fudud", subtitle: "Snacks", items: [
    { name: "Sambusa", desc: "Teigtasche", price: "2,0 €", star: true },
    { name: "Bur / Quraac", desc: "Süßes Brot, leicht frittiert", price: "1,00 €" },
    { name: "Mash Mash", desc: "Süßer Teig, leicht frittiert", price: "1,00 €" },
    { name: "Bajiyo", desc: "Frittierte Bohnenbällchen", price: "1,00 €" },
    { name: "Doolshe", desc: "Cake", price: "1,00 €" },
    { name: "Baan Keek", desc: "Pancakes", price: "3,00 €" },
    { name: "Checken Crispy", price: "3,50 €" },
    { name: "Checken Wings", price: "6,70 €" },
    { name: "Pommes", price: "3,99 €" },
  ]},
  { id: "spaghetti", title: "Baasto", subtitle: "Spaghetti", items: [
    { name: "Baasto iyo Suugo", desc: "mit Rindfleisch, klassischer Tomatensauce", price: "10 €" },
    { name: "Baasto iyo Suqaar", desc: "mit gekochtem Fleisch und würziger Suppe", price: "13 €", star: true },
    { name: "Baasto iyo Kalaankal", desc: "mit trocknem gebratenem Fleisch", price: "14 €" },
    { name: "Baasto iyo Hilib Ari", desc: "mit Ziegenfleisch und Sauce", price: "16 €" },
  ]},
  { id: "mittagessen", title: "Bariis", subtitle: "Qado / Mittagessen (Reis)", items: [
    { name: "Bariis iyo Checking", desc: "Reis mit Hähnchen", price: "13 €" },
    { name: "Bariis iyo Suqaar", desc: "Reis mit gekochtem Fleisch und würziger Suppe", price: "13 €" },
    { name: "Bariis iyo Malaay", desc: "Reis mit Fisch", price: "17 €" },
    { name: "Bariis iyo Kalaankal", desc: "Reis mit trocknem gebratenem Fleisch", price: "14 €" },
    { name: "Bariis iyo Hilib Ari", desc: "Reis mit Ziegenfleisch", price: "16 €", star: true },
    { name: "Bariis, Baasto iyo Hilib Ari", desc: "Reis, Spaghetti mit Ziegenfleisch", price: "17 €" },
    { name: "Bariis labo qof", desc: "Gruppenplatte für 2 Personen, wahlweise mit Pasta", price: "30 €" },
    { name: "Bariis 3 qof", desc: "Gruppenplatte für 3 Personen, wahlweise mit Pasta", price: "45 €" },
    { name: "Bariis 4 qof", desc: "Gruppenplatte für 4 Personen, wahlweise mit Pasta", price: "60 €" },
    { name: "Bariis 5/6 qof", desc: "Gruppenplatte für 5/6 Personen, wahlweise mit Pasta", price: "75 €" },
  ]},
];

for (let i = 0; i < menuCategories.length; i++) {
  const cat = menuCategories[i];
  const category = await prisma.menuCategory.upsert({
    where: { slug: cat.id },
    update: { title: cat.title, subtitle: cat.subtitle, order: i },
    create: { slug: cat.id, title: cat.title, subtitle: cat.subtitle, order: i },
  });

  for (let j = 0; j < cat.items.length; j++) {
    const item = cat.items[j];
    const existing = await prisma.menuItem.findFirst({ where: { categoryId: category.id, name: item.name } });
    if (existing) continue; // don't duplicate on re-run
    await prisma.menuItem.create({
      data: {
        categoryId: category.id,
        name: item.name,
        desc: item.desc ?? null,
        price: item.price,
        star: !!item.star,
        order: j,
      },
    });
  }
  console.log(`Seeded category: ${cat.title} (${cat.items.length} items)`);
}

console.log("Menu seed complete.");
await prisma.$disconnect();