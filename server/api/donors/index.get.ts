import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const donors = await prisma.donor.findMany({
    orderBy: { createdAt: "desc" },
    include: { donations: { orderBy: { donationDate: "desc" }, take: 1 } },
  });
  return donors;
});
