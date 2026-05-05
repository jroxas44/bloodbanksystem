import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);

  const updated = await prisma.bloodInventory.update({
    where: { id: body.id },
    data: {
      unitsAvailable: parseInt(body.unitsAvailable),
      minimumStock: parseInt(body.minimumStock),
      lastUpdated: new Date(),
    },
  });

  return updated;
});
