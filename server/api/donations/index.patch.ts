import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

const VALID_STATUSES = ["COLLECTED", "TESTED", "APPROVED", "REJECTED", "EXPIRED"];
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  COLLECTED: ["TESTED", "REJECTED"],
  TESTED: ["APPROVED", "REJECTED"],
};

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);

  if (!VALID_STATUSES.includes(body.status)) {
    throw createError({ statusCode: 400, message: "Invalid status" });
  }

  const donation = await prisma.donation.findUnique({ where: { id: body.id } });
  if (!donation) {
    throw createError({ statusCode: 404, message: "Donation not found" });
  }

  const allowed = ALLOWED_TRANSITIONS[donation.status];
  if (allowed && !allowed.includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: `Cannot transition from ${donation.status} to ${body.status}`,
    });
  }

  const updated = await prisma.donation.update({
    where: { id: body.id },
    data: { status: body.status },
  });

  if (body.status === "APPROVED") {
    await prisma.bloodInventory.upsert({
      where: {
        bloodType_rhFactor: {
          bloodType: donation.bloodType,
          rhFactor: donation.rhFactor,
        },
      },
      update: {
        unitsAvailable: { increment: 1 },
        lastUpdated: new Date(),
      },
      create: {
        bloodType: donation.bloodType,
        rhFactor: donation.rhFactor,
        unitsAvailable: 1,
        lastUpdated: new Date(),
      },
    });
  }

  return updated;
});
