import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const donations = await prisma.donation.findMany({
    orderBy: { donationDate: "desc" },
    include: { donor: true },
  });

  return NextResponse.json(donations);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const donor = await prisma.donor.findUnique({ where: { id: body.donorId } });
  if (!donor) return NextResponse.json({ error: "Donor not found" }, { status: 404 });

  const donation = await prisma.donation.create({
    data: {
      donorId: body.donorId,
      bloodType: donor.bloodType,
      rhFactor: donor.rhFactor,
      volumeMl: body.volumeMl || 450,
      hemoglobinLevel: body.hemoglobinLevel ? parseFloat(body.hemoglobinLevel) : null,
      notes: body.notes || null,
      collectedBy: session.user.name,
      donationDate: new Date(),
    },
  });

  await prisma.donor.update({
    where: { id: body.donorId },
    data: { lastDonation: new Date() },
  });

  await prisma.bloodInventory.upsert({
    where: { bloodType_rhFactor: { bloodType: donor.bloodType, rhFactor: donor.rhFactor } },
    update: { unitsAvailable: { increment: 1 }, lastUpdated: new Date() },
    create: {
      bloodType: donor.bloodType,
      rhFactor: donor.rhFactor,
      unitsAvailable: 1,
      minimumStock: 5,
    },
  });

  return NextResponse.json(donation, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const updated = await prisma.donation.update({
    where: { id: body.id },
    data: { status: body.status },
  });

  return NextResponse.json(updated);
}
