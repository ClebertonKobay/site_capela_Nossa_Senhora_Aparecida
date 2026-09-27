"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { AbsenceStepper } from "@/components/AbsenceStepper";
import { PencilIcon, SearchIcon } from "@/components/icons";
import { Badge, Button, DataTable, IconButton, Input, Popover } from "@/components/ui";
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
  header,
}: {
  rows: CatechumenRow[];
  mode: "manage" | "absences";
  searchable?: boolean;
  showClassColumn?: boolean;
  /** Topo da folha — a página da catequese passa o cabeçalho da turma. */
  header?: ReactNode;
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
          <span className="inline-flex flex-wrap items-center gap-2">
            <span className={row.original.active ? "font-semibold text-primary" : "text-foreground/60"}>
              {row.original.name}
            </span>
            {!row.original.active && <Badge tone="muted">Inativo</Badge>}
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
            <form action={updateCatechumen} className="flex w-full flex-col gap-3">
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
            <Button type="submit" variant={row.original.active ? "ghost-danger" : "ghost"}>
              {row.original.active ? "Desativar" : "Reativar"}
            </Button>
          </form>
        </div>
      ),
    });

    return base;
  }, [mode, showClassColumn]);

  const search = searchable ? (
    <div className="relative sm:max-w-sm">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-[1.125rem] w-[1.125rem] -translate-y-1/2 text-primary-light" />
      <input
        type="search"
        aria-label="Buscar catequizando por nome"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar pelo nome"
        className="field pl-10"
      />
    </div>
  ) : null;

  return (
    <DataTable
      columns={columns}
      data={filteredRows}
      header={header || search ? (
        <div className="flex flex-col gap-4">
          {header}
          {search}
        </div>
      ) : undefined}
      emptyMessage={
        query ? `Nenhum catequizando com "${query.trim()}".` : "Nenhum catequizando nesta turma ainda."
      }
      countLabel={(n) => (n === 1 ? "1 catequizando" : `${n} catequizandos`)}
    />
  );
}
