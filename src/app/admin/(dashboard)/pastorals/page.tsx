import Link from "next/link";

import { db } from "@/db";
import { pastoralMembers, pastorals, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { formatPhone } from "@/lib/phone";
import { Button, Input } from "@/components/ui";

import { createPastoralMember, toggleMemberActive, updatePastoralMember } from "./actions";

export default async function PastoralsPage({
  searchParams,
}: PageProps<"/admin/pastorals">) {
  const session = await requireRole(["admin", "pastoral_coordinator"]);

  let pastoralId: number | null = null;

  if (session.role === "admin") {
    const { pastoralId: rawPastoralId } = await searchParams;
    const parsed = rawPastoralId ? Number(rawPastoralId) : null;
    pastoralId = parsed && Number.isInteger(parsed) ? parsed : null;

    if (pastoralId === null) {
      const [first] = await db.select().from(pastorals).orderBy(pastorals.name).limit(1);
      pastoralId = first?.id ?? null;
    }
  } else {
    const [user] = await db
      .select({ pastoralId: users.pastoralId })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    pastoralId = user?.pastoralId ?? null;
  }

  if (pastoralId === null) {
    return (
      <div>
        <h1 className="text-title text-primary">Membros</h1>
        <p className="mt-4 text-body text-foreground/70">
          {session.role === "admin" ? (
            <>
              Nenhuma pastoral cadastrada ainda. Crie uma em{" "}
              <Link href="/admin/pastorals/manage" className="font-semibold text-primary-light">
                Pastorais → Gerenciar
              </Link>
              .
            </>
          ) : (
            "Sua conta não está vinculada a nenhuma pastoral — peça para o administrador vincular."
          )}
        </p>
      </div>
    );
  }

  const [allPastorals, pastoralRows, members] = await Promise.all([
    session.role === "admin" ? db.select().from(pastorals).orderBy(pastorals.name) : Promise.resolve([]),
    db.select().from(pastorals).where(eq(pastorals.id, pastoralId)).limit(1),
    db
      .select()
      .from(pastoralMembers)
      .where(eq(pastoralMembers.pastoralId, pastoralId))
      .orderBy(pastoralMembers.name),
  ]);

  const pastoral = pastoralRows[0];

  if (!pastoral) {
    return (
      <div>
        <h1 className="text-title text-primary">Membros</h1>
        <p className="mt-4 text-body text-foreground/70">Pastoral não encontrada.</p>
      </div>
    );
  }

  return (
    <div>
      {session.role === "admin" && allPastorals.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allPastorals.map((p) => (
            <Link
              key={p.id}
              href={`/admin/pastorals?pastoralId=${p.id}`}
              className={`btn ${p.id === pastoralId ? "btn-confirm" : "btn-secondary"}`}
            >
              {p.name}
            </Link>
          ))}
        </div>
      )}

      <h1 className="mt-4 text-title text-primary">Membros — {pastoral.name}</h1>

      <ul className="mt-6 flex flex-col gap-4">
        {members.length === 0 && (
          <p className="text-body text-foreground/70">Nenhum membro cadastrado ainda.</p>
        )}
        {members.map((member) => (
          <li
            key={member.id}
            className="flex flex-col gap-3 border-l-4 border-primary-light pl-3"
          >
            <div>
              <p className="text-body font-semibold text-foreground">
                {member.name}
                {!member.active && (
                  <span className="ml-2 text-caption text-foreground/60">(inativo)</span>
                )}
              </p>
              {member.phone && (
                <p className="text-body text-foreground/70">{formatPhone(member.phone)}</p>
              )}
              {member.notes && <p className="text-body text-foreground/70">{member.notes}</p>}
            </div>

            <form action={updatePastoralMember} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={member.id} />
              <input type="hidden" name="pastoralId" value={pastoralId} />
              <Input
                type="text"
                name="name"
                defaultValue={member.name}
                required
                aria-label={`Nome de ${member.name}`}
              />
              <Input
                type="text"
                name="phone"
                defaultValue={member.phone ? formatPhone(member.phone) : ""}
                placeholder="(42) 99999-8888"
                aria-label={`Telefone de ${member.name}`}
              />
              <Input
                type="text"
                name="notes"
                defaultValue={member.notes ?? ""}
                placeholder="Notas"
                aria-label={`Notas de ${member.name}`}
              />
              <Button type="submit" variant="secondary">
                Salvar
              </Button>
            </form>

            <form action={toggleMemberActive}>
              <input type="hidden" name="id" value={member.id} />
              <input type="hidden" name="pastoralId" value={pastoralId} />
              <input type="hidden" name="active" value={member.active ? "false" : "true"} />
              <Button type="submit" variant={member.active ? "cancel" : "secondary"}>
                {member.active ? "Desativar" : "Ativar"}
              </Button>
            </form>
          </li>
        ))}
      </ul>

      <form action={createPastoralMember} className="mt-8 flex max-w-md flex-col gap-4">
        <h2 className="text-subtitle text-primary">Novo membro</h2>
        <Input label="Nome" id="name" type="text" name="name" required />
        <Input
          label="Telefone"
          id="phone"
          type="text"
          name="phone"
          placeholder="(42) 99999-8888"
        />
        <Input label="Notas" id="notes" type="text" name="notes" />
        <input type="hidden" name="pastoralId" value={pastoralId} />
        <Button type="submit">Adicionar membro</Button>
      </form>
    </div>
  );
}
