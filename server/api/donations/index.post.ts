import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const body = await readBody(event);

  const donor = await prisma.donor.findUnique({ where: { id: body.donorId } });
  if (!donor) {
    throw createError({ statusCode: 404, message: "Donor not found" });
  }

  const donation = await prisma.donation.create({
    data: {
      donorId: body.donorId,
      volumeMl: parseInt(body.volumeMl) || 450,
      bloodType: donor.bloodType,
      rhFactor: donor.rhFactor,
      hemoglobinLevel: body.hemoglobinLevel ? parseFloat(body.hemoglobinLevel) : null,
      notes: body.notes || null,
      collectedBy: user.name,
    },
  });

  await prisma.donor.update({
    where: { id: body.donorId },
    data: { lastDonation: new Date() },
  });

  return donation;
});
