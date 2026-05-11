import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

let prisma: PrismaClient;

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "mysql://root:bloodbank123@localhost:3306/bloodbank";
  const parsed = new URL(url);

  const adapter = new PrismaMariaDb({
    host: parsed.hostname,
    port: parseInt(parsed.port) || 3306,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1),
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return new PrismaClient({ adapter });
}

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }
  prisma = global.__prisma;
}

export default prisma;
