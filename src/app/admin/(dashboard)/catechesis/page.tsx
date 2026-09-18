import { eq } from "drizzle-orm";

import { db } from "@/db";
import { catechismClasses, catechumens, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { formatTime } from "@/lib/format";
import { WEEKDAY_LABELS } from "@/lib/schedules";
import { Button, IconButton, Input, Popover, Tabs } from "@/components/ui";
import { CatechumensTable, type CatechumenRow } from "@/components/admin/CatechumensTable";

import { assignCatechist, createClass, toggleClassActive } from "./classes-actions";
import { createCatechumen } from "./catechumens-actions";
import { WeekdaySelect } from "./WeekdaySelect";
import { AssignCatechistSelect } from "./AssignCatechistSelect";

export default async function CatechesisPage() {
  await requireRole(["admin", "catechesis_coordinator"]);

  const [classes, catechists, allCatechumens] = await Promise.all([
    db.select().from(catechismClasses).orderBy(catechismClasses.weekday, catechismClasses.time),
    db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.role, "catechist"))
      .orderBy(users.name),
    db.select().from(catechumens),
  ]);

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

  return (
    <div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-title text-primary">Catequese</h1>

        <Popover
          trigger={
            <button type="button" className="btn btn-confirm">
              <svg
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.75"
                fill="none"
                className="h-5 w-5"
              >
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Nova turma
            </button>
          }
        >
          <form action={createClass} className="flex w-64 flex-col gap-4">
            <Input id="name" type="text" name="name" required label="Nome" />
            <WeekdaySelect />
            <Input id="time" type="time" name="time" required label="Horário" />
            <Button type="submit">Criar turma</Button>
          </form>
        </Popover>
      </div>

      {classes.length === 0 ? (
        <p className="mt-6 text-body text-foreground/70">Nenhuma turma cadastrada ainda.</p>
      ) : (
        <Tabs
          className="mt-6"
          ariaLabel="Turmas"
          items={[
            ...classes.map((turma) => ({
              value: `turma-${turma.id}`,
              label: turma.active ? turma.name : `${turma.name} (inativa)`,
              content: (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-body text-foreground/70">
                      {WEEKDAY_LABELS[turma.weekday]} às {formatTime(turma.time)}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <Popover
                        trigger={
                          <IconButton aria-label={`Atribuir catequista à turma ${turma.name}`}>
                            <svg
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              fill="none"
                            >
                              <circle cx="12" cy="8" r="4" />
                              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
                            </svg>
                          </IconButton>
                        }
                      >
                        <form action={assignCatechist} className="flex w-64 flex-col gap-3">
                          <AssignCatechistSelect
                            classId={turma.id}
                            defaultCatechistId={turma.catechistId}
                            catechists={catechists}
                          />
                          <Button type="submit" variant="secondary">
                            Atribuir
                          </Button>
                        </form>
                      </Popover>

                      <form action={toggleClassActive}>
                        <input type="hidden" name="id" value={turma.id} />
                        <input
                          type="hidden"
                          name="active"
                          value={turma.active ? "false" : "true"}
                        />
                        <Button type="submit" variant={turma.active ? "cancel" : "secondary"}>
                          {turma.active ? "Desativar" : "Ativar"}
                        </Button>
                      </form>

                      <Popover
                        trigger={
                          <button type="button" className="btn btn-secondary">
                            <svg
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              fill="none"
                              className="h-5 w-5"
                            >
                              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                            </svg>
                            Catequizando
                          </button>
                        }
                      >
                        <form action={createCatechumen} className="flex w-64 flex-col gap-3">
                          <input type="hidden" name="classId" value={turma.id} />
                          <Input
                            id={`catechumen-name-${turma.id}`}
                            type="text"
                            name="name"
                            required
                            label="Nome"
                          />
                          <Input
                            id={`guardian-name-${turma.id}`}
                            type="text"
                            name="guardianName"
                            label="Responsável"
                          />
                          <Input
                            id={`guardian-phone-${turma.id}`}
                            type="text"
                            name="guardianPhone"
                            placeholder="(42) 99999-8888"
                            label="Telefone do responsável"
                          />
                          <Button type="submit">Adicionar</Button>
                        </form>
                      </Popover>
                    </div>
                  </div>

                  <CatechumensTable rows={rowsByClass.get(turma.id) ?? []} mode="manage" />
                </div>
              ),
            })),
            {
              value: "todos",
              label: "Todos",
              content: <CatechumensTable rows={allRows} mode="manage" searchable showClassColumn />,
            },
          ]}
        />
      )}
    </div>
  );
}
