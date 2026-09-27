"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { PencilIcon } from "@/components/icons";
import { Badge, Button, DataTable, IconButton, Input, Popover } from "@/components/ui";
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
          <span className="inline-flex flex-wrap items-center gap-2">
            <span className={row.original.active ? "font-semibold text-primary" : "text-foreground/60"}>
              {row.original.name}
            </span>
            {!row.original.active && <Badge tone="muted">Inativo</Badge>}
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
          <div className="flex items-center justify-end gap-1">
            <Popover
              title={`Editar ${row.original.name}`}
              align="end"
              trigger={
                <IconButton aria-label={`Editar ${row.original.name}`} title="Editar">
                  <PencilIcon />
                </IconButton>
              }
            >
              <form action={updatePastoralMember} className="flex w-full flex-col gap-3">
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
              <Button type="submit" variant={row.original.active ? "ghost-danger" : "ghost"}>
                {row.original.active ? "Desativar" : "Reativar"}
              </Button>
            </form>
          </div>
        ),
      },
    ],
    [pastoralId],
  );

  return (
    <DataTable
      columns={columns}
      data={rows}
      emptyMessage="Nenhum membro cadastrado ainda."
      countLabel={(n) => (n === 1 ? "1 membro" : `${n} membros`)}
    />
  );
}
