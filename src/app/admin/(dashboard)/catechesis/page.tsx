import { eq } from "drizzle-orm";

import { db } from "@/db";
import { catechismClasses, catechumens, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { formatTime } from "@/lib/format";
import { formatPhone } from "@/lib/phone";
import { WEEKDAY_LABELS } from "@/lib/schedules";
import { Button, Input } from "@/components/ui";

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
    db.select().from(catechumens).where(eq(catechumens.active, true)),
  ]);

  const catechumensByClass = new Map<number, typeof allCatechumens>();
  for (const catechumen of allCatechumens) {
    const list = catechumensByClass.get(catechumen.classId) ?? [];
    list.push(catechumen);
    catechumensByClass.set(catechumen.classId, list);
  }

  return (
    <div>
      <h1 className="text-title text-primary">Catequese</h1>

      <ul className="mt-6 flex flex-col gap-6">
        {classes.length === 0 && (
          <p className="text-body text-foreground/70">Nenhuma turma cadastrada ainda.</p>
        )}
        {classes.map((turma) => {
          const turmaCatechumens = catechumensByClass.get(turma.id) ?? [];

          return (
            <li
              key={turma.id}
              className="flex flex-col gap-3 border-l-4 border-primary-light pl-3"
            >
              <div>
                <p className="text-body font-semibold text-foreground">
                  {turma.name}
                  {!turma.active && (
                    <span className="ml-2 text-caption text-foreground/60">(inativa)</span>
                  )}
                </p>
                <p className="text-body text-foreground/70">
                  {WEEKDAY_LABELS[turma.weekday]} às {formatTime(turma.time)}
                </p>
              </div>

              <form action={assignCatechist} className="flex flex-wrap items-center gap-2">
                <AssignCatechistSelect
                  classId={turma.id}
                  defaultCatechistId={turma.catechistId}
                  catechists={catechists}
                />
                <Button type="submit" variant="secondary">
                  Atribuir
                </Button>
              </form>

              <form action={toggleClassActive}>
                <input type="hidden" name="id" value={turma.id} />
                <input type="hidden" name="active" value={turma.active ? "false" : "true"} />
                <Button type="submit" variant={turma.active ? "cancel" : "secondary"}>
                  {turma.active ? "Desativar" : "Ativar"}
                </Button>
              </form>

              <div>
                <p className="text-body font-semibold text-foreground">Catequizandos</p>
                {turmaCatechumens.length === 0 ? (
                  <p className="text-body text-foreground/70">Nenhum catequizando ativo.</p>
                ) : (
                  <ul className="mt-1 flex flex-col gap-1">
                    {turmaCatechumens.map((catechumen) => (
                      <li key={catechumen.id} className="text-body text-foreground/70">
                        {catechumen.name}
                        {catechumen.guardianPhone && (
                          <> — {formatPhone(catechumen.guardianPhone)}</>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <form
                action={createCatechumen}
                className="flex flex-wrap items-end gap-2"
              >
                <input type="hidden" name="classId" value={turma.id} />
                <div>
                  <Input
                    id={`catechumen-name-${turma.id}`}
                    type="text"
                    name="name"
                    required
                    label="Nome"
                  />
                </div>
                <div>
                  <Input
                    id={`guardian-name-${turma.id}`}
                    type="text"
                    name="guardianName"
                    label="Responsável"
                  />
                </div>
                <div>
                  <Input
                    id={`guardian-phone-${turma.id}`}
                    type="text"
                    name="guardianPhone"
                    placeholder="(42) 99999-8888"
                    label="Telefone do responsável"
                  />
                </div>
                <Button type="submit">Adicionar</Button>
              </form>
            </li>
          );
        })}
      </ul>

      <form action={createClass} className="mt-8 flex max-w-md flex-col gap-4">
        <h2 className="text-subtitle text-primary">Nova turma</h2>
        <div>
          <Input id="name" type="text" name="name" required label="Nome" />
        </div>
        <div>
          <WeekdaySelect />
        </div>
        <div>
          <Input id="time" type="time" name="time" required label="Horário" />
        </div>
        <Button type="submit">Criar turma</Button>
      </form>
    </div>
  );
}
