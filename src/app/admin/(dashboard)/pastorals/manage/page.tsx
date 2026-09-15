import Link from "next/link";

import { db } from "@/db";
import { pastorals } from "@/db/schema";
import { requireRole } from "@/lib/auth";

import { createPastoral, renamePastoral } from "./actions";

export default async function PastoralsManagePage() {
  await requireRole(["admin"]);

  const allPastorals = await db
    .select()
    .from(pastorals)
    .orderBy(pastorals.name);

  return (
    <div>
      <h1 className="text-title text-primary">Pastorais</h1>

      <form action={createPastoral} className="mt-4 flex max-w-md flex-col gap-4">
        <div>
          <label htmlFor="name" className="text-body font-semibold text-foreground">
            Nova pastoral
          </label>
          <input id="name" type="text" name="name" required className="field mt-1" />
        </div>
        <button type="submit" className="btn btn-confirm">
          Criar pastoral
        </button>
      </form>

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
            <form action={renamePastoral} className="flex items-center gap-2">
              <input type="hidden" name="id" value={pastoral.id} />
              <input
                type="text"
                name="name"
                defaultValue={pastoral.name}
                required
                className="field"
              />
              <button type="submit" className="btn btn-secondary">
                Renomear
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
