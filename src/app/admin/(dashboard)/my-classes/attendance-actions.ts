"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { catechismAttendance, catechismClasses } from "@/db/schema";
import { requireRole } from "@/lib/auth";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export async function saveAttendance(formData: FormData) {
  const session = await requireRole(["admin", "catechesis_coordinator", "catechist"]);

  const classIdRaw = Number(formData.get("classId"));
  if (!Number.isInteger(classIdRaw)) {
    throw new Response("Dados inválidos", { status: 400 });
  }
  const classId = classIdRaw;

  // Catequista só pode gravar presença na própria turma — checagem de posse
  // central desta ação, já que proxy.ts não protege a chamada direta.
  if (session.role === "catechist") {
    const [ownedClass] = await db
      .select({ catechistId: catechismClasses.catechistId })
      .from(catechismClasses)
      .where(eq(catechismClasses.id, classId))
      .limit(1);

    if (!ownedClass || ownedClass.catechistId !== session.userId) {
      throw new Response("Não autorizado", { status: 401 });
    }
  }

  const dateRaw = formData.get("date");
  const date = dateSchema.parse(dateRaw);

  const catechumenIdsRaw = formData.get("catechumenIds");
  if (typeof catechumenIdsRaw !== "string") {
    throw new Response("Dados inválidos", { status: 400 });
  }
  const catechumenIds = z.array(z.number().int()).parse(JSON.parse(catechumenIdsRaw));

  for (const catechumenId of catechumenIds) {
    const present = formData.get(`present-${catechumenId}`) === "on";

    await db
      .insert(catechismAttendance)
      .values({ classId, catechumenId, date, present })
      .onConflictDoUpdate({
        target: [catechismAttendance.classId, catechismAttendance.catechumenId, catechismAttendance.date],
        set: { present },
      });
  }

  revalidatePath("/admin/my-classes");
}
