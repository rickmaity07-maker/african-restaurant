import twilio from "twilio";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error(
      "SMS is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN."
    );
  }
  return twilio(sid, token);
}

function getServiceSid() {
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!serviceSid) {
    throw new Error("SMS is not configured. Set TWILIO_VERIFY_SERVICE_SID.");
  }
  return serviceSid;
}

export async function sendPhoneOtp(phone: string) {
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_VERIFY_SERVICE_SID
  ) {
    console.warn("[sms] Twilio not configured — OTP send skipped for", phone);
    return { status: "skipped" };
  }
  const client = getClient();
  return client.verify.v2
    .services(getServiceSid())
    .verifications.create({ to: phone, channel: "sms" });
}

export async function checkPhoneOtp(phone: string, code: string) {
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_VERIFY_SERVICE_SID
  ) {
    console.warn("[sms] Twilio not configured — OTP check skipped");
    return false;
  }
  const client = getClient();
  const result = await client.verify.v2
    .services(getServiceSid())
    .verificationChecks.create({ to: phone, code });
  return result.status === "approved";
}
