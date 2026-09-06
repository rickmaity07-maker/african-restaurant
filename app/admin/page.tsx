import { prisma } from "@/lib/prisma";
import AdminTable from "./AdminTable";

export default async function AdminPage() {
  const reservations = await prisma.reservation.findMany({ orderBy: { date: "asc" } });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-stone-200 px-6 md:px-16 py-24">
      <h1 className="text-4xl text-white mb-10">Reservations</h1>
      <AdminTable initial={JSON.parse(JSON.stringify(reservations))} />
    </main>
  );
}
