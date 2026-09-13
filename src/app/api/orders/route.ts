import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { cardOrders, events } from "@/db/schema";
import { isValidPhone, normalizePhone } from "@/lib/phone";
import { tooManyAttempts } from "@/lib/rate-limit";

// Rota pública — sem requireAdmin(). Precisa de cuidado próprio: Zod
// estrito, quantidade limitada e rate limit por IP, senão vira um
// formulário aberto pra encher a tabela de lixo.
const bodySchema = z.object({
  eventId: z.number().int().positive(),
  name: z.string().trim().min(1).max(200),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine(isValidPhone, { message: "Telefone inválido" }),
  quantity: z.number().int().min(1).max(50),
});

function genericError(status: number) {
  return NextResponse.json({ error: "Não foi possível registrar o pedido." }, { status });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooManyAttempts(`order:${ip}`)) {
    return genericError(429);
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return genericError(400);
  }

  const [event] = await db.select().from(events).where(eq(events.id, parsed.data.eventId)).limit(1);
  if (!event || !event.sellsCards) {
    return genericError(404);
  }

  const [order] = await db
    .insert(cardOrders)
    .values({
      eventId: event.id,
      name: parsed.data.name,
      phone: parsed.data.phone,
      quantity: parsed.data.quantity,
    })
    .returning({ id: cardOrders.id });

  return NextResponse.json({ ok: true, orderId: order.id });
}
