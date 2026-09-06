import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { sha256 } from "@/lib/hash";

export async function POST(req: NextRequest) {
  const { email, token, password } = await req.json();

  const limited = await rateLimit("otp", email ?? "unknown");
  if (!limited.success) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (
    !user ||
    !token ||
    user.resetToken !== sha256(token) ||
    !user.resetTokenExpires ||
    user.resetTokenExpires < new Date()
  ) {
    return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { email },
    data: { passwordHash, resetToken: null, resetTokenExpires: null },
  });

  return NextResponse.json({ ok: true });
}
