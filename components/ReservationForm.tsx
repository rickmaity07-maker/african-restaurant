"use client";
import { useState } from "react";
import Link from "next/link";

export default function ReservationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = { ...Object.fromEntries(fd.entries()), consent };
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Something went wrong.");
      setStatus("error");
      return;
    }
    setStatus("done");
    e.currentTarget.reset();
    setConsent(false);
  }

  if (status === "done") {
    return (
      <p className="text-center text-amber-500 text-xs sm:text-sm tracking-widest uppercase py-8 sm:py-10">
        Thank you — check your email for confirmation.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 sm:gap-8 md:gap-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 md:gap-10">
        <Field label="Full Name" name="name" type="text" placeholder="Jane Doe" required />
        <Field label="Email" name="email" type="email" placeholder="jane@example.com" required />
        <Field label="Phone" name="phone" type="tel" placeholder="+49 176 21313818" required />
        <Field label="Guests" name="partySize" type="number" min={1} max={30} defaultValue={2} required />
        <Field label="Date" name="date" type="date" required />
        <div className="flex flex-col gap-1.5 sm:gap-2 border-b border-stone-600 focus-within:border-amber-500 transition-colors">
          <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
            Time
          </label>
          <select
            name="time"
            defaultValue=""
            required
            className="bg-transparent border-none py-2 text-white focus:outline-none focus:ring-0 appearance-none font-light text-sm sm:text-base"
          >
            <option value="" disabled>
              Select Time
            </option>
            <option value="12:00">12:00 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="22:00">10:00 PM</option>
          </select>
        </div>
      </div>

      <label className="flex items-start gap-3 text-xs sm:text-sm text-stone-400">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-0.5 accent-amber-500"
        />
        <span>
          I accept the processing of my data for this reservation as described
          in the{" "}
          <Link href="/datenschutz" target="_blank" className="text-amber-500 underline">
            privacy policy
          </Link>
          .
        </span>
      </label>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading" || !consent}
        className="w-full mt-2 sm:mt-4 py-4 sm:py-5 bg-amber-500 text-[#0a0a0a] text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-50 touch-manipulation"
      >
        {status === "loading" ? "Sending..." : "Confirm Reservation"}
      </button>
    </form>
  );
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }
) {
  const { label, ...rest } = props;
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 border-b border-stone-600 focus-within:border-amber-500 transition-colors">
      <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
        {label}
      </label>
      <input
        {...rest}
        className="bg-transparent border-none py-2 text-white focus:outline-none focus:ring-0 font-light placeholder:text-stone-600 text-sm sm:text-base"
      />
    </div>
  );
}
