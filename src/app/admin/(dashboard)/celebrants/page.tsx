import { and, eq, gte, isNotNull, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { celebrations, fixedSchedules } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatShortDate } from "@/lib/format";
import { WEEKDAY_LABELS, addDays, dateOnlyUTC, toISODate, todayInSaoPaulo } from "@/lib/schedules";

type Slot = { date: string; time: string; weekday: number; description: string };

async function getMonthMassSlots(): Promise<Slot[]> {
  const today = todayInSaoPaulo();
  const todayUTC = dateOnlyUTC(today.year, today.month, today.day);
  const firstOfMonth = dateOnlyUTC(today.year, today.month, 1);
  const daysInMonth = new Date(Date.UTC(today.year, today.month, 0)).getUTCDate();
  const lastOfMonth = addDays(firstOfMonth, daysInMonth - 1);
  // Só hoje em diante — domingo que já passou não é editável aqui.
  const rangeStart = todayUTC > firstOfMonth ? todayUTC : firstOfMonth;
  const daysFromStart = Math.round((lastOfMonth.getTime() - rangeStart.getTime()) / 86_400_000) + 1;
  const monthDates = Array.from({ length: Math.max(daysFromStart, 0) }, (_, i) => addDays(rangeStart, i));

  const massSchedules = await db
    .select()
    .from(fixedSchedules)
    .where(and(eq(fixedSchedules.type, "mass"), eq(fixedSchedules.active, true)));

  const slots: Slot[] = [];
  for (const date of monthDates) {
    const weekday = date.getUTCDay();
    for (const schedule of massSchedules) {
      if (schedule.weekday === weekday) {
        slots.push({
          date: toISODate(date),
          time: schedule.time,
          weekday,
          description: schedule.description,
        });
      }
    }
  }
  return slots;
}

async function saveCelebrants(formData: FormData) {
  "use server";
  await requireAdmin();

  const slotsRaw = formData.get("slots");
  if (typeof slotsRaw !== "string") return;
  const slots: { date: string; time: string }[] = JSON.parse(slotsRaw);

  for (const slot of slots) {
    const celebrant = (formData.get(`celebrant-${slot.date}`) as string | null)?.trim() || null;
    const canceled = formData.get(`canceled-${slot.date}`) === "on";

    if (!celebrant && !canceled) {
      await db
        .delete(celebrations)
        .where(
          and(
            eq(celebrations.date, slot.date),
            eq(celebrations.time, slot.time),
            eq(celebrations.type, "mass"),
          ),
        );
      continue;
    }

    await db
      .insert(celebrations)
      .values({ date: slot.date, time: slot.time, type: "mass", celebrant, canceled })
      .onConflictDoUpdate({
        target: [celebrations.date, celebrations.time, celebrations.type],
        set: { celebrant, canceled },
      });
  }

  revalidatePath("/admin/celebrants");
  revalidatePath("/");
  redirect("/admin/celebrants?saved=1");
}

export default async function CelebrantsPage({
  searchParams,
}: PageProps<"/admin/celebrants">) {
  const { saved } = await searchParams;

  const [slots, existingRows, celebrantNames] = await Promise.all([
    getMonthMassSlots(),
    (async () => {
      const today = todayInSaoPaulo();
      const firstOfMonth = dateOnlyUTC(today.year, today.month, 1);
      const daysInMonth = new Date(Date.UTC(today.year, today.month, 0)).getUTCDate();
      const lastOfMonth = addDays(firstOfMonth, daysInMonth - 1);
      return db
        .select()
        .from(celebrations)
        .where(
          and(
            eq(celebrations.type, "mass"),
            gte(celebrations.date, toISODate(firstOfMonth)),
            lte(celebrations.date, toISODate(lastOfMonth)),
          ),
        );
    })(),
    db
      .selectDistinct({ celebrant: celebrations.celebrant })
      .from(celebrations)
      .where(isNotNull(celebrations.celebrant)),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold text-primary">Celebrantes do mês</h1>

      {saved && (
        <p className="mt-3 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-body font-semibold text-success">
          Salvo com sucesso!
        </p>
      )}

      {slots.length === 0 ? (
        <p className="mt-4 text-base text-foreground/60">Nenhuma missa fixa cadastrada.</p>
      ) : (
        <form action={saveCelebrants} className="mt-4">
          <input type="hidden" name="slots" value={JSON.stringify(slots.map(({ date, time }) => ({ date, time })))} />
          <datalist id="celebrants-list">
            {celebrantNames.map(
              (row) => row.celebrant && <option key={row.celebrant} value={row.celebrant} />,
            )}
          </datalist>

          <div className="flex flex-col gap-3">
            {slots.map((slot) => {
              const existing = existingRows.find((e) => e.date === slot.date && e.time === slot.time);
              return (
                <div key={slot.date} className="border-l-4 border-primary-light pl-3">
                  <p className="font-semibold text-primary">
                    {WEEKDAY_LABELS[slot.weekday]}, {formatShortDate(slot.date)} — {slot.description}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      name={`celebrant-${slot.date}`}
                      list="celebrants-list"
                      placeholder="Nome do celebrante"
                      aria-label={`Nome do celebrante em ${WEEKDAY_LABELS[slot.weekday]}, ${formatShortDate(slot.date)}`}
                      defaultValue={existing?.celebrant ?? ""}
                      className="field flex-1"
                    />
                    <label className="flex min-h-11 items-center gap-2 text-base">
                      <input
                        type="checkbox"
                        name={`canceled-${slot.date}`}
                        defaultChecked={existing?.canceled ?? false}
                        className="h-5 w-5"
                      />
                      Cancelada
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-0 -mx-4 mt-6 border-t border-border bg-background px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
            <button
              type="submit"
              className="btn btn-confirm w-full px-4 py-3 text-lg sm:w-auto"
            >
              Salvar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
