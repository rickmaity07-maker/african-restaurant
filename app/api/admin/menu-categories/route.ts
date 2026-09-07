import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return null;
  return session;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { title, subtitle } = await req.json();
  if (!title) return NextResponse.json({ error: "Title required." }, { status: 400 });

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const count = await prisma.menuCategory.count();
  const category = await prisma.menuCategory.create({
    data: { title, subtitle: subtitle || "", slug, order: count },
  });
  return NextResponse.json({ category });
}