import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const inventory = await prisma.bloodInventory.findMany({
    orderBy: [{ bloodType: "asc" }, { rhFactor: "asc" }],
  });

  return NextResponse.json(inventory);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const updated = await prisma.bloodInventory.update({
    where: { id: body.id },
    data: {
      unitsAvailable: body.unitsAvailable,
      minimumStock: body.minimumStock,
      lastUpdated: new Date(),
    },
  });

  return NextResponse.json(updated);
}
