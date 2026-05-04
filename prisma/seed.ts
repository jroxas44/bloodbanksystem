import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const clerkPassword = await bcrypt.hash("clerk123", 10);

  await prisma.user.upsert({
    where: { email: "admin@bloodbank.com" },
    update: {},
    create: {
      email: "admin@bloodbank.com",
      name: "Admin User",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "clerk@bloodbank.com" },
    update: {},
    create: {
      email: "clerk@bloodbank.com",
      name: "Clerk User",
      hashedPassword: clerkPassword,
      role: "CLERK",
    },
  });

  const bloodTypes = ["A", "B", "AB", "O"];
  const rhFactors = ["+", "-"];

  for (const bt of bloodTypes) {
    for (const rh of rhFactors) {
      await prisma.bloodInventory.upsert({
        where: { bloodType_rhFactor: { bloodType: bt, rhFactor: rh } },
        update: {},
        create: {
          bloodType: bt,
          rhFactor: rh,
          unitsAvailable: Math.floor(Math.random() * 20) + 5,
          minimumStock: 5,
        },
      });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
