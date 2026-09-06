import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail, otpEmailHtml } from "@/lib/mailer";
import { sendPhoneOtp } from "@/lib/sms";
import { generateOtp, otpExpiry } from "@/lib/otp";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const { type, email, phone } = await req.json();
  const limited = await rateLimit("otp", email ?? phone ?? "unknown");
  if (!limited.success) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  if (type === "email" && email) {
    const code = generateOtp();
    await prisma.user.update({ where: { email }, data: { emailOtp: code, emailOtpExpires: otpExpiry(10) } });
    await sendMail(email, "Your new verification code", otpEmailHtml(code));
  } else if (type === "phone" && phone) {
    await sendPhoneOtp(phone);
  } else {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
