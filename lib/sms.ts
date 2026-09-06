import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

// Twilio Verify handles OTP generation, delivery, expiry & retry limits for us —
// no need to hand-roll SMS OTP storage/validation logic.
export async function sendPhoneOtp(phone: string) {
  return client.verify.v2.services(serviceSid).verifications.create({ to: phone, channel: "sms" });
}

export async function checkPhoneOtp(phone: string, code: string) {
  const result = await client.verify.v2.services(serviceSid).verificationChecks.create({ to: phone, code });
  return result.status === "approved";
}
