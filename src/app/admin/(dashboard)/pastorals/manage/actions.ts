"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { pastorals } from "@/db/schema";
import { requireRole } from "@/lib/auth";

const nameSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
});

export async function createPastoral(formData: FormData) {
  await requireRole(["admin"]);

  const { name } = nameSchema.parse({
    name: formData.get("name"),
  });

  await db.insert(pastorals).values({ name });

  revalidatePath("/admin/pastorals/manage");
  revalidatePath("/admin/users");
}

export async function renamePastoral(formData: FormData) {
  await requireRole(["admin"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  const { name } = nameSchema.parse({
    name: formData.get("name"),
  });

  await db.update(pastorals).set({ name }).where(eq(pastorals.id, id));

  revalidatePath("/admin/pastorals/manage");
  revalidatePath("/admin/users");
}
