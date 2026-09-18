"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { Button, DataTable, IconButton, Input, Popover } from "@/components/ui";
import { formatPhone } from "@/lib/phone";
import {
  toggleMemberActive,
  updatePastoralMember,
} from "@/app/admin/(dashboard)/pastorals/actions";

export type PastoralMemberRow = {
  id: number;
  name: string;
  phone: string | null;
  notes: string | null;
  active: boolean;
};

export function PastoralMembersTable({
  rows,
  pastoralId,
}: {
  rows: PastoralMemberRow[];
  pastoralId: number;
}) {
  const columns = useMemo<ColumnDef<PastoralMemberRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nome",
        enableSorting: true,
        cell: ({ row }) => (
          <span className={row.original.active ? "text-foreground" : "text-foreground/60"}>
            {row.original.name}
            {!row.original.active && <span className="ml-1 text-caption">(inativo)</span>}
          </span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Telefone",
        cell: ({ row }) => (row.original.phone ? formatPhone(row.original.phone) : "—"),
      },
      {
        accessorKey: "notes",
        header: "Notas",
        cell: ({ row }) => row.original.notes ?? "—",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Popover
              trigger={
                <IconButton aria-label={`Editar ${row.original.name}`}>
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
              <form action={updatePastoralMember} className="flex w-64 flex-col gap-3">
                <input type="hidden" name="id" value={row.original.id} />
                <input type="hidden" name="pastoralId" value={pastoralId} />
                <Input
                  label="Nome"
                  type="text"
                  name="name"
                  defaultValue={row.original.name}
                  required
                />
                <Input
                  label="Telefone"
                  type="text"
                  name="phone"
                  defaultValue={row.original.phone ? formatPhone(row.original.phone) : ""}
                  placeholder="(42) 99999-8888"
                />
                <Input
                  label="Notas"
                  type="text"
                  name="notes"
                  defaultValue={row.original.notes ?? ""}
                />
                <Button type="submit" variant="secondary">
                  Salvar
                </Button>
              </form>
            </Popover>

            <form action={toggleMemberActive}>
              <input type="hidden" name="id" value={row.original.id} />
              <input type="hidden" name="pastoralId" value={pastoralId} />
              <input type="hidden" name="active" value={row.original.active ? "false" : "true"} />
              <Button type="submit" variant={row.original.active ? "cancel" : "secondary"}>
                {row.original.active ? "Desativar" : "Ativar"}
              </Button>
            </form>
          </div>
        ),
      },
    ],
    [pastoralId],
  );

  return <DataTable columns={columns} data={rows} />;
}
