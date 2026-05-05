import prisma from "~/server/utils/prisma";
import { requireAdmin } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const user = requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (user.userId === id) {
    throw createError({ statusCode: 400, message: "Cannot delete yourself" });
  }

  await prisma.user.delete({ where: { id } });
  return { success: true };
});
