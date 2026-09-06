import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GDPR storage-limitation cleanup (Art. 5(1)(e)): purges unverified accounts
// that never completed email verification, and reservation records past
// their retention window. Triggered by Vercel Cron (see vercel.json) or
// manually with the CRON_SECRET bearer token.
const UNVERIFIED_ACCOUNT_RETENTION_DAYS = Number(
  process.env.UNVERIFIED_ACCOUNT_RETENTION_DAYS ?? 7
);
const RESERVATION_RETENTION_MONTHS = Number(
  process.env.RESERVATION_RETENTION_MONTHS ?? 24
);

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const unverifiedCutoff = new Date();
  unverifiedCutoff.setDate(unverifiedCutoff.getDate() - UNVERIFIED_ACCOUNT_RETENTION_DAYS);

  const reservationCutoff = new Date();
  reservationCutoff.setMonth(reservationCutoff.getMonth() - RESERVATION_RETENTION_MONTHS);

  const [deletedUsers, deletedReservations] = await Promise.all([
    prisma.user.deleteMany({
      where: { emailVerified: null, createdAt: { lt: unverifiedCutoff } },
    }),
    prisma.reservation.deleteMany({
      where: { date: { lt: reservationCutoff } },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    deletedUnverifiedUsers: deletedUsers.count,
    deletedOldReservations: deletedReservations.count,
  });
}
