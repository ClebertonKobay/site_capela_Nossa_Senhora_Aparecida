import { eq } from "drizzle-orm";

import { db } from "@/db";
import { catechismClasses, catechumens, classCatechists, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { Badge, Button, Checkbox, Input, PageHeader, Panel, Popover, Tabs } from "@/components/ui";
import { PersonIcon, PlusIcon } from "@/components/icons";
import { CatechumensTable, type CatechumenRow } from "@/components/admin/CatechumensTable";
import { ClassTimeBlock } from "@/components/admin/ClassTimeBlock";

import { createClass, setClassCatechists, toggleClassActive } from "./classes-actions";
import { createCatechumen } from "./catechumens-actions";
import { WeekdaySelect } from "./WeekdaySelect";

type CatechismClass = typeof catechismClasses.$inferSelect;
type Catechist = { id: number; name: string; active: boolean };

// "Ana", "Ana e Bruno", "Ana, Bruno e Carla"
const listFormat = new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" });

export default async function CatechesisPage() {
  await requireRole(["admin", "catechesis_coordinator"]);

  const [classes, catechists, allCatechumens, assignments] = await Promise.all([
    db.select().from(catechismClasses).orderBy(catechismClasses.weekday, catechismClasses.time),
    db
      .select({ id: users.id, name: users.name, active: users.active })
      .from(users)
      .where(eq(users.role, "catechist"))
      .orderBy(users.name),
    db.select().from(catechumens).orderBy(catechumens.name),
    db.select().from(classCatechists),
  ]);

  const catechistIdsByClass = new Map<number, Set<number>>();
  for (const { classId, catechistId } of assignments) {
    const ids = catechistIdsByClass.get(classId) ?? new Set<number>();
    ids.add(catechistId);
    catechistIdsByClass.set(classId, ids);
  }

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
      <PageHeader
        title="Catequese"
        description="Turmas, catequistas e catequizandos."
        actions={
          <Popover
            title="Nova turma"
            align="end"
            trigger={
              <button type="button" className="btn btn-confirm">
                <PlusIcon />
                Nova turma
              </button>
            }
          >
            <form action={createClass} className="flex w-full flex-col gap-4">
              <Input id="name" type="text" name="name" required label="Nome" />
              <WeekdaySelect />
              <Input id="time" type="time" name="time" required label="Horário" />
              <Button type="submit">Criar turma</Button>
            </form>
          </Popover>
        }
      />

      {classes.length === 0 ? (
        <Panel>
          <p className="px-4 py-10 text-center text-body text-foreground/70 sm:px-5">
            Nenhuma turma cadastrada ainda. Use “Nova turma” para criar a primeira.
          </p>
        </Panel>
      ) : (
        <Tabs
          ariaLabel="Turmas"
          items={[
            ...classes.map((turma) => {
              const rows = rowsByClass.get(turma.id) ?? [];
              return {
                value: `turma-${turma.id}`,
                label: turma.name,
                count: rows.length,
                dimmed: !turma.active,
                content: (
                  <CatechumensTable
                    rows={rows}
                    mode="manage"
                    header={
                      <ClassHeader
                        turma={turma}
                        catechists={catechists}
                        assignedIds={catechistIdsByClass.get(turma.id) ?? new Set()}
                      />
                    }
                  />
                ),
              };
            }),
            {
              value: "todos",
              label: "Todos",
              count: allRows.length,
              content: <CatechumensTable rows={allRows} mode="manage" searchable showClassColumn />,
            },
          ]}
        />
      )}
    </div>
  );
}

function ClassHeader({
  turma,
  catechists,
  assignedIds,
}: {
  turma: CatechismClass;
  catechists: Catechist[];
  assignedIds: Set<number>;
}) {
  const assigned = catechists.filter((c) => assignedIds.has(c.id));
  // Na lista para marcar: os ativos + quem já está na turma (mesmo desativado,
  // para dar para desmarcar).
  const options = catechists.filter((c) => c.active || assignedIds.has(c.id));

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <ClassTimeBlock weekday={turma.weekday} time={turma.time} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-subtitle text-primary">{turma.name}</h2>
            {!turma.active && <Badge tone="muted">Turma inativa</Badge>}
          </div>
          <p className="mt-0.5 flex items-start gap-1.5 text-body text-foreground/70">
            <PersonIcon className="mt-1 h-4 w-4 shrink-0 text-primary-light" />
            {assigned.length > 0 ? (
              <span>
                {assigned.length === 1 ? "Catequista" : "Catequistas"}:{" "}
                {listFormat.format(assigned.map((c) => c.name))}
              </span>
            ) : (
              <span className="text-accent-dark">Sem catequista definido</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Popover
          title={`Novo catequizando — ${turma.name}`}
          align="end"
          trigger={
            <button type="button" className="btn btn-confirm flex-1 sm:flex-none">
              <PlusIcon />
              Catequizando
            </button>
          }
        >
          <form action={createCatechumen} className="flex w-full flex-col gap-3">
            <input type="hidden" name="classId" value={turma.id} />
            <Input id={`catechumen-name-${turma.id}`} type="text" name="name" required label="Nome" />
            <Input id={`guardian-name-${turma.id}`} type="text" name="guardianName" label="Responsável" />
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

        <Popover
          title={`Catequistas — ${turma.name}`}
          align="end"
          trigger={
            <button type="button" className="btn btn-secondary flex-1 sm:flex-none">
              <PersonIcon />
              Catequistas
              {assigned.length > 0 && (
                <span className="min-w-6 rounded-full bg-primary/10 px-1.5 text-center text-caption font-semibold text-primary">
                  {assigned.length}
                </span>
              )}
            </button>
          }
        >
          {options.length === 0 ? (
            <p className="text-body text-foreground/70">
              Nenhuma conta de catequista ainda. Peça ao administrador para criar em Usuários, com o papel
              Catequista.
            </p>
          ) : (
            <form action={setClassCatechists} className="flex w-full flex-col gap-3">
              <input type="hidden" name="classId" value={turma.id} />
              <p className="text-body text-foreground/70">Marque quem dá aula nesta turma.</p>
              <div className="max-h-64 divide-y divide-border overflow-y-auto rounded-xl border border-border">
                {options.map((catechist) => (
                  <Checkbox
                    key={catechist.id}
                    name="catechistIds"
                    value={String(catechist.id)}
                    defaultChecked={assignedIds.has(catechist.id)}
                    label={catechist.active ? catechist.name : `${catechist.name} (conta desativada)`}
                    labelClassName="cursor-pointer gap-3 px-3 hover:bg-background"
                  />
                ))}
              </div>
              <Button type="submit">Salvar catequistas</Button>
            </form>
          )}
        </Popover>

        <form action={toggleClassActive}>
          <input type="hidden" name="id" value={turma.id} />
          <input type="hidden" name="active" value={turma.active ? "false" : "true"} />
          <Button type="submit" variant={turma.active ? "ghost-danger" : "ghost"}>
            {turma.active ? "Desativar turma" : "Reativar turma"}
          </Button>
        </form>
      </div>
    </div>
  );
}
