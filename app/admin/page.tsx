import { prisma } from "@/lib/prisma";
import AdminTable from "./AdminTable";

export default async function AdminPage() {
  const reservations = await prisma.reservation.findMany({ orderBy: { date: "asc" } });

  return (
    <>
      <h1 className="text-4xl text-white mb-10">Reservations</h1>
      <AdminTable initial={JSON.parse(JSON.stringify(reservations))} />
    </>
  );
}