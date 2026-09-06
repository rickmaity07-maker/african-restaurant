import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail, otpEmailHtml } from "@/lib/mailer";
import { generateOtp, otpExpiry } from "@/lib/otp";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const limited = await rateLimit("otp", email ?? "unknown");
  if (!limited.success) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  if (!email) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const code = generateOtp();
  await prisma.user.update({ where: { email }, data: { emailOtp: code, emailOtpExpires: otpExpiry(10) } });
  await sendMail(email, "Your new verification code", otpEmailHtml(code));

  return NextResponse.json({ ok: true });
}