"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useLanguage } from "@/lib/languageContext";

export function AdminHeader() {
  const { t } = useLanguage();
  return (
    <div className="border-b border-white/10 px-6 md:px-16 py-6 flex items-center justify-between">
      <Logo size="sm" />
      <div className="flex items-center gap-8 text-xs uppercase tracking-widest">
        <nav className="flex gap-8 overflow-x-auto scrollbar-none pb-2">
          <Link href="/admin" className="hover:text-amber-500 transition-colors whitespace-nowrap">Reservations</Link>
          <Link href="/admin/calendar" className="hover:text-amber-500 transition-colors whitespace-nowrap">Calendar</Link>
          <Link href="/admin/history" className="hover:text-amber-500 transition-colors whitespace-nowrap">History</Link>
          <Link href="/admin/menu" className="hover:text-amber-500 transition-colors whitespace-nowrap">Menu</Link>
        </nav>
        <Link
          href="/"
          className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          ← {t.admin.backToSite}
        </Link>
      </div>
    </div>
  );
}