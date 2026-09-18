import { db } from "@/db";
import { pastorals, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { Button, Input, Popover } from "@/components/ui";
import { UsersTable } from "@/components/admin/UsersTable";

import { createUser } from "./actions";
import { QueryToast } from "./QueryToast";
import { RoleAndPastoralFields } from "./RoleAndPastoralFields";

export default async function UsersPage() {
  await requireRole(["admin"]);

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
      <QueryToast />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-title text-primary">Usuários</h1>

        <Popover
          trigger={
            <button type="button" className="btn btn-confirm">
              <svg
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.75"
                fill="none"
                className="h-5 w-5"
              >
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Novo usuário
            </button>
          }
        >
          <form action={createUser} className="flex w-64 flex-col gap-4">
            <Input label="Usuário" type="text" name="username" required />
            <Input label="Nome" type="text" name="name" required />
            <Input label="Senha" type="password" name="password" required minLength={8} />
            <RoleAndPastoralFields pastorals={allPastorals} />
            <Button type="submit">Criar usuário</Button>
          </form>
        </Popover>
      </div>

      <div className="mt-4">
        <UsersTable rows={allUsers} />
      </div>
    </div>
  );
}
