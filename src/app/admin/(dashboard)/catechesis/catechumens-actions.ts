"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { catechismClasses, catechumens } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { isValidPhone, normalizePhone } from "@/lib/phone";

const catechumenSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  guardianName: z.string().trim().optional().nullable(),
  guardianPhone: z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (!v || v.trim() === "") return null;
      return normalizePhone(v);
    })
    .refine((v) => v === null || isValidPhone(v), {
      message: "Telefone do responsável inválido",
    }),
});

function parseCatechumenForm(formData: FormData) {
  const guardianName = (formData.get("guardianName") as string | null)?.trim() || null;

  return catechumenSchema.parse({
    name: formData.get("name"),
    guardianName,
    guardianPhone: formData.get("guardianPhone"),
  });
}

export async function createCatechumen(formData: FormData) {
  await requireRole(["admin", "catechesis_coordinator"]);

  const classId = Number(formData.get("classId"));
  if (!Number.isInteger(classId)) throw new Error("Turma inválida.");

  const [existingClass] = await db
    .select({ id: catechismClasses.id })
    .from(catechismClasses)
    .where(eq(catechismClasses.id, classId))
    .limit(1);
  if (!existingClass) throw new Error("Turma não encontrada.");

  const data = parseCatechumenForm(formData);

  await db.insert(catechumens).values({ classId, ...data });

  revalidatePath("/admin/catechesis");
}

export async function updateCatechumen(formData: FormData) {
  await requireRole(["admin", "catechesis_coordinator"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  const data = parseCatechumenForm(formData);

  await db.update(catechumens).set(data).where(eq(catechumens.id, id));

  revalidatePath("/admin/catechesis");
}

export async function toggleCatechumenActive(formData: FormData) {
  await requireRole(["admin", "catechesis_coordinator"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  const active = formData.get("active") === "true";

  await db.update(catechumens).set({ active }).where(eq(catechumens.id, id));

  revalidatePath("/admin/catechesis");
}
