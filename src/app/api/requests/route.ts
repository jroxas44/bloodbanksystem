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

const VALID_REQUEST_STATUSES = ["PENDING", "APPROVED", "FULFILLED", "REJECTED"];

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  if (!VALID_REQUEST_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
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
        data: { status: body.status, processedBy: session.user.name },
      });
    });

    return NextResponse.json(result);
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
