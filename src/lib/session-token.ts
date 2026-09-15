import { jwtVerify, SignJWT } from "jose";

import type { userRole } from "@/db/schema";

export const SESSION_COOKIE_NAME = "session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 dias

export type UserRole = (typeof userRole.enumValues)[number];

export type SessionPayload = { userId: number; role: UserRole };

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET não configurado");
  // JWT_SECRET é gerado como base64 (32+ bytes) — decodificar sem Buffer,
  // já que este módulo também roda no middleware (Edge runtime).
  return Uint8Array.from(atob(secret), (c) => c.charCodeAt(0));
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function getSessionPayload(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.userId !== "number" || typeof payload.role !== "string") return null;
    return { userId: payload.userId, role: payload.role as UserRole };
  } catch {
    return null;
  }
}
