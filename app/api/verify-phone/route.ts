import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { firebaseAdminAuth } from "@/lib/firebaseAdmin";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const { idToken, phone } = await req.json();
  const limited = await rateLimit("otp", phone ?? "unknown");
  if (!limited.success) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  try {
    const decoded = await firebaseAdminAuth.verifyIdToken(idToken);
    if (!decoded.phone_number || decoded.phone_number !== phone) {
      return NextResponse.json({ error: "Phone number mismatch." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid or expired verification." }, { status: 400 });
  }

  await prisma.user.update({ where: { phone }, data: { phoneVerified: new Date() } });
  return NextResponse.json({ ok: true });
}