import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const requests = await prisma.bloodRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return requests;
});
