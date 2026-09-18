"use client";

import { useEffect, useRef, useState } from "react";
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
    <div className="flex items-center gap-2">
      <IconButton aria-label="Diminuir faltas" onClick={() => schedule(Math.max(0, count - 1))}>
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" fill="none">
          <path d="M5 12h14" strokeLinecap="round" />
        </svg>
      </IconButton>
      <span className="w-6 text-center text-body font-semibold text-primary">{count}</span>
      <IconButton aria-label="Aumentar faltas" onClick={() => schedule(count + 1)}>
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" fill="none">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </IconButton>
    </div>
  );
}
