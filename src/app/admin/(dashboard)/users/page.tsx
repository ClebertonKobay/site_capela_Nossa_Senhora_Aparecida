import { db } from "@/db";
import { pastorals, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import type { UserRole } from "@/lib/session-token";

import { createUser, toggleUserActive } from "./actions";

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
              <button
                type="submit"
                className={user.active ? "btn btn-delete" : "btn btn-secondary"}
              >
                {user.active ? "Desativar" : "Ativar"}
              </button>
            </form>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-subtitle text-primary">Novo usuário</h2>
      <form action={createUser} className="mt-4 flex max-w-md flex-col gap-4">
        <div>
          <label htmlFor="username" className="text-body font-semibold text-foreground">
            Usuário
          </label>
          <input id="username" type="text" name="username" required className="field mt-1" />
        </div>
        <div>
          <label htmlFor="name" className="text-body font-semibold text-foreground">
            Nome
          </label>
          <input id="name" type="text" name="name" required className="field mt-1" />
        </div>
        <div>
          <label htmlFor="password" className="text-body font-semibold text-foreground">
            Senha
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            minLength={8}
            className="field mt-1"
          />
        </div>
        <div>
          <label htmlFor="role" className="text-body font-semibold text-foreground">
            Papel
          </label>
          <select id="role" name="role" required className="field mt-1">
            <option value="admin">Administrador</option>
            <option value="chapel_coordinator">Coordenador de Capela</option>
            <option value="pastoral_coordinator">Coordenador de Pastoral</option>
            <option value="catechesis_coordinator">Coordenador de Catequese</option>
            <option value="catechist">Catequista</option>
          </select>
        </div>
        <div>
          <label htmlFor="pastoralId" className="text-body font-semibold text-foreground">
            Pastoral (só para Coordenador de Pastoral)
          </label>
          <select id="pastoralId" name="pastoralId" className="field mt-1">
            <option value="">— nenhuma —</option>
            {allPastorals.map((pastoral) => (
              <option key={pastoral.id} value={pastoral.id}>
                {pastoral.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-confirm">
          Criar usuário
        </button>
      </form>
    </div>
  );
}
