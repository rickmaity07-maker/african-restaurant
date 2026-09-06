import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPhoneOtp } from "@/lib/sms";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();
  const limited = await rateLimit("otp", phone ?? "unknown");
  if (!limited.success) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const ok = await checkPhoneOtp(phone, code);
  if (!ok) return NextResponse.json({ error: "Incorrect or expired code." }, { status: 400 });

  await prisma.user.update({ where: { phone }, data: { phoneVerified: new Date() } });
  return NextResponse.json({ ok: true });
}
