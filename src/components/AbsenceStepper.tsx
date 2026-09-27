"use client";

import { useEffect, useRef, useState } from "react";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { IconButton, useToast } from "@/components/ui";
import { adjustAbsences } from "@/app/admin/(dashboard)/my-classes/absences-actions";

export function AbsenceStepper({ catechumenId, initialCount }: { catechumenId: number; initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const { showToast } = useToast();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function schedule(newCount: number) {
    setCount(newCount);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      adjustAbsences(catechumenId, newCount)
        .then(() => showToast("Faltas atualizadas."))
        .catch(() => showToast("Não foi possível salvar. Tente de novo.", "error"));
    }, 1500);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="inline-flex items-center rounded-xl border border-border bg-surface">
      <IconButton
        aria-label="Diminuir faltas"
        onClick={() => schedule(Math.max(0, count - 1))}
        disabled={count === 0}
        className="disabled:opacity-40"
      >
        <MinusIcon />
      </IconButton>
      <span aria-live="polite" className="w-8 text-center text-body font-semibold tabular-nums text-primary">
        {count}
      </span>
      <IconButton aria-label="Aumentar faltas" onClick={() => schedule(count + 1)}>
        <PlusIcon />
      </IconButton>
    </div>
  );
}
