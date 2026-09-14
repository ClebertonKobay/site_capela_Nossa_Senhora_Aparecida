const TIME_ZONE = "America/Sao_Paulo";

// Cópia em minúsculas de WEEKDAY_LABELS (src/lib/schedules.ts) só para
// texto corrido ("terça, quinta e sábado") — não importamos schedules.ts
// aqui porque ele carrega o cliente do banco, e format.ts também é usado
// em componente client (BuyCards).
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

// Compacto, para tabelas: "13/09/2026 14:30"
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

// "2026-09-14" -> "14/09"
export function formatShortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${day}/${month}`;
}

// "10:00:00" -> "10h" | "19:30:00" -> "19h30"
export function formatTime(time: string): string {
  const [hour, minute] = time.split(":");
  return minute === "00" ? `${hour}h` : `${hour}h${minute}`;
}

// [2,4,6] -> "terça-feira, quinta-feira e sábado" (dedup, ordenado, sem
// repetir dia com múltiplos horários no mesmo dia).
export function formatWeekdayList(weekdays: number[]): string {
  const names = [...new Set(weekdays)].sort((a, b) => a - b).map((w) => WEEKDAY_NAMES_LOWER[w]);
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return names.join(" e ");
  return `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
}

// "10,00" ou "10.00" -> 1000 (centavos). null se vazio/inválido.
export function parseCurrencyToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const value = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

// Brasil não observa horário de verão desde 2019 — São Paulo é sempre
// UTC-3, fixo. Isso permite tratar <input type="datetime-local"> (que
// não carrega fuso) como horário de São Paulo de forma segura, sem
// depender do fuso do servidor (Vercel roda em UTC).
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
