"use server";

import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db";
import { events } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { parseCurrencyToCents, parseSaoPauloDateTime } from "@/lib/format";
import { isValidPhone, normalizePhone } from "@/lib/phone";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

// undefined = nenhum arquivo novo enviado (mantém a imagem que já existia, se houver).
// null = campo veio vazio (sem imagem).
// string = URL nova, já hospedada no Vercel Blob.
async function uploadEventImage(formData: FormData): Promise<string | null | undefined> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return undefined;

  if (!file.type.startsWith("image/")) {
    throw new Error("O arquivo da foto precisa ser uma imagem.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("A foto do evento precisa ter no máximo 5MB.");
  }

  const blob = await put(`events/${file.name}`, file, { access: "public" });
  return blob.url;
}

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
  const image = await uploadEventImage(formData);

  await db.insert(events).values({ ...data, image: image ?? null });

  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect("/admin/events");
}

export async function updateEvent(formData: FormData) {
  await requireRole(["admin", "chapel_coordinator"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  const data = parseEventForm(formData);
  const image = await uploadEventImage(formData);

  await db
    .update(events)
    .set(image === undefined ? data : { ...data, image })
    .where(eq(events.id, id));

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
