import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { catechismClasses, catechumens } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { formatTime } from "@/lib/format";
import { WEEKDAY_LABELS } from "@/lib/schedules";
import { Tabs } from "@/components/ui";
import { CatechumensTable, type CatechumenRow } from "@/components/admin/CatechumensTable";

export default async function MyClassesPage() {
  const session = await requireRole(["admin", "catechesis_coordinator", "catechist"]);

  const classes =
    session.role === "catechist"
      ? await db
          .select()
          .from(catechismClasses)
          .where(eq(catechismClasses.catechistId, session.userId))
          .orderBy(catechismClasses.weekday, catechismClasses.time)
      : await db
          .select()
          .from(catechismClasses)
          .where(eq(catechismClasses.active, true))
          .orderBy(catechismClasses.weekday, catechismClasses.time);

  if (classes.length === 0) {
    return (
      <div>
        <h1 className="text-title text-primary">Minhas Turmas</h1>
        <p className="mt-4 text-body text-foreground/70">
          Nenhuma turma atribuída a você ainda — peça para o coordenador de catequese atribuir.
        </p>
      </div>
    );
  }

  const classIds = classes.map((c) => c.id);
  const allCatechumens = await db
    .select()
    .from(catechumens)
    .where(and(inArray(catechumens.classId, classIds), eq(catechumens.active, true)));

  const classNameById = new Map<number, string>();
  for (const turma of classes) {
    classNameById.set(turma.id, turma.name);
  }

  const rowsByClass = new Map<number, CatechumenRow[]>();
  const allRows: CatechumenRow[] = [];
  for (const catechumen of allCatechumens) {
    const row: CatechumenRow = {
      id: catechumen.id,
      name: catechumen.name,
      guardianName: catechumen.guardianName,
      guardianPhone: catechumen.guardianPhone,
      absencesCount: catechumen.absencesCount,
      active: catechumen.active,
      className: classNameById.get(catechumen.classId) ?? "—",
    };
    const list = rowsByClass.get(catechumen.classId) ?? [];
    list.push(row);
    rowsByClass.set(catechumen.classId, list);
    allRows.push(row);
  }

  const tabItems = [
    ...classes.map((turma) => ({
      value: `turma-${turma.id}`,
      label: turma.name,
      content: (
        <div className="flex flex-col gap-4">
          <p className="text-body text-foreground/70">
            {WEEKDAY_LABELS[turma.weekday]} às {formatTime(turma.time)}
          </p>
          <CatechumensTable rows={rowsByClass.get(turma.id) ?? []} mode="absences" />
        </div>
      ),
    })),
    {
      value: "todos",
      label: "Todos",
      content: <CatechumensTable rows={allRows} mode="absences" searchable showClassColumn />,
    },
  ];

  return (
    <div>
      <h1 className="text-title text-primary">Minhas Turmas</h1>

      <div className="mt-8">
        <Tabs ariaLabel="Turmas" items={tabItems} />
      </div>
    </div>
  );
}
