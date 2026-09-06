"use client";
import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebaseClient";

type Step = "form" | "verify-email" | "verify-phone" | "done";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error);
    setStep("verify-email");
  }

  async function submitEmailCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, code }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error);
    setCode("");
    setStep("verify-phone");
    sendPhoneOtp();
  }

  async function sendPhoneOtp() {
    setError("");
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", { size: "invisible" });
      }
      confirmationRef.current = await signInWithPhoneNumber(firebaseAuth, form.phone, recaptchaRef.current);
    } catch {
      setError("Could not send SMS code. Check the phone number format (+49...).");
    }
  }

  async function submitPhoneCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!confirmationRef.current) throw new Error("no-confirmation");
      const result = await confirmationRef.current.confirm(code);
      const idToken = await result.user.getIdToken();
      const res = await fetch("/api/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, phone: form.phone }),
      });
      const json = await res.json();
      setLoading(false);
      if (!res.ok) return setError(json.error);
      setStep("done");
    } catch {
      setLoading(false);
      setError("Incorrect or expired code.");
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-stone-200 flex items-center justify-center px-6 py-24">
      <div id="recaptcha-container" />
      <div className="w-full max-w-md border border-white/10 p-10 bg-white/5">
        <h1 className="text-3xl text-white mb-8 text-center">Create Account</h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {step === "form" && (
          <form onSubmit={submitRegister} className="flex flex-col gap-5">
            <Input label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Input label="Phone (+49...)" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
            <Input label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required minLength={8} />
            <SubmitBtn loading={loading}>Register</SubmitBtn>
          </form>
        )}

        {step === "verify-email" && (
          <form onSubmit={submitEmailCode} className="flex flex-col gap-5">
            <p className="text-sm text-stone-400">Enter the 6-digit code sent to {form.email}</p>
            <Input label="Email Code" value={code} onChange={setCode} required />
            <SubmitBtn loading={loading}>Verify Email</SubmitBtn>
          </form>
        )}

        {step === "verify-phone" && (
          <form onSubmit={submitPhoneCode} className="flex flex-col gap-5">
            <p className="text-sm text-stone-400">Enter the SMS code sent to {form.phone}</p>
            <Input label="Phone Code" value={code} onChange={setCode} required />
            <SubmitBtn loading={loading}>Verify Phone</SubmitBtn>
            <button type="button" onClick={sendPhoneOtp} className="text-xs text-amber-500 text-center">
              Resend code
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="text-center">
            <p className="text-amber-500 mb-6">Account verified! You can now sign in.</p>
            <button
              onClick={() => signIn("credentials", { email: form.email, password: form.password, callbackUrl: "/" })}
              className="w-full py-4 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest"
            >
              Sign In
            </button>
          </div>
        )}

        <p className="text-center text-xs text-stone-500 mt-8">
          Already have an account? <Link href="/login" className="text-amber-500">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

function Input(props: { label: string } & React.InputHTMLAttributes<HTMLInputElement> & { onChange: (v: string) => void; value: string }) {
  const { label, onChange, ...rest } = props;
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">{label}</span>
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b border-stone-600 focus:border-amber-500 py-2 text-white outline-none"
      />
    </label>
  );
}

function SubmitBtn({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-2 py-4 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
    >
      {loading ? "..." : children}
    </button>
  );
}