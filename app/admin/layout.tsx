import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import NewReservationAlert from "@/components/admin/NewReservationAlert";
import Logo from "@/components/Logo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200">
      <div className="border-b border-white/10 px-6 md:px-16 py-6 flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex gap-8 text-xs uppercase tracking-widest">
          <Link href="/admin" className="hover:text-amber-500 transition-colors">Reservations</Link>
          <Link href="/admin/calendar" className="hover:text-amber-500 transition-colors">Calendar</Link>
          <Link href="/admin/history" className="hover:text-amber-500 transition-colors">History</Link>
          <Link href="/admin/menu" className="hover:text-amber-500 transition-colors">Menu</Link>
        </div>
      </div>
      <div className="px-6 md:px-16 py-12">{children}</div>
      <NewReservationAlert />
    </div>
  );
}