"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { pastoralMembers, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { isValidPhone, normalizePhone } from "@/lib/phone";
import type { SessionPayload } from "@/lib/session-token";

const memberSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  phone: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? normalizePhone(v) : null))
    .refine((v) => v === null || isValidPhone(v), { message: "Telefone inválido" }),
  notes: z.string().trim().optional().nullable(),
});

function parseMemberForm(formData: FormData) {
  const phone = (formData.get("phone") as string | null) ?? undefined;
  const notes = (formData.get("notes") as string | null)?.trim() || null;

  return memberSchema.parse({
    name: formData.get("name"),
    phone,
    notes,
  });
}

// Para pastoral_coordinator, o pastoralId vem sempre do banco (vínculo em
// users.pastoralId), nunca do formulário — evita que alguém forje o campo
// e gerencie membros de outra pastoral.
async function resolvePastoralId(
  session: SessionPayload,
  formPastoralId: number | null,
): Promise<number> {
  if (session.role === "admin") {
    if (formPastoralId === null) throw new Error("Pastoral não informada");
    return formPastoralId;
  }

  const [user] = await db
    .select({ pastoralId: users.pastoralId })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user || user.pastoralId === null) {
    throw new Error("Sua conta não está vinculada a nenhuma pastoral.");
  }

  return user.pastoralId;
}

function parseFormPastoralId(formData: FormData): number | null {
  const raw = formData.get("pastoralId");
  return raw ? Number(raw) : null;
}

// Confere que o membro pertence à pastoral do coordenador antes de alterar.
// Admin pode alterar qualquer membro.
async function assertOwnership(session: SessionPayload, memberId: number, pastoralId: number) {
  if (session.role === "admin") return;

  const [member] = await db
    .select({ pastoralId: pastoralMembers.pastoralId })
    .from(pastoralMembers)
    .where(eq(pastoralMembers.id, memberId))
    .limit(1);

  if (!member || member.pastoralId !== pastoralId) {
    throw new Response("Não autorizado", { status: 401 });
  }
}

export async function createPastoralMember(formData: FormData) {
  const session = await requireRole(["admin", "pastoral_coordinator"]);
  const data = parseMemberForm(formData);
  const pastoralId = await resolvePastoralId(session, parseFormPastoralId(formData));

  await db.insert(pastoralMembers).values({
    pastoralId,
    name: data.name,
    phone: data.phone,
    notes: data.notes,
  });

  revalidatePath("/admin/pastorals");
}

export async function updatePastoralMember(formData: FormData) {
  const session = await requireRole(["admin", "pastoral_coordinator"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  const data = parseMemberForm(formData);
  const pastoralId = await resolvePastoralId(session, parseFormPastoralId(formData));

  await assertOwnership(session, id, pastoralId);

  await db
    .update(pastoralMembers)
    .set({
      name: data.name,
      phone: data.phone,
      notes: data.notes,
    })
    .where(eq(pastoralMembers.id, id));

  revalidatePath("/admin/pastorals");
}

export async function toggleMemberActive(formData: FormData) {
  const session = await requireRole(["admin", "pastoral_coordinator"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  const active = formData.get("active") === "true";
  const pastoralId = await resolvePastoralId(session, parseFormPastoralId(formData));

  await assertOwnership(session, id, pastoralId);

  await db.update(pastoralMembers).set({ active }).where(eq(pastoralMembers.id, id));

  revalidatePath("/admin/pastorals");
}
