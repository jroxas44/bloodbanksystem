import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
    include: { donor: true },
  });
  return donations;
});
