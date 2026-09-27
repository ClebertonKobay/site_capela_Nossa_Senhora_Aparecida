import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { catechismClasses, catechumens, classCatechists } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { PageHeader, Tabs } from "@/components/ui";
import { ClassTimeBlock } from "@/components/admin/ClassTimeBlock";
import { CatechumensTable, type CatechumenRow } from "@/components/admin/CatechumensTable";

export default async function MyClassesPage() {
  const session = await requireRole(["admin", "catechesis_coordinator", "catechist"]);

  const classes =
    session.role === "catechist"
      ? await db
          .select({
            id: catechismClasses.id,
            name: catechismClasses.name,
            weekday: catechismClasses.weekday,
            time: catechismClasses.time,
            active: catechismClasses.active,
          })
          .from(catechismClasses)
          .innerJoin(classCatechists, eq(classCatechists.classId, catechismClasses.id))
          .where(eq(classCatechists.catechistId, session.userId))
          .orderBy(catechismClasses.weekday, catechismClasses.time)
      : await db
          .select()
          .from(catechismClasses)
          .where(eq(catechismClasses.active, true))
          .orderBy(catechismClasses.weekday, catechismClasses.time);

  if (classes.length === 0) {
    return (
      <div>
        <PageHeader title="Minhas Turmas" />
        <p className="text-body text-foreground/70">
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
    ...classes.map((turma) => {
      const rows = rowsByClass.get(turma.id) ?? [];
      return {
        value: `turma-${turma.id}`,
        label: turma.name,
        count: rows.length,
        content: (
          <CatechumensTable
            rows={rows}
            mode="absences"
            header={
              <div className="flex items-center gap-4">
                <ClassTimeBlock weekday={turma.weekday} time={turma.time} />
                <h2 className="min-w-0 text-subtitle text-primary">{turma.name}</h2>
              </div>
            }
          />
        ),
      };
    }),
    {
      value: "todos",
      label: "Todos",
      count: allRows.length,
      content: <CatechumensTable rows={allRows} mode="absences" searchable showClassColumn />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Minhas Turmas"
        description="Toque em + ou − para marcar as faltas. Salva sozinho."
      />
      <Tabs ariaLabel="Turmas" items={tabItems} />
    </div>
  );
}
