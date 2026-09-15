import { db } from "@/db";
import { pastorals, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import type { UserRole } from "@/lib/session-token";
import { Button, Input } from "@/components/ui";

import { createUser, toggleUserActive } from "./actions";
import { RoleAndPastoralFields } from "./RoleAndPastoralFields";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  chapel_coordinator: "Coordenador de Capela",
  pastoral_coordinator: "Coordenador de Pastoral",
  catechesis_coordinator: "Coordenador de Catequese",
  catechist: "Catequista",
};

export default async function UsersPage({
  searchParams,
}: PageProps<"/admin/users">) {
  await requireRole(["admin"]);

  const { created, error } = await searchParams;

  // Nunca selecionar passwordHash para o componente.
  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      role: users.role,
      active: users.active,
    })
    .from(users)
    .orderBy(users.username);

  const allPastorals = await db
    .select({ id: pastorals.id, name: pastorals.name })
    .from(pastorals)
    .orderBy(pastorals.name);

  return (
    <div>
      <h1 className="text-title text-primary">Usuários</h1>

      {created && (
        <p className="mt-3 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-body font-semibold text-success">
          Usuário criado com sucesso!
        </p>
      )}
      {error === "username_exists" && (
        <p className="mt-3 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-body font-semibold text-danger">
          Nome de usuário já existe.
        </p>
      )}

      <ul className="mt-4 flex flex-col gap-3">
        {allUsers.map((user) => (
          <li
            key={user.id}
            className="flex flex-wrap items-center justify-between gap-3 border-l-4 border-primary-light pl-3"
          >
            <div>
              <p className="font-semibold text-primary">
                {user.name} <span className="text-foreground/60">({user.username})</span>
              </p>
              <p className="text-caption text-foreground/70">{ROLE_LABELS[user.role]}</p>
            </div>
            <form action={toggleUserActive}>
              <input type="hidden" name="id" value={user.id} />
              <Button type="submit" variant={user.active ? "cancel" : "secondary"}>
                {user.active ? "Desativar" : "Ativar"}
              </Button>
            </form>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-subtitle text-primary">Novo usuário</h2>
      <form action={createUser} className="mt-4 flex max-w-md flex-col gap-4">
        <Input label="Usuário" type="text" name="username" required />
        <Input label="Nome" type="text" name="name" required />
        <Input label="Senha" type="password" name="password" required minLength={8} />
        <RoleAndPastoralFields pastorals={allPastorals} />
        <Button type="submit">Criar usuário</Button>
      </form>
    </div>
  );
}
