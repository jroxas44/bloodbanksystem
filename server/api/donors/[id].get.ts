import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const id = getRouterParam(event, "id");

  const donor = await prisma.donor.findUnique({
    where: { id },
    include: { donations: { orderBy: { donationDate: "desc" } } },
  });

  if (!donor) {
    throw createError({ statusCode: 404, message: "Donor not found" });
  }

  return donor;
});
