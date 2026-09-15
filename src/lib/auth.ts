import { cookies } from "next/headers";

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  getSessionPayload,
  type SessionPayload,
  type UserRole,
} from "./session-token";

export async function createSession(payload: SessionPayload) {
  const token = await signSessionToken(payload);
  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return getSessionPayload(token);
}

// Chamar na primeira linha de toda Route Handler / Server Action administrativa.
// O middleware protege a navegação, mas não as chamadas diretas à API.
export async function requireRole(allowed: UserRole[]): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || !allowed.includes(session.role)) {
    throw new Response("Não autorizado", { status: 401 });
  }
  return session;
}
