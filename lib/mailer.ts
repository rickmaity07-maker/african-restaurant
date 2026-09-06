import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.EMAIL_FROM ||
  "Karmel Café & Restaurant <onboarding@resend.dev>";

export async function sendMail(to: string, subject: string, html: string) {
  return resend.emails.send({ from: FROM, to, subject, html });
}

export function otpEmailHtml(code: string) {
  return `<div style="font-family:sans-serif;padding:24px">
    <h2>Karmel Café &amp; Restaurant</h2>
    <p>Your email verification code is:</p>
    <p style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</p>
    <p>This code expires in 10 minutes.</p>
  </div>`;
}

export function resetPasswordHtml(link: string) {
  return `<div style="font-family:sans-serif;padding:24px">
    <h2>Karmel Café &amp; Restaurant</h2>
    <p>Click the link below to reset your password. This link expires in 30 minutes.</p>
    <p><a href="${link}">${link}</a></p>
  </div>`;
}

export function reservationUserHtml(r: {
  name: string; date: string; time: string; partySize: number;
}) {
  return `<div style="font-family:sans-serif;padding:24px">
    <h2>Karmel Café &amp; Restaurant</h2>
    <p>Hi ${r.name}, your table reservation request has been received:</p>
    <ul>
      <li>Date: ${r.date}</li>
      <li>Time: ${r.time}</li>
      <li>Guests: ${r.partySize}</li>
    </ul>
    <p>We will confirm shortly. Address: Schultesstraße 14, 97421 Schweinfurt.</p>
  </div>`;
}

export function reservationAdminHtml(r: {
  name: string; email: string; phone: string; date: string; time: string;
  partySize: number; dayName: string; notes?: string;
}) {
  return `<div style="font-family:sans-serif;padding:24px">
    <h2>New Reservation</h2>
    <ul>
      <li>Name: ${r.name}</li>
      <li>Email: ${r.email}</li>
      <li>Phone: ${r.phone}</li>
      <li>Day: ${r.dayName}</li>
      <li>Date: ${r.date}</li>
      <li>Time: ${r.time}</li>
      <li>Guests: ${r.partySize}</li>
      <li>Notes: ${r.notes || "-"}</li>
    </ul>
  </div>`;
}