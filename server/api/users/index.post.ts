import bcrypt from "bcryptjs";
import prisma from "~/server/utils/prisma";
import { requireAdmin } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const body = await readBody(event);

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    throw createError({ statusCode: 400, message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      hashedPassword,
      role: body.role || "CLERK",
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return user;
});
