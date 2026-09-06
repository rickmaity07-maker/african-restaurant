"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

type Step = "form" | "verify-email" | "verify-phone" | "done";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
  }

  async function submitPhoneCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/verify-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: form.phone, code }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error);
    setStep("done");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-stone-200 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md border border-white/10 p-10 bg-white/5">
        <h1 className="text-3xl text-white mb-8 text-center">Create Account</h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {step === "form" && (
          <form onSubmit={submitRegister} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              value={form.name}
              onValueChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onValueChange={(v) => setForm({ ...form, email: v })}
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onValueChange={(v) => setForm({ ...form, phone: v })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onValueChange={(v) => setForm({ ...form, password: v })}
              required
              minLength={8}
            />
            <SubmitBtn loading={loading}>Create Account</SubmitBtn>
          </form>
        )}

        {step === "verify-email" && (
          <form onSubmit={submitEmailCode} className="flex flex-col gap-5">
            <p className="text-sm text-stone-400 text-center">
              Enter the code we sent to {form.email}
            </p>
            <Input label="Email code" value={code} onValueChange={setCode} required />
            <SubmitBtn loading={loading}>Verify Email</SubmitBtn>
          </form>
        )}

        {step === "verify-phone" && (
          <form onSubmit={submitPhoneCode} className="flex flex-col gap-5">
            <p className="text-sm text-stone-400 text-center">
              Enter the SMS code sent to {form.phone}
            </p>
            <Input label="SMS code" value={code} onValueChange={setCode} required />
            <SubmitBtn loading={loading}>Verify Phone</SubmitBtn>
          </form>
        )}

        {step === "done" && (
          <div className="text-center space-y-6">
            <p className="text-amber-500 tracking-widest uppercase text-sm">Account ready</p>
            <button
              type="button"
              onClick={() =>
                signIn("credentials", {
                  email: form.email,
                  password: form.password,
                  callbackUrl: "/",
                })
              }
              className="w-full py-4 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest"
            >
              Sign In
            </button>
          </div>
        )}

        <p className="text-center text-xs text-stone-500 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-500">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Input({
  label,
  onValueChange,
  value,
  ...rest
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
        {label}
      </span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
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