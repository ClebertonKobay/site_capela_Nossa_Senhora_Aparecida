"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { catechismClasses, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";

const classSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  weekday: z.coerce.number().int().min(0).max(6),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
});

function parseClassForm(formData: FormData) {
  return classSchema.parse({
    name: formData.get("name"),
    weekday: formData.get("weekday"),
    time: formData.get("time"),
  });
}

export async function createClass(formData: FormData) {
  await requireRole(["admin", "catechesis_coordinator"]);

  const data = parseClassForm(formData);

  await db.insert(catechismClasses).values(data);

  revalidatePath("/admin/catechesis");
}

export async function updateClass(formData: FormData) {
  await requireRole(["admin", "catechesis_coordinator"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  const data = parseClassForm(formData);

  await db.update(catechismClasses).set(data).where(eq(catechismClasses.id, id));

  revalidatePath("/admin/catechesis");
}

export async function assignCatechist(formData: FormData) {
  await requireRole(["admin", "catechesis_coordinator"]);

  const classId = Number(formData.get("classId"));
  if (!Number.isInteger(classId)) throw new Error("classId inválido");

  const catechistIdRaw = (formData.get("catechistId") as string | null) ?? "";
  let catechistId: number | null = null;

  if (catechistIdRaw !== "") {
    const parsed = Number(catechistIdRaw);
    if (!Number.isInteger(parsed)) throw new Error("catechistId inválido");
    catechistId = parsed;

    const [catechist] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, catechistId))
      .limit(1);

    if (!catechist || catechist.role !== "catechist") {
      throw new Error("Usuário selecionado não é um catequista.");
    }
  }

  await db
    .update(catechismClasses)
    .set({ catechistId })
    .where(eq(catechismClasses.id, classId));

  revalidatePath("/admin/catechesis");
  revalidatePath("/admin/my-classes");
}

export async function toggleClassActive(formData: FormData) {
  await requireRole(["admin", "catechesis_coordinator"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  const active = formData.get("active") === "true";

  await db.update(catechismClasses).set({ active }).where(eq(catechismClasses.id, id));

  revalidatePath("/admin/catechesis");
}
