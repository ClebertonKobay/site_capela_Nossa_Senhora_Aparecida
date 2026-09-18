"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { AbsenceStepper } from "@/components/AbsenceStepper";
import { Button, DataTable, IconButton, Input, Popover } from "@/components/ui";
import { formatPhone } from "@/lib/phone";
import {
  toggleCatechumenActive,
  updateCatechumen,
} from "@/app/admin/(dashboard)/catechesis/catechumens-actions";

export type CatechumenRow = {
  id: number;
  name: string;
  guardianName: string | null;
  guardianPhone: string | null;
  absencesCount: number;
  active: boolean;
  className: string;
};

export function CatechumensTable({
  rows,
  mode,
  searchable = false,
  showClassColumn = false,
}: {
  rows: CatechumenRow[];
  mode: "manage" | "absences";
  searchable?: boolean;
  showClassColumn?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(term));
  }, [rows, query]);

  const columns = useMemo<ColumnDef<CatechumenRow>[]>(() => {
    const base: ColumnDef<CatechumenRow>[] = [
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
        accessorKey: "guardianName",
        header: "Responsável",
        cell: ({ row }) => row.original.guardianName ?? "—",
      },
      {
        accessorKey: "guardianPhone",
        header: "Celular",
        cell: ({ row }) =>
          row.original.guardianPhone ? formatPhone(row.original.guardianPhone) : "—",
      },
    ];

    if (showClassColumn) {
      base.push({ accessorKey: "className", header: "Turma", enableSorting: true });
    }

    if (mode === "absences") {
      base.push({
        id: "absences",
        header: "Faltas",
        cell: ({ row }) => (
          <AbsenceStepper
            catechumenId={row.original.id}
            initialCount={row.original.absencesCount}
          />
        ),
      });
      return base;
    }

    base.push({
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
            <form action={updateCatechumen} className="flex w-64 flex-col gap-3">
              <input type="hidden" name="id" value={row.original.id} />
              <Input label="Nome" type="text" name="name" defaultValue={row.original.name} required />
              <Input
                label="Responsável"
                type="text"
                name="guardianName"
                defaultValue={row.original.guardianName ?? ""}
              />
              <Input
                label="Telefone do responsável"
                type="text"
                name="guardianPhone"
                defaultValue={
                  row.original.guardianPhone ? formatPhone(row.original.guardianPhone) : ""
                }
                placeholder="(42) 99999-8888"
              />
              <Button type="submit" variant="secondary">
                Salvar
              </Button>
            </form>
          </Popover>

          <form action={toggleCatechumenActive}>
            <input type="hidden" name="id" value={row.original.id} />
            <input type="hidden" name="active" value={row.original.active ? "false" : "true"} />
            <Button type="submit" variant={row.original.active ? "cancel" : "secondary"}>
              {row.original.active ? "Desativar" : "Ativar"}
            </Button>
          </form>
        </div>
      ),
    });

    return base;
  }, [mode, showClassColumn]);

  return (
    <div>
      {searchable && (
        <div className="mb-3 max-w-xs">
          <Input
            type="search"
            label="Buscar por nome"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite o nome"
          />
        </div>
      )}
      <DataTable columns={columns} data={filteredRows} />
    </div>
  );
}
