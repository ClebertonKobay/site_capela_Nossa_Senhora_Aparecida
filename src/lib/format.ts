const TIME_ZONE = "America/Sao_Paulo";

const WEEKDAY_NAMES_LOWER = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
] as const;

export function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatEventDateTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatShortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${day}/${month}`;
}

export function formatTime(time: string): string {
  const [hour, minute] = time.split(":");
  return minute === "00" ? `${hour}h` : `${hour}h${minute}`;
}

export function formatWeekdayList(weekdays: number[]): string {
  const names = [...new Set(weekdays)].sort((a, b) => a - b).map((w) => WEEKDAY_NAMES_LOWER[w]);
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return names.join(" e ");
  return `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
}

export function parseCurrencyToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const value = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

export function parseSaoPauloDateTime(value: string): Date {
  return new Date(`${value}:00-03:00`);
}

export function toSaoPauloDateTimeLocal(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
