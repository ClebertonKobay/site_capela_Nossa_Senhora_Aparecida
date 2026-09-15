"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { formatPhone } from "@/lib/phone";

type Row = {
  id: number;
  name: string;
  phone: string;
  quantity: number;
  createdAt: Date;
  eventName: string;
};

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    enableSorting: true,
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: (info) => formatPhone(info.getValue<string>()),
  },
  {
    accessorKey: "quantity",
    header: "Qtd",
  },
  {
    accessorKey: "eventName",
    header: "Evento",
  },
  {
    accessorKey: "createdAt",
    header: "Data",
    enableSorting: true,
    cell: (info) => formatDateTime(info.getValue<Date>()),
  },
];

export function OrdersTable({ rows }: { rows: Row[] }) {
  return <DataTable columns={columns} data={rows} />;
}
