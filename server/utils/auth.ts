import jwt from "jsonwebtoken";
import type { H3Event } from "h3";

interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  const config = useRuntimeConfig();
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "24h" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const config = useRuntimeConfig();
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  } catch {
    return null;
  }
}

export function getAuthUser(event: H3Event): TokenPayload | null {
  const cookie = getCookie(event, "auth_token");
  if (!cookie) return null;
  return verifyToken(cookie);
}

export function requireAuth(event: H3Event): TokenPayload {
  const user = getAuthUser(event);
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  return user;
}

export function requireAdmin(event: H3Event): TokenPayload {
  const user = requireAuth(event);
  if (user.role !== "ADMIN") {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }
  return user;
}
