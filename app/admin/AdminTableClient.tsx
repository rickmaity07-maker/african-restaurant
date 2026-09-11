"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/languageContext";

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

export default function AdminTable({ initial = [] }: { initial?: Reservation[] }) {
  const { t } = useLanguage();
  const [rows, setRows] = useState<Reservation[]>(initial);
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
      setError(json.error || t.admin.error || "Update failed.");
      if (previous) setRows((r) => r.map((x) => (x.id === id ? previous : x)));
    }
    return res.ok;
  }

  async function remove(id: string) {
    if (!confirm(t.admin.deleteCategoryConfirm || "Delete this reservation?")) return;
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

  const statusLabels: Record<string, string> = {
    PENDING: t.admin.pending,
    CONFIRMED: t.admin.confirmed,
    CHANGE_REQUESTED: t.admin.changeRequested,
    CANCELLED: t.admin.cancelled,
  };

  const dayNames = t.common?.dayNames || DAY_NAMES;

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${dayNames[d.getDay()]}, ${d.toLocaleDateString("en-GB")}`;
  }

  function StatusSelect({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="bg-[#0a0a0a] border border-stone-600 text-xs p-1 w-full">
        <option value="PENDING">{statusLabels.PENDING}</option>
        <option value="CONFIRMED">{statusLabels.CONFIRMED}</option>
        <option value="CHANGE_REQUESTED">{statusLabels.CHANGE_REQUESTED}</option>
        <option value="CANCELLED">{statusLabels.CANCELLED}</option>
      </select>
    );
  }

  function ProposeTimeInput({ value, onChange, onSend, onCancel, disabled }: { value: string; onChange: (v: string) => void; onSend: () => void; onCancel: () => void; disabled?: boolean }) {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <input type="time" step={300} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="bg-[#0a0a0a] border border-stone-600 text-xs p-2 w-full sm:w-auto" />
        <button onClick={onSend} disabled={disabled} className="text-amber-500 text-xs font-medium py-1 px-2">{t.admin.send}</button>
        <button onClick={onCancel} className="text-stone-500 text-xs font-medium py-1 px-2">✕</button>
      </div>
    );
  }

  function ReservationCard({ r, proposingId, proposedTime, setProposedTime, setProposingId, sendChangeRequest, update, remove }: { 
    r: Reservation; 
    proposingId: string | null; 
    proposedTime: string;
    setProposedTime: (v: string) => void;
    setProposingId: (v: string | null) => void;
    sendChangeRequest: (r: Reservation) => void;
    update: (id: string, patch: Record<string, unknown>) => void;
    remove: (id: string) => void;
  }) {
    const isProposing = proposingId === r.id;
    return (
      <div key={r.id} className="border border-white/10 rounded-lg p-4 bg-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">{r.name}</span>
          <span className="text-xs text-stone-500">{formatDate(r.date)} • {r.time}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-stone-400">
          <div><span className="font-medium text-stone-300">{t.admin.guests}:</span> {r.partySize}</div>
          <div><span className="font-medium text-stone-300">{t.admin.tableNumber}:</span> {r.tableNumber ?? "—"}</div>
          <div className="col-span-2"><span className="font-medium text-stone-300">{t.admin.email}:</span> {r.email}</div>
          <div className="col-span-2"><span className="font-medium text-stone-300">{t.admin.phone}:</span> {r.phone}</div>
        </div>
        <div className="flex items-center gap-2">
          <StatusSelect value={r.status} onChange={(v) => update(r.id, { status: v })} />
        </div>
        <div className="flex items-center gap-2">
          {isProposing ? (
            <ProposeTimeInput 
              value={proposedTime} 
              onChange={setProposedTime} 
              onSend={() => sendChangeRequest(r)} 
              onCancel={() => setProposingId(null)} 
            />
          ) : (
            <button onClick={() => setProposingId(r.id)} className="text-amber-500 text-xs font-medium">{t.admin.proposeNewTime}</button>
          )}
          <button onClick={() => remove(r.id)} className="text-red-400 hover:text-red-300 text-xs font-medium ml-auto">{t.admin.delete}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 border border-red-500/40 bg-red-500/10 text-red-300 text-sm px-4 py-3">
          {error}
        </div>
      )}
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {rows.map((r) => (
          <ReservationCard
            key={r.id}
            r={r}
            proposingId={proposingId}
            proposedTime={proposedTime}
            setProposedTime={setProposedTime}
            setProposingId={setProposingId}
            sendChangeRequest={sendChangeRequest}
            update={update}
            remove={remove}
          />
        ))}
        {rows.length === 0 && (
          <div className="p-6 text-center text-stone-500">{t.admin.noReservationsYet}</div>
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-stone-400 uppercase text-[10px] tracking-widest">
            <tr>
              <th className="p-3">{t.admin.day}</th>
              <th className="p-3">{t.admin.date}</th>
              <th className="p-3">{t.admin.time}</th>
              <th className="p-3">{t.admin.name}</th>
              <th className="p-3">{t.admin.email}</th>
              <th className="p-3">{t.admin.phone}</th>
              <th className="p-3">{t.admin.guests}</th>
              <th className="p-3">{t.admin.tableNumber}</th>
              <th className="p-3">{t.admin.status}</th>
              <th className="p-3">{t.admin.proposeTime}</th>
              <th className="p-3">{t.admin.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const d = new Date(r.date);
              return (
                <tr key={r.id} className="border-t border-white/10">
                  <td className="p-3">{dayNames[d.getDay()]}</td>
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
                      <option value="PENDING">{statusLabels.PENDING}</option>
                      <option value="CONFIRMED">{statusLabels.CONFIRMED}</option>
                      <option value="CHANGE_REQUESTED">{statusLabels.CHANGE_REQUESTED}</option>
                      <option value="CANCELLED">{statusLabels.CANCELLED}</option>
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
                        <button onClick={() => sendChangeRequest(r)} className="text-amber-500 text-xs">{t.admin.send}</button>
                        <button onClick={() => setProposingId(null)} className="text-stone-500 text-xs">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setProposingId(r.id)} className="text-amber-500 text-xs hover:text-amber-400">
                        {t.admin.proposeNewTime}
                      </button>
                    )}
                  </td>
                  <td className="p-3">
                    <button onClick={() => remove(r.id)} className="text-red-400 hover:text-red-300 text-xs">
                      {t.admin.delete}
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="p-6 text-center text-stone-500">{t.admin.noReservationsYet}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}