"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db";
import { events } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { parseCurrencyToCents, parseSaoPauloDateTime } from "@/lib/format";
import { isValidPhone, normalizePhone } from "@/lib/phone";

const eventSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  description: z.string().trim().nullable(),
  startAt: z.string().min(1).transform(parseSaoPauloDateTime),
  endAt: z
    .string()
    .nullable()
    .transform((v) => (v ? parseSaoPauloDateTime(v) : null)),
  location: z.string().trim().nullable(),
  whatsappPhone: z
    .string()
    .transform(normalizePhone)
    .refine(isValidPhone, { message: "Telefone do WhatsApp inválido" }),
  cardPrice: z.number().int().nonnegative().nullable(),
  sellsCards: z.boolean(),
  featured: z.boolean(),
});

function parseEventForm(formData: FormData) {
  const description = (formData.get("description") as string | null)?.trim() || null;
  const endAt = (formData.get("endAt") as string | null) || null;
  const location = (formData.get("location") as string | null)?.trim() || null;
  const cardPriceRaw = (formData.get("cardPrice") as string | null) ?? "";

  return eventSchema.parse({
    name: formData.get("name"),
    description,
    startAt: formData.get("startAt"),
    endAt,
    location,
    whatsappPhone: formData.get("whatsappPhone"),
    cardPrice: parseCurrencyToCents(cardPriceRaw),
    sellsCards: formData.get("sellsCards") === "on",
    featured: formData.get("featured") === "on",
  });
}

export async function createEvent(formData: FormData) {
  await requireRole(["admin", "chapel_coordinator"]);
  const data = parseEventForm(formData);

  await db.insert(events).values(data);

  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect("/admin/events");
}

export async function updateEvent(formData: FormData) {
  await requireRole(["admin", "chapel_coordinator"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  const data = parseEventForm(formData);

  await db.update(events).set(data).where(eq(events.id, id));

  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath(`/events/${id}`);
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  await requireRole(["admin", "chapel_coordinator"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  await db.delete(events).where(eq(events.id, id));

  revalidatePath("/admin/events");
  revalidatePath("/");
}
