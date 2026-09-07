import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      items: { where: { available: true }, orderBy: { order: "asc" } },
    },
  });
  return NextResponse.json({ categories });
}