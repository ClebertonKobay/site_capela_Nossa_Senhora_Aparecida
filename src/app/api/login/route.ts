import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { tooManyAttempts } from "@/lib/rate-limit";

const bodySchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

function genericError() {
  return NextResponse.json({ error: "Usuário ou senha incorretos." }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (tooManyAttempts(ip)) {
    return genericError();
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return genericError();
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, parsed.data.username))
    .limit(1);

  if (!user || !user.active) {
    return genericError();
  }

  const valid = await verify(user.passwordHash, parsed.data.password);
  if (!valid) {
    return genericError();
  }

  await createSession({ userId: user.id, role: user.role });
  return NextResponse.json({ ok: true });
}
