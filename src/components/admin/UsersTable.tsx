"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge, Button, DataTable } from "@/components/ui";

import { toggleUserActive } from "@/app/admin/(dashboard)/users/actions";

type Row = { id: number; username: string; name: string; role: string; active: boolean };

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  chapel_coordinator: "Coordenador de Capela",
  pastoral_coordinator: "Coordenador de Pastoral",
  catechesis_coordinator: "Coordenador de Catequese",
  catechist: "Catequista",
};

const columns: ColumnDef<Row>[] = [
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
  { accessorKey: "username", header: "Usuário" },
  {
    accessorKey: "role",
    header: "Papel",
    cell: (info) => ROLE_LABELS[info.getValue<string>()] ?? info.getValue<string>(),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <form action={toggleUserActive} className="flex justify-end">
        <input type="hidden" name="id" value={row.original.id} />
        <Button type="submit" variant={row.original.active ? "ghost-danger" : "ghost"}>
          {row.original.active ? "Desativar" : "Reativar"}
        </Button>
      </form>
    ),
  },
];

export function UsersTable({ rows }: { rows: Row[] }) {
  return (
    <DataTable
      columns={columns}
      data={rows}
      countLabel={(n) => (n === 1 ? "1 usuário" : `${n} usuários`)}
    />
  );
}
