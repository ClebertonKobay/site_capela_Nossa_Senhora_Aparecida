import Link from "next/link";

import { db } from "@/db";
import { pastoralMembers, pastorals, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { Button, Input, Popover } from "@/components/ui";
import { PastoralMembersTable } from "@/components/admin/PastoralMembersTable";

import { createPastoralMember } from "./actions";

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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-title text-primary">Membros — {pastoral.name}</h1>

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
              Novo membro
            </button>
          }
        >
          <form action={createPastoralMember} className="flex w-64 flex-col gap-4">
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
        </Popover>
      </div>

      {members.length === 0 ? (
        <p className="mt-6 text-body text-foreground/70">Nenhum membro cadastrado ainda.</p>
      ) : (
        <div className="mt-6">
          <PastoralMembersTable rows={members} pastoralId={pastoralId} />
        </div>
      )}
    </div>
  );
}
