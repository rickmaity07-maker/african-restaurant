import crypto from "crypto";

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function otpExpiry(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
