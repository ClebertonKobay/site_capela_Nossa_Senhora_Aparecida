"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { catechumens, classCatechists } from "@/db/schema";
import { requireRole } from "@/lib/auth";

export async function adjustAbsences(catechumenId: number, count: number) {
  const session = await requireRole(["admin", "catechesis_coordinator", "catechist"]);

  if (!Number.isInteger(catechumenId) || !Number.isInteger(count) || count < 0) {
    throw new Error("Dados inválidos");
  }

  const [catechumen] = await db
    .select({ classId: catechumens.classId })
    .from(catechumens)
    .where(eq(catechumens.id, catechumenId))
    .limit(1);
  if (!catechumen) throw new Error("Catequizando não encontrado");

  if (session.role === "catechist") {
    const [ownedClass] = await db
      .select({ classId: classCatechists.classId })
      .from(classCatechists)
      .where(
        and(
          eq(classCatechists.classId, catechumen.classId),
          eq(classCatechists.catechistId, session.userId),
        ),
      )
      .limit(1);
    if (!ownedClass) {
      throw new Response("Não autorizado", { status: 401 });
    }
  }

  await db.update(catechumens).set({ absencesCount: count }).where(eq(catechumens.id, catechumenId));
  revalidatePath("/admin/my-classes");
}
