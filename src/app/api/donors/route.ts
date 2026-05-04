import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const donors = await prisma.donor.findMany({
    orderBy: { createdAt: "desc" },
    include: { donations: { take: 1, orderBy: { donationDate: "desc" } } },
  });

  return NextResponse.json(donors);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const donor = await prisma.donor.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: new Date(body.dateOfBirth),
      gender: body.gender,
      bloodType: body.bloodType,
      rhFactor: body.rhFactor,
      email: body.email || null,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
    },
  });

  return NextResponse.json(donor, { status: 201 });
}
