const TIME_ZONE = "America/Sao_Paulo";

export function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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
