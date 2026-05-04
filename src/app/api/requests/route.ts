import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requests = await prisma.bloodRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const bloodRequest = await prisma.bloodRequest.create({
    data: {
      patientName: body.patientName,
      patientAge: parseInt(body.patientAge),
      bloodType: body.bloodType,
      rhFactor: body.rhFactor,
      unitsRequested: parseInt(body.unitsRequested),
      urgency: body.urgency || "NORMAL",
      hospitalName: body.hospitalName,
      doctorName: body.doctorName,
      notes: body.notes || null,
      requestedBy: session.user.name,
    },
  });

  return NextResponse.json(bloodRequest, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  if (body.status === "FULFILLED") {
    const bloodRequest = await prisma.bloodRequest.findUnique({ where: { id: body.id } });
    if (!bloodRequest) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    const inventory = await prisma.bloodInventory.findUnique({
      where: {
        bloodType_rhFactor: {
          bloodType: bloodRequest.bloodType,
          rhFactor: bloodRequest.rhFactor,
        },
      },
    });

    if (!inventory || inventory.unitsAvailable < bloodRequest.unitsRequested) {
      return NextResponse.json({ error: "Insufficient blood units" }, { status: 400 });
    }

    await prisma.bloodInventory.update({
      where: { id: inventory.id },
      data: {
        unitsAvailable: { decrement: bloodRequest.unitsRequested },
        lastUpdated: new Date(),
      },
    });
  }

  const updated = await prisma.bloodRequest.update({
    where: { id: body.id },
    data: {
      status: body.status,
      processedBy: session.user.name,
    },
  });

  return NextResponse.json(updated);
}
