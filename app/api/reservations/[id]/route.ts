import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  sendMail,
  reservationConfirmedHtml,
  reservationCancelledHtml,
  reservationChangeRequestHtml,
} from "@/lib/mailer";
import { sendSms } from "@/lib/sms";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return null;
  return session;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();

  const before = await prisma.reservation.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const isNewChangeRequest = body.status === "CHANGE_REQUESTED" && body.requestedTime;
  const responseToken = isNewChangeRequest ? crypto.randomBytes(24).toString("hex") : undefined;

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        tableNumber: body.tableNumber ?? undefined,
        status: body.status ?? undefined,
        requestedTime: body.requestedTime ?? undefined,
        responseToken: responseToken ?? undefined,
      },
    });

    const dateLabel = new Date(reservation.date).toLocaleDateString("en-GB");
    const baseUrl = process.env.NEXTAUTH_URL || "";

    // Fire the right notification based on what actually changed.
    if (body.status === "CONFIRMED" && before.status !== "CONFIRMED") {
      await sendMail(
        reservation.email,
        "Reservation confirmed — Karmel Café & Restaurant",
        reservationConfirmedHtml({ name: reservation.name, date: dateLabel, time: reservation.time, partySize: reservation.partySize })
      );
      await sendSms(reservation.phone, `Karmel: your reservation for ${dateLabel} at ${reservation.time} is confirmed.`);
    }

    if (body.status === "CANCELLED" && before.status !== "CANCELLED") {
      await sendMail(
        reservation.email,
        "Reservation cancelled — Karmel Café & Restaurant",
        reservationCancelledHtml({ name: reservation.name, date: dateLabel, time: reservation.time })
      );
      await sendSms(reservation.phone, `Karmel: your reservation for ${dateLabel} at ${reservation.time} has been cancelled.`);
    }

    if (isNewChangeRequest && responseToken) {
      const proposedTime = new Date(body.requestedTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      await sendMail(
        reservation.email,
        "Requested time change — Karmel Café & Restaurant",
        reservationChangeRequestHtml({
          name: reservation.name,
          date: dateLabel,
          currentTime: reservation.time,
          proposedTime,
          acceptUrl: `${baseUrl}/api/reservations/respond?token=${responseToken}&action=accept`,
          declineUrl: `${baseUrl}/api/reservations/respond?token=${responseToken}&action=decline`,
        })
      );
      await sendSms(reservation.phone, `Karmel: we'd like to move your ${dateLabel} reservation to ${proposedTime}. Check your email to respond.`);
    }

    return NextResponse.json({ reservation });
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
      return NextResponse.json(
        { error: "That table is already booked for this date and time. Pick a different table or time." },
        { status: 409 }
      );
    }
    console.error("[reservations PATCH] failed:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.reservation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}