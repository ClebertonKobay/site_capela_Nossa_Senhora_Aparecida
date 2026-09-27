"use client";

import type { ReactNode } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SortIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Panel } from "./Panel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";

const ACTIONS_COLUMN = "actions";

export function DataTable<TData, TValue>({
  columns,
  data,
  header,
  emptyMessage = "Nenhum registro encontrado.",
  countLabel = (n) => (n === 1 ? "1 registro" : `${n} registros`),
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Conteúdo no topo da folha (título da turma, busca etc.). */
  header?: ReactNode;
  emptyMessage?: string;
  countLabel?: (count: number) => string;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();

  const footer =
    data.length === 0 ? undefined : (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-caption text-foreground/70">{countLabel(data.length)}</span>
        {pageCount > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <span className="text-caption text-foreground/70">
              {table.getState().pagination.pageIndex + 1} de {pageCount}
            </span>
            <Button variant="ghost" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Próxima
            </Button>
          </div>
        )}
      </div>
    );

  return (
    <Panel header={header} footer={footer}>
      {rows.length === 0 ? (
        <p className="px-4 py-10 text-center text-body text-foreground/70 sm:px-5">{emptyMessage}</p>
      ) : (
        <>
          {/* Abaixo de sm a tabela vira lista dividida — rolar uma tabela na
              horizontal no celular (o uso mais comum aqui) é ruim de ler. */}
          <ul className="divide-y divide-border sm:hidden">
            {rows.map((row) => {
              const cells = row.getVisibleCells();
              const [primary, ...rest] = cells;
              const actionsCell = rest.find((cell) => cell.column.id === ACTIONS_COLUMN);
              const detailCells = rest.filter((cell) => {
                if (cell.column.id === ACTIONS_COLUMN) return false;
                const header = cell.column.columnDef.header;
                return typeof header === "string" && header !== "";
              });

              return (
                <li key={row.id} className="px-4 py-4">
                  <div className="text-body font-semibold text-primary">
                    {flexRender(primary.column.columnDef.cell, primary.getContext())}
                  </div>
                  {detailCells.length > 0 && (
                    <dl className="mt-2 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 text-body">
                      {detailCells.map((cell) => (
                        <div key={cell.id} className="contents">
                          <dt className="text-caption text-foreground/60">
                            {cell.column.columnDef.header as string}
                          </dt>
                          <dd className="min-w-0 justify-self-end text-right break-words">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {actionsCell && (
                    <div className="-mr-2 mt-2 flex justify-end">
                      {flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="hidden overflow-x-auto sm:block">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow header key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const sorted = header.column.getIsSorted();
                      const isActions = header.column.id === ACTIONS_COLUMN;
                      return (
                        <TableHead
                          key={header.id}
                          aria-sort={
                            sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
                          }
                          className={cn(isActions && "w-px")}
                        >
                          {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="-ml-2 inline-flex min-h-9 items-center gap-1 rounded-lg px-2 hover:bg-primary/5"
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <SortIcon direction={sorted} className="h-4 w-4" />
                            </button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(cell.column.id === ACTIONS_COLUMN && "w-px whitespace-nowrap")}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </Panel>
  );
}
