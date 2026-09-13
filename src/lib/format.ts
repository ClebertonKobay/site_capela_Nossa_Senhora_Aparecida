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
