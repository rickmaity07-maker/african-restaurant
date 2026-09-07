import { prisma } from "@/lib/prisma";
import MenuEditor from "./MenuEditor";

export default async function AdminMenuPage() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { order: "asc" },
    include: { items: { orderBy: { order: "asc" } } },
  });

  return (
    <>
      <h1 className="text-4xl text-white mb-10">Menu</h1>
      <MenuEditor initial={JSON.parse(JSON.stringify(categories))} />
    </>
  );
}