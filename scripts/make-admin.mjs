// Usage: node scripts/make-admin.mjs someone@example.com
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/make-admin.mjs <email>");
  process.exit(1);
}

const user = await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
console.log(`${user.email} is now ADMIN.`);
await prisma.$disconnect();
