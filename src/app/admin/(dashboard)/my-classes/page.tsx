import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { catechismAttendance, catechismClasses, catechumens } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { formatTime } from "@/lib/format";
import { WEEKDAY_LABELS } from "@/lib/schedules";

import { saveAttendance } from "./attendance-actions";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export default async function MyClassesPage({
  searchParams,
}: PageProps<"/admin/my-classes">) {
  const session = await requireRole(["admin", "catechesis_coordinator", "catechist"]);

  const { date: rawDate } = await searchParams;
  const dateValue = Array.isArray(rawDate) ? rawDate[0] : rawDate;
  const date =
    dateValue && DATE_REGEX.test(dateValue) ? dateValue : new Date().toISOString().slice(0, 10);

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

  const [allCatechumens, allAttendance] = await Promise.all([
    db
      .select()
      .from(catechumens)
      .where(and(inArray(catechumens.classId, classIds), eq(catechumens.active, true))),
    db
      .select()
      .from(catechismAttendance)
      .where(and(inArray(catechismAttendance.classId, classIds), eq(catechismAttendance.date, date))),
  ]);

  return (
    <div>
      <h1 className="text-title text-primary">Minhas Turmas</h1>

      <form method="get" className="mt-4 flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor="date" className="text-body font-semibold text-foreground">
            Data
          </label>
          <input id="date" type="date" name="date" defaultValue={date} className="field mt-1" />
        </div>
        <button type="submit" className="btn btn-secondary">
          Ver
        </button>
      </form>

      <div className="mt-8 flex flex-col gap-8">
        {classes.map((turma) => {
          const classCatechumens = allCatechumens.filter((c) => c.classId === turma.id);
          const attendanceOfClass = allAttendance.filter((a) => a.classId === turma.id);

          return (
            <section key={turma.id} className="border-l-4 border-primary-light pl-3">
              <h2 className="text-subtitle text-primary">{turma.name}</h2>
              <p className="text-body text-foreground/70">
                {WEEKDAY_LABELS[turma.weekday]} às {formatTime(turma.time)}
              </p>

              {classCatechumens.length === 0 ? (
                <p className="mt-2 text-body text-foreground/70">
                  Nenhum catequizando cadastrado nesta turma.
                </p>
              ) : (
                <form action={saveAttendance} className="mt-4 flex flex-col gap-2">
                  <input type="hidden" name="classId" value={turma.id} />
                  <input type="hidden" name="date" value={date} />
                  <input
                    type="hidden"
                    name="catechumenIds"
                    value={JSON.stringify(classCatechumens.map((c) => c.id))}
                  />

                  {classCatechumens.map((catechumen) => {
                    const existing = attendanceOfClass.find((a) => a.catechumenId === catechumen.id);
                    return (
                      <label
                        key={catechumen.id}
                        className="flex min-h-11 items-center gap-2 text-body"
                      >
                        <input
                          type="checkbox"
                          name={`present-${catechumen.id}`}
                          defaultChecked={existing?.present ?? false}
                          className="h-5 w-5"
                        />
                        {catechumen.name}
                      </label>
                    );
                  })}

                  <button type="submit" className="btn btn-confirm mt-2 self-start">
                    Salvar presença
                  </button>
                </form>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
