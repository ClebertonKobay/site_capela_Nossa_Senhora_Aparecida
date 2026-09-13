import { cookies } from "next/headers";

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  verifySessionToken,
} from "./session-token";

export async function createSession() {
  const token = await signSessionToken();
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

export async function readSession(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

// Chamar na primeira linha de toda Route Handler / Server Action administrativa.
// O middleware protege a navegação, mas não as chamadas diretas à API.
export async function requireAdmin() {
  const authenticated = await readSession();
  if (!authenticated) {
    throw new Response("Não autorizado", { status: 401 });
  }
}
