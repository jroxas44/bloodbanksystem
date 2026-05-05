import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireAuth(event);

  const [donorCount, donationCount, inventory, pendingRequests, recentDonations] =
    await Promise.all([
      prisma.donor.count(),
      prisma.donation.count(),
      prisma.bloodInventory.findMany(),
      prisma.bloodRequest.count({ where: { status: "PENDING" } }),
      prisma.donation.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { donor: true },
      }),
    ]);

  const totalUnits = inventory.reduce((sum, i) => sum + i.unitsAvailable, 0);
  const lowStockTypes = inventory.filter((i) => i.unitsAvailable < i.minimumStock).length;

  return {
    donorCount,
    donationCount,
    totalUnits,
    pendingRequests,
    lowStockTypes,
    inventory,
    recentDonations,
  };
});
