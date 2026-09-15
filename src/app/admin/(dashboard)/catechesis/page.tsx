import { eq } from "drizzle-orm";

import { db } from "@/db";
import { catechismClasses, catechumens, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { formatTime } from "@/lib/format";
import { formatPhone } from "@/lib/phone";
import { WEEKDAY_LABELS } from "@/lib/schedules";

import { assignCatechist, createClass, toggleClassActive } from "./classes-actions";
import { createCatechumen } from "./catechumens-actions";

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
                <input type="hidden" name="classId" value={turma.id} />
                <select
                  name="catechistId"
                  className="field"
                  defaultValue={turma.catechistId ?? ""}
                  aria-label={`Catequista de ${turma.name}`}
                >
                  <option value="">— sem catequista —</option>
                  {catechists.map((catechist) => (
                    <option key={catechist.id} value={catechist.id}>
                      {catechist.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-secondary">
                  Atribuir
                </button>
              </form>

              <form action={toggleClassActive}>
                <input type="hidden" name="id" value={turma.id} />
                <input type="hidden" name="active" value={turma.active ? "false" : "true"} />
                <button
                  type="submit"
                  className={`btn ${turma.active ? "btn-delete" : "btn-secondary"}`}
                >
                  {turma.active ? "Desativar" : "Ativar"}
                </button>
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
                  <label
                    htmlFor={`catechumen-name-${turma.id}`}
                    className="text-caption font-semibold text-foreground"
                  >
                    Nome
                  </label>
                  <input
                    id={`catechumen-name-${turma.id}`}
                    type="text"
                    name="name"
                    required
                    className="field mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`guardian-name-${turma.id}`}
                    className="text-caption font-semibold text-foreground"
                  >
                    Responsável
                  </label>
                  <input
                    id={`guardian-name-${turma.id}`}
                    type="text"
                    name="guardianName"
                    className="field mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`guardian-phone-${turma.id}`}
                    className="text-caption font-semibold text-foreground"
                  >
                    Telefone do responsável
                  </label>
                  <input
                    id={`guardian-phone-${turma.id}`}
                    type="text"
                    name="guardianPhone"
                    placeholder="(42) 99999-8888"
                    className="field mt-1"
                  />
                </div>
                <button type="submit" className="btn btn-confirm">
                  Adicionar
                </button>
              </form>
            </li>
          );
        })}
      </ul>

      <form action={createClass} className="mt-8 flex max-w-md flex-col gap-4">
        <h2 className="text-subtitle text-primary">Nova turma</h2>
        <div>
          <label htmlFor="name" className="text-body font-semibold text-foreground">
            Nome
          </label>
          <input id="name" type="text" name="name" required className="field mt-1" />
        </div>
        <div>
          <label htmlFor="weekday" className="text-body font-semibold text-foreground">
            Dia da semana
          </label>
          <select id="weekday" name="weekday" required className="field mt-1">
            {WEEKDAY_LABELS.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="time" className="text-body font-semibold text-foreground">
            Horário
          </label>
          <input id="time" type="time" name="time" required className="field mt-1" />
        </div>
        <button type="submit" className="btn btn-confirm">
          Criar turma
        </button>
      </form>
    </div>
  );
}
