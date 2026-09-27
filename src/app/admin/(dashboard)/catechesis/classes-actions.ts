"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { catechismClasses, classCatechists, users } from "@/db/schema";
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

const classCatechistsSchema = z.object({
  classId: z.coerce.number().int().positive(),
  // Uma turma pode ter vários catequistas (lista de caixinhas no form).
  catechistIds: z.array(z.coerce.number().int().positive()).max(20),
});

export async function setClassCatechists(formData: FormData) {
  await requireRole(["admin", "catechesis_coordinator"]);

  const { classId, catechistIds } = classCatechistsSchema.parse({
    classId: formData.get("classId"),
    catechistIds: formData.getAll("catechistIds"),
  });
  const uniqueIds = [...new Set(catechistIds)];

  if (uniqueIds.length > 0) {
    const found = await db
      .select({ id: users.id })
      .from(users)
      .where(and(inArray(users.id, uniqueIds), eq(users.role, "catechist")));
    if (found.length !== uniqueIds.length) {
      throw new Error("Algum usuário selecionado não é catequista.");
    }
  }

  // Apaga e regrava a lista numa transação só (batch do driver Neon HTTP).
  const remove = db.delete(classCatechists).where(eq(classCatechists.classId, classId));
  if (uniqueIds.length === 0) {
    await remove;
  } else {
    await db.batch([
      remove,
      db.insert(classCatechists).values(uniqueIds.map((catechistId) => ({ classId, catechistId }))),
    ]);
  }

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
