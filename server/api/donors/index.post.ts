import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);

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

  return donor;
});
