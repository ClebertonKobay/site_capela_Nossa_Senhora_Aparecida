import Link from "next/link";

import { db } from "@/db";
import { pastorals } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { Button, IconButton, Input, PageHeader, Panel, Popover } from "@/components/ui";
import { PencilIcon, PlusIcon } from "@/components/icons";

import { createPastoral, renamePastoral } from "./actions";

export default async function PastoralsManagePage() {
  await requireRole(["admin"]);

  const allPastorals = await db
    .select()
    .from(pastorals)
    .orderBy(pastorals.name);

  return (
    <div>
      <PageHeader
        title="Pastorais"
        description="Escolha uma pastoral para ver e cadastrar os membros."
        actions={
          <Popover
            title="Nova pastoral"
            align="end"
            trigger={
              <button type="button" className="btn btn-confirm">
                <PlusIcon />
                Nova pastoral
              </button>
            }
          >
            <form action={createPastoral} className="flex w-full flex-col gap-4">
              <Input label="Nome da pastoral" id="name" type="text" name="name" required />
              <Button type="submit">Criar pastoral</Button>
            </form>
          </Popover>
        }
      />

      <Panel>
        {allPastorals.length === 0 ? (
          <p className="px-4 py-10 text-center text-body text-foreground/70 sm:px-5">
            Nenhuma pastoral cadastrada ainda. Use “Nova pastoral” para criar a primeira.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {allPastorals.map((pastoral) => (
              <li key={pastoral.id} className="flex items-center gap-2 py-1.5 pr-2 pl-4 sm:pl-5">
                <Link
                  href={`/admin/pastorals?pastoralId=${pastoral.id}`}
                  className="flex min-h-11 min-w-0 flex-1 items-center font-semibold text-primary hover:text-primary-light"
                >
                  <span className="truncate">{pastoral.name}</span>
                </Link>
                <Popover
                  title={`Renomear ${pastoral.name}`}
                  align="end"
                  trigger={
                    <IconButton aria-label={`Renomear ${pastoral.name}`} title="Renomear">
                      <PencilIcon />
                    </IconButton>
                  }
                >
                  <form action={renamePastoral} className="flex w-full flex-col gap-3">
                    <input type="hidden" name="id" value={pastoral.id} />
                    <Input type="text" name="name" defaultValue={pastoral.name} required aria-label="Nome da pastoral" />
                    <Button type="submit" variant="secondary">
                      Salvar
                    </Button>
                  </form>
                </Popover>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
