"use client";

import { useState } from "react";
import Link from "next/link";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, parseISO } from "date-fns";
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

const STATUS_COLORS = {
  PENDING: "bg-amber-500/20 border-amber-500/40 text-amber-400",
  CONFIRMED: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
  CHANGE_REQUESTED: "bg-sky-500/20 border-sky-500/40 text-sky-400",
  CANCELLED: "bg-red-500/20 border-red-500/40 text-red-400",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function CalendarView({
  initialReservations,
  viewDate: initialViewDate,
}: {
  initialReservations: Reservation[];
  viewDate: Date;
}) {
  const { t } = useLanguage();
  const [viewDate, setViewDate] = useState(initialViewDate);
  const [reservations, setReservations] = useState(initialReservations);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayReservations, setDayReservations] = useState<Reservation[]>([]);

  const weekStart = startOfWeek(viewDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(viewDate, { weekStartsOn: 0 });

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getDayReservations = (day: Date) =>
    reservations.filter((r) => isSameDay(parseISO(r.date), day));

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setDayReservations(getDayReservations(day));
  };

  const handleReservationUpdate = async (id: string, patch: Partial<Reservation>) => {
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
      if (selectedDay) setDayReservations(getDayReservations(selectedDay));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this reservation?")) return;
    const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReservations((prev) => prev.filter((r) => r.id !== id));
      if (selectedDay) setDayReservations(getDayReservations(selectedDay));
    }
  };

  const statusLabels: Record<string, string> = {
    PENDING: t.admin.pending,
    CONFIRMED: t.admin.confirmed,
    CHANGE_REQUESTED: t.admin.changeRequested,
    CANCELLED: t.admin.cancelled,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl text-white">{t.admin.calendar}</h1>
          <p className="text-stone-400 mt-1">
            {t.admin.weekOf} {format(weekStart, "MMMM d, yyyy")} – {format(weekEnd, "MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewDate(addDays(viewDate, -7))}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-sm rounded-lg transition-colors"
          >
            {t.admin.previous}
          </button>
          <button
            onClick={() => setViewDate(new Date())}
            className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 text-sm rounded-lg transition-colors"
          >
            {t.admin.today}
          </button>
          <button
            onClick={() => setViewDate(addDays(viewDate, 7))}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-sm rounded-lg transition-colors"
          >
            {t.admin.next}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayReservations = getDayReservations(day);
          const confirmedCount = dayReservations.filter((r) => r.status === "CONFIRMED").length;
          const pendingCount = dayReservations.filter((r) => r.status === "PENDING").length;
          const isCurrentMonth = day.getMonth() === viewDate.getMonth();
          const isSelected = selectedDay && isSameDay(day, selectedDay);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`relative h-32 p-3 text-left transition-colors ${
                isSelected
                  ? "bg-amber-500/10 border-2 border-amber-500"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              } ${!isCurrentMonth ? "opacity-40" : ""} ${isToday(day) ? "ring-2 ring-amber-500/50" : ""}`}
              style={{ minHeight: "120px" }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-medium ${isToday(day) ? "text-amber-400" : "text-white"}`}>
                  {format(day, "d")}
                </span>
                <span className="text-xs text-stone-500">{DAY_NAMES[day.getDay()]}</span>
              </div>
              <div className="space-y-1 max-h-[70px] overflow-hidden">
                {dayReservations.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className={`text-xs px-2 py-1 rounded truncate ${STATUS_COLORS[r.status]}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {r.time} – {r.name} {r.tableNumber !== null && `(T${r.tableNumber})`}
                  </div>
                ))}
                {dayReservations.length > 3 && (
                  <div className="text-xs text-stone-500 truncate">
                    +{dayReservations.length - 3} more
                  </div>
                )}
              </div>
              {(confirmedCount > 0 || pendingCount > 0) && (
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {confirmedCount > 0 && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                      {confirmedCount}{t.admin.confirmedCount?.charAt(0) || "C"}
                    </span>
                  )}
                  {pendingCount > 0 && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                      {pendingCount}{t.admin.pendingCount?.charAt(0) || "P"}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-white">
              {FULL_DAY_NAMES[selectedDay.getDay()]}, {format(selectedDay, "MMMM d, yyyy")}
            </h2>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-stone-500 hover:text-white text-sm"
            >
              {t.admin.close}
            </button>
          </div>

          {dayReservations.length === 0 ? (
            <p className="text-stone-500 text-center py-8">{t.admin.noReservationsThisDay}</p>
          ) : (
            <div className="space-y-3">
              {dayReservations.map((r) => (
                <div
                  key={r.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border ${
                    STATUS_COLORS[r.status]
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-white">{r.time}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[r.status]}`}>
                        {statusLabels[r.status]}
                      </span>
                      {r.tableNumber !== null && (
                        <span className="text-sm bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                          {t.admin.table} {r.tableNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-400 text-sm mt-1">{r.name} • {r.partySize} {t.admin.guests}</p>
                    <p className="text-stone-500 text-sm">{r.email} • {r.phone}</p>
                    {r.notes && (
                      <p className="text-stone-500 text-sm mt-1 italic">{r.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={r.status}
                      onChange={(e) => handleReservationUpdate(r.id, { status: e.target.value as "PENDING" | "CONFIRMED" | "CANCELLED" | "CHANGE_REQUESTED" })}
                      className="bg-[#0a0a0a] border border-stone-600 text-xs p-1.5 rounded text-white"
                    >
                      <option value="PENDING">{statusLabels.PENDING}</option>
                      <option value="CONFIRMED">{statusLabels.CONFIRMED}</option>
                      <option value="CHANGE_REQUESTED">{statusLabels.CHANGE_REQUESTED}</option>
                      <option value="CANCELLED">{statusLabels.CANCELLED}</option>
                    </select>
                    <input
                      type="number"
                      defaultValue={r.tableNumber ?? ""}
                      onBlur={(e) =>
                        handleReservationUpdate(r.id, {
                          tableNumber: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder={t.admin.tableNumberHeader}
                      className="w-20 bg-[#0a0a0a] border border-stone-600 text-xs p-1.5 rounded text-white"
                    />
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 border border-red-500/40 rounded"
                    >
                      {t.admin.delete}
                    </button>
                    <Link
                      href={`/admin?reservation=${r.id}`}
                      className="text-amber-400 hover:text-amber-300 text-xs px-3 py-1.5 border border-amber-500/40 rounded"
                    >
                      {t.admin.viewDetails}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}