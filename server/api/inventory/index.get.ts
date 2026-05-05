import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const inventory = await prisma.bloodInventory.findMany({
    orderBy: [{ bloodType: "asc" }, { rhFactor: "asc" }],
  });
  return inventory;
});
