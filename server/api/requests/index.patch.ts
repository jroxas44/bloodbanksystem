import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

const VALID_REQUEST_STATUSES = ["PENDING", "APPROVED", "FULFILLED", "REJECTED"];

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const body = await readBody(event);

  if (!VALID_REQUEST_STATUSES.includes(body.status)) {
    throw createError({ statusCode: 400, message: "Invalid status" });
  }

  if (body.status === "FULFILLED") {
    const result = await prisma.$transaction(async (tx) => {
      const bloodRequest = await tx.bloodRequest.findUnique({ where: { id: body.id } });
      if (!bloodRequest) throw new Error("NOT_FOUND");

      const inventory = await tx.bloodInventory.findUnique({
        where: {
          bloodType_rhFactor: {
            bloodType: bloodRequest.bloodType,
            rhFactor: bloodRequest.rhFactor,
          },
        },
      });

      if (!inventory || inventory.unitsAvailable < bloodRequest.unitsRequested) {
        throw new Error("INSUFFICIENT");
      }

      await tx.bloodInventory.update({
        where: { id: inventory.id },
        data: {
          unitsAvailable: { decrement: bloodRequest.unitsRequested },
          lastUpdated: new Date(),
        },
      });

      return tx.bloodRequest.update({
        where: { id: body.id },
        data: { status: body.status, processedBy: user.name },
      });
    });

    return result;
  }

  const updated = await prisma.bloodRequest.update({
    where: { id: body.id },
    data: { status: body.status, processedBy: user.name },
  });

  return updated;
});
