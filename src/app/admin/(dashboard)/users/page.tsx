import { db } from "@/db";
import { pastorals, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { Button, Input, PageHeader, Popover } from "@/components/ui";
import { PlusIcon } from "@/components/icons";
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

      <PageHeader
        title="Usuários"
        description="Quem entra no painel e o que cada pessoa pode fazer."
        actions={
          <Popover
            title="Novo usuário"
            align="end"
            trigger={
              <button type="button" className="btn btn-confirm">
                <PlusIcon />
                Novo usuário
              </button>
            }
          >
            <form action={createUser} className="flex w-full flex-col gap-4">
              <Input label="Usuário" type="text" name="username" required />
              <Input label="Nome" type="text" name="name" required />
              <Input label="Senha" type="password" name="password" required minLength={8} />
              <RoleAndPastoralFields pastorals={allPastorals} />
              <Button type="submit">Criar usuário</Button>
            </form>
          </Popover>
        }
      />

      <UsersTable rows={allUsers} />
    </div>
  );
}
