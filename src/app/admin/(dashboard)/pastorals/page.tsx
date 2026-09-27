import Link from "next/link";

import { db } from "@/db";
import { pastoralMembers, pastorals, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { Button, Input, PageHeader, Popover } from "@/components/ui";
import { PlusIcon } from "@/components/icons";
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
        <PageHeader title="Membros" />
        <p className="text-body text-foreground/70">
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
        <PageHeader title="Membros" />
        <p className="text-body text-foreground/70">Pastoral não encontrada.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={pastoral.name}
        description="Membros da pastoral."
        actions={
          <Popover
            title="Novo membro"
            align="end"
            trigger={
              <button type="button" className="btn btn-confirm">
                <PlusIcon />
                Novo membro
              </button>
            }
          >
            <form action={createPastoralMember} className="flex w-full flex-col gap-4">
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
        }
      />

      {session.role === "admin" && allPastorals.length > 1 && (
        <nav
          aria-label="Trocar de pastoral"
          className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {allPastorals.map((p) => {
            const current = p.id === pastoralId;
            return (
              <Link
                key={p.id}
                href={`/admin/pastorals?pastoralId=${p.id}`}
                aria-current={current ? "page" : undefined}
                className={
                  current
                    ? "flex min-h-11 shrink-0 items-center rounded-full border border-primary bg-primary px-4 font-semibold whitespace-nowrap text-white"
                    : "flex min-h-11 shrink-0 items-center rounded-full border border-border bg-surface px-4 font-semibold whitespace-nowrap text-foreground/80 transition-colors duration-150 hover:border-primary-light/60 hover:text-primary"
                }
              >
                {p.name}
              </Link>
            );
          })}
        </nav>
      )}

      <PastoralMembersTable rows={members} pastoralId={pastoralId} />
    </div>
  );
}
