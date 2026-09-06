import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isDisposableEmail } from "@/lib/disposableEmail";
import { sendMail, otpEmailHtml } from "@/lib/mailer";
import { sendPhoneOtp } from "@/lib/sms";
import { generateOtp, otpExpiry } from "@/lib/otp";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limited = await rateLimit("register", ip);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { name, email, phone, password } = parsed.data;

  if (await isDisposableEmail(email)) {
    return NextResponse.json(
      { error: "Please use a real, permanent email address (temporary/disposable emails are not allowed)." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email or phone already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const emailOtp = generateOtp();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      emailOtp,
      emailOtpExpires: otpExpiry(10),
    },
  });

  await sendMail(email, "Verify your email — Karmel Café & Restaurant", otpEmailHtml(emailOtp));
  await sendPhoneOtp(phone);

  return NextResponse.json({ ok: true, userId: user.id });
}
