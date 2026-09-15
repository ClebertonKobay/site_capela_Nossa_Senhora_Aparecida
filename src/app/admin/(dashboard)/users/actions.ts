"use server";

import { hash } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/schema";
import { requireRole } from "@/lib/auth";

const createUserSchema = z.object({
  username: z.string().trim().min(1, "Usuário é obrigatório"),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
  role: z.enum([
    "admin",
    "chapel_coordinator",
    "pastoral_coordinator",
    "catechesis_coordinator",
    "catechist",
  ]),
});

export async function createUser(formData: FormData) {
  await requireRole(["admin"]);

  const data = createUserSchema.parse({
    username: formData.get("username"),
    name: formData.get("name"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  const passwordHash = await hash(data.password);

  try {
    await db.insert(users).values({
      username: data.username,
      name: data.name,
      passwordHash,
      role: data.role,
    });
  } catch (error) {
    // Driver Neon não expõe um formato de erro estável para constraint
    // única — checamos a mensagem em vez de deixar o erro cru do Postgres
    // vazar para a tela.
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("unique")) {
      redirect("/admin/users?error=username_exists");
    }
    throw error;
  }

  revalidatePath("/admin/users");
  redirect("/admin/users?created=1");
}

export async function toggleUserActive(formData: FormData) {
  await requireRole(["admin"]);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("id inválido");

  const [current] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!current) throw new Error("Usuário não encontrado");

  await db.update(users).set({ active: !current.active }).where(eq(users.id, id));

  revalidatePath("/admin/users");
}
