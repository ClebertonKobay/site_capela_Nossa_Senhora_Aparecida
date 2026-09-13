import { verify } from "@node-rs/argon2";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createSession } from "@/lib/auth";
import { tooManyAttempts } from "@/lib/rate-limit";

const bodySchema = z.object({
  password: z.string().min(1),
});

function genericError() {
  return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
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

  const hashBase64 = process.env.ADMIN_PASSWORD_HASH_BASE64;
  if (!hashBase64) {
    throw new Error("ADMIN_PASSWORD_HASH_BASE64 não configurado");
  }
  const hash = Buffer.from(hashBase64, "base64").toString("utf8");

  const valid = await verify(hash, parsed.data.password);
  if (!valid) {
    return genericError();
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
