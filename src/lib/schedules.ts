import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "@/db";
import { celebrations, fixedSchedules } from "@/db/schema";

const TIME_ZONE = "America/Sao_Paulo";

export const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

export const ACTIVITY_TYPE_LABELS = {
  mass: "Missa",
  rosary: "Terço",
  novena: "Novena",
  prayer_group: "Grupo de Oração",
  catechism: "Catequese",
} as const;

export type ScheduleOccurrence = {
  date: string; // YYYY-MM-DD
  weekday: number;
  time: string; // HH:MM:SS
  description: string;
  type: keyof typeof ACTIVITY_TYPE_LABELS;
  celebrant: string | null;
  note: string | null;
};

// --- Utilidades de data, sempre ancoradas no calendário de São Paulo ---

export function todayInSaoPaulo(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

function nowInSaoPaulo(): { hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return { hour: get("hour"), minute: get("minute") };
}

// Data "sem hora", ancorada em UTC meia-noite — evita que o fuso do
// servidor (Vercel roda em UTC) interfira na aritmética de dias.
export function dateOnlyUTC(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// --- Mesclagem: grade fixa + exceções de uma data específica ---

function mergeDay(
  dateISO: string,
  weekday: number,
  fixed: (typeof fixedSchedules.$inferSelect)[],
  exceptionsOfDay: (typeof celebrations.$inferSelect)[],
): ScheduleOccurrence[] {
  const fixedOfDay = fixed.filter((s) => s.weekday === weekday);
  const fixedTimes = new Set(fixedOfDay.map((s) => s.time));

  const fromFixed = fixedOfDay.map((s) => {
    const override = exceptionsOfDay.find((e) => e.time === s.time);
    return {
      date: dateISO,
      weekday,
      time: s.time,
      description: s.description,
      type: s.type,
      celebrant: override?.celebrant ?? null,
      note: override?.note ?? null,
      canceled: override?.canceled ?? false,
    };
  });

  // Exceções sem horário fixo correspondente são celebrações extras do dia.
  const extra = exceptionsOfDay
    .filter((e) => !fixedTimes.has(e.time))
    .map((e) => ({
      date: dateISO,
      weekday,
      time: e.time,
      description: ACTIVITY_TYPE_LABELS[e.type],
      type: e.type,
      celebrant: e.celebrant,
      note: e.note,
      canceled: e.canceled,
    }));

  return [...fromFixed, ...extra]
    .filter((item) => !item.canceled)
    .map(({ canceled: _canceled, ...rest }) => rest)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export type DaySchedule = {
  date: string;
  weekday: number;
  items: ScheduleOccurrence[];
};

// Grade da semana (domingo a sábado) que contém hoje, já mesclada.
export async function getWeekSchedule(): Promise<DaySchedule[]> {
  const today = todayInSaoPaulo();
  const todayUTC = dateOnlyUTC(today.year, today.month, today.day);
  const weekStart = addDays(todayUTC, -todayUTC.getUTCDay());
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const weekStartISO = toISODate(weekDates[0]);
  const weekEndISO = toISODate(weekDates[6]);

  const [fixed, exceptions] = await Promise.all([
    db.select().from(fixedSchedules).where(eq(fixedSchedules.active, true)),
    db
      .select()
      .from(celebrations)
      .where(and(gte(celebrations.date, weekStartISO), lte(celebrations.date, weekEndISO))),
  ]);

  return weekDates.map((date) => {
    const dateISO = toISODate(date);
    const weekday = date.getUTCDay();
    return {
      date: dateISO,
      weekday,
      items: mergeDay(
        dateISO,
        weekday,
        fixed,
        exceptions.filter((e) => e.date === dateISO),
      ),
    };
  });
}

// Próxima missa a partir de agora, olhando os próximos `withinDays` dias.
export async function getNextMass(withinDays = 14): Promise<ScheduleOccurrence | null> {
  const today = todayInSaoPaulo();
  const todayUTC = dateOnlyUTC(today.year, today.month, today.day);
  const startISO = toISODate(todayUTC);
  const endISO = toISODate(addDays(todayUTC, withinDays));

  const [fixed, exceptions] = await Promise.all([
    db.select().from(fixedSchedules).where(eq(fixedSchedules.active, true)),
    db
      .select()
      .from(celebrations)
      .where(and(gte(celebrations.date, startISO), lte(celebrations.date, endISO))),
  ]);

  const { hour, minute } = nowInSaoPaulo();
  const nowTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  for (let i = 0; i <= withinDays; i++) {
    const date = addDays(todayUTC, i);
    const dateISO = toISODate(date);
    const weekday = date.getUTCDay();
    const dayItems = mergeDay(
      dateISO,
      weekday,
      fixed,
      exceptions.filter((e) => e.date === dateISO),
    ).filter((item) => item.type === "mass");

    const next = dayItems.find((item) => i > 0 || item.time.slice(0, 5) >= nowTime);
    if (next) return next;
  }

  return null;
}
