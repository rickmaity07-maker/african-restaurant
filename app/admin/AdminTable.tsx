"use client";
import { useState } from "react";

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  tableNumber: number | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "CHANGE_REQUESTED";
  notes: string | null;
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminTable({ initial }: { initial: Reservation[] }) {
  const [rows, setRows] = useState(initial);
  const [error, setError] = useState("");
  const [proposingId, setProposingId] = useState<string | null>(null);
  const [proposedTime, setProposedTime] = useState("");

  async function update(id: string, patch: Record<string, unknown>) {
    const previous = rows.find((r) => r.id === id);
    if (patch.status || patch.tableNumber !== undefined) {
      setRows((r) => r.map((x) => (x.id === id ? { ...x, ...(patch as Partial<Reservation>) } : x)));
    }
    setError("");

    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Update failed.");
      if (previous) setRows((r) => r.map((x) => (x.id === id ? previous : x)));
    }
    return res.ok;
  }

  async function remove(id: string) {
    if (!confirm("Delete this reservation?")) return;
    setRows((r) => r.filter((x) => x.id !== id));
    await fetch(`/api/reservations/${id}`, { method: "DELETE" });
  }

  async function sendChangeRequest(r: Reservation) {
    if (!proposedTime) return;
    const [h, m] = proposedTime.split(":").map(Number);
    const requestedTime = new Date(r.date);
    requestedTime.setHours(h, m, 0, 0);

    const ok = await update(r.id, { status: "CHANGE_REQUESTED", requestedTime: requestedTime.toISOString() });
    if (ok) {
      setRows((rows) => rows.map((x) => (x.id === r.id ? { ...x, status: "CHANGE_REQUESTED" } : x)));
      setProposingId(null);
      setProposedTime("");
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 border border-red-500/40 bg-red-500/10 text-red-300 text-sm px-4 py-3">
          {error}
        </div>
      )}
      <div className="overflow-x-auto border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-stone-400 uppercase text-[10px] tracking-widest">
            <tr>
              <th className="p-3">Day</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Guests</th>
              <th className="p-3">Table #</th>
              <th className="p-3">Status</th>
              <th className="p-3">Propose Time</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const d = new Date(r.date);
              return (
                <tr key={r.id} className="border-t border-white/10">
                  <td className="p-3">{DAY_NAMES[d.getDay()]}</td>
                  <td className="p-3">{d.toLocaleDateString("en-GB")}</td>
                  <td className="p-3">{r.time}</td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.phone}</td>
                  <td className="p-3">{r.partySize}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      defaultValue={r.tableNumber ?? ""}
                      onBlur={(e) => update(r.id, { tableNumber: e.target.value ? Number(e.target.value) : null })}
                      className="w-16 bg-transparent border-b border-stone-600 focus:border-amber-500 outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={r.status}
                      onChange={(e) => update(r.id, { status: e.target.value })}
                      className="bg-[#0a0a0a] border border-stone-600 text-xs p-1"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CHANGE_REQUESTED">Change Requested</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {proposingId === r.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          step={300}
                          value={proposedTime}
                          onChange={(e) => setProposedTime(e.target.value)}
                          className="bg-[#0a0a0a] border border-stone-600 text-xs p-1"
                        />
                        <button onClick={() => sendChangeRequest(r)} className="text-amber-500 text-xs">Send</button>
                        <button onClick={() => setProposingId(null)} className="text-stone-500 text-xs">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setProposingId(r.id)} className="text-amber-500 text-xs hover:text-amber-400">
                        Propose new time
                      </button>
                    )}
                  </td>
                  <td className="p-3">
                    <button onClick={() => remove(r.id)} className="text-red-400 hover:text-red-300 text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="p-6 text-center text-stone-500">No reservations yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}