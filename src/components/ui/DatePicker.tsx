"use client";

import { useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { ptBR } from "date-fns/locale";
import { Popover as RadixPopover } from "radix-ui";
import { Popover } from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface DatePickerProps {
  label?: string;
  error?: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  includeTime?: boolean;
  className?: string;
}

const dayPickerClassNames = {
  selected: "bg-primary text-white rounded-md",
  today: "border border-accent rounded-md",
  day_button: "hover:bg-primary-light/15 rounded-md transition-colors",
};

export function DatePicker({ label, error, value, onChange, includeTime, className }: DatePickerProps) {
  const generatedId = useId();
  const labelId = label ? generatedId : undefined;
  // Ref no botão de fechar escondido do Radix: permite fechar o popover
  // programaticamente ao escolher um dia (sem hora), sem precisar controlar
  // o estado de abertura do Popover compartilhado.
  const closeRef = useRef<HTMLButtonElement>(null);
  // Hora escolhida em memória enquanto o popover está aberto, usada para
  // combinar com o dia selecionado no calendário quando includeTime é true.
  const [pendingTime, setPendingTime] = useState<string>(() => formatTime(value));

  const formattedValue = value
    ? new Intl.DateTimeFormat("pt-BR", includeTime ? { dateStyle: "short", timeStyle: "short" } : { dateStyle: "short" }).format(value)
    : "Selecionar data";

  function combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours || 0, minutes || 0, 0, 0);
    return combined;
  }

  function handleDaySelect(date: Date | undefined) {
    if (!includeTime) {
      onChange(date);
      closeRef.current?.click();
      return;
    }
    if (!date) {
      onChange(undefined);
      return;
    }
    // Meio-dia como horário padrão inicial quando o usuário ainda não escolheu hora,
    // para não sugerir um horário de madrugada por engano.
    const time = pendingTime || "12:00";
    setPendingTime(time);
    onChange(combineDateAndTime(date, time));
  }

  function handleTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const time = event.target.value;
    setPendingTime(time);
    if (value) {
      onChange(combineDateAndTime(value, time));
    }
  }

  return (
    <>
      {label && (
        <label id={labelId} className="text-body font-semibold text-foreground">
          {label}
        </label>
      )}
      <div className={cn(label && "mt-1")}>
        <Popover
          trigger={
            <Button variant="secondary" type="button" className="w-full justify-start" aria-labelledby={labelId}>
              {formattedValue}
            </Button>
          }
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleDaySelect}
            locale={ptBR}
            classNames={dayPickerClassNames}
          />
          {includeTime && (
            <input
              type="time"
              className="field mt-2"
              value={pendingTime}
              onChange={handleTimeChange}
            />
          )}
          <RadixPopover.Close ref={closeRef} className="hidden" aria-hidden="true" tabIndex={-1} />
        </Popover>
      </div>
      {error && <p className="mt-1 text-caption text-danger">{error}</p>}
    </>
  );
}

function formatTime(value: Date | undefined): string {
  if (!value) return "";
  const hours = value.getHours().toString().padStart(2, "0");
  const minutes = value.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
