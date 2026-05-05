import bcrypt from "bcryptjs";
import prisma from "~/server/utils/prisma";
import { signToken } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, message: "Email and password required" });
  }

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) {
    throw createError({ statusCode: 401, message: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(body.password, user.hashedPassword);
  if (!valid) {
    throw createError({ statusCode: 401, message: "Invalid email or password" });
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  setCookie(event, "auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role } };
});
