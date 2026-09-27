import { formatTime } from "@/lib/format";
import { WEEKDAY_LABELS } from "@/lib/schedules";

// Folhinha com dia e horário da turma — é o que se procura primeiro. O texto
// completo ("Sábado às 14h") vai para leitor de tela; o bloco é só visual.
export function ClassTimeBlock({ weekday, time }: { weekday: number; time: string }) {
  const weekdayLabel = WEEKDAY_LABELS[weekday];
  const timeLabel = formatTime(time);

  return (
    <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-primary py-2 leading-tight text-white">
      <span aria-hidden className="text-caption font-semibold text-accent">
        {weekdayLabel.slice(0, 3)}
      </span>
      <span aria-hidden className="text-subtitle tabular-nums">
        {timeLabel}
      </span>
      <span className="sr-only">
        {weekdayLabel} às {timeLabel}
      </span>
    </div>
  );
}
