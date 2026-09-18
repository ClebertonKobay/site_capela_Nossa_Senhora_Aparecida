"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Button, DataTable } from "@/components/ui";

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
  { accessorKey: "name", header: "Nome", enableSorting: true },
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
      <form action={toggleUserActive}>
        <input type="hidden" name="id" value={row.original.id} />
        <Button type="submit" variant={row.original.active ? "cancel" : "secondary"}>
          {row.original.active ? "Desativar" : "Ativar"}
        </Button>
      </form>
    ),
  },
];

export function UsersTable({ rows }: { rows: Row[] }) {
  return <DataTable columns={columns} data={rows} />;
}
