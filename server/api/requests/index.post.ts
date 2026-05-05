import prisma from "~/server/utils/prisma";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const body = await readBody(event);

  const request = await prisma.bloodRequest.create({
    data: {
      patientName: body.patientName,
      patientAge: parseInt(body.patientAge),
      bloodType: body.bloodType,
      rhFactor: body.rhFactor,
      unitsRequested: parseInt(body.unitsRequested) || 1,
      urgency: body.urgency || "NORMAL",
      hospitalName: body.hospitalName,
      doctorName: body.doctorName,
      notes: body.notes || null,
      requestedBy: user.name,
    },
  });

  return request;
});
