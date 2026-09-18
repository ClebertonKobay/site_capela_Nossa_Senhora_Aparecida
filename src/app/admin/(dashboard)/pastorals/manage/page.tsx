import Link from "next/link";

import { db } from "@/db";
import { pastorals } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { Button, IconButton, Input, Popover } from "@/components/ui";

import { createPastoral, renamePastoral } from "./actions";

export default async function PastoralsManagePage() {
  await requireRole(["admin"]);

  const allPastorals = await db
    .select()
    .from(pastorals)
    .orderBy(pastorals.name);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-title text-primary">Pastorais</h1>

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
              Nova pastoral
            </button>
          }
        >
          <form action={createPastoral} className="flex w-64 flex-col gap-4">
            <Input label="Nova pastoral" id="name" type="text" name="name" required />
            <Button type="submit">Criar pastoral</Button>
          </form>
        </Popover>
      </div>

      <ul className="mt-8 flex flex-col gap-4">
        {allPastorals.map((pastoral) => (
          <li
            key={pastoral.id}
            className="flex flex-wrap items-center justify-between gap-3 border-l-4 border-primary-light pl-3"
          >
            <Link
              href={`/admin/pastorals?pastoralId=${pastoral.id}`}
              className="font-semibold text-primary"
            >
              {pastoral.name}
            </Link>
            <Popover
              trigger={
                <IconButton aria-label={`Renomear ${pastoral.name}`}>
                  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" fill="none">
                    <path
                      d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </IconButton>
              }
            >
              <form action={renamePastoral} className="flex w-64 flex-col gap-3">
                <input type="hidden" name="id" value={pastoral.id} />
                <Input type="text" name="name" defaultValue={pastoral.name} required />
                <Button type="submit" variant="secondary">
                  Salvar
                </Button>
              </form>
            </Popover>
          </li>
        ))}
      </ul>
    </div>
  );
}
