"use client";

import type { ReactNode } from "react";
import { Tabs as RadixTabs } from "radix-ui";
import { cn } from "@/lib/cn";

export type TabItem = {
  value: string;
  label: string;
  content: ReactNode;
  /** Número ao lado do rótulo (ex.: quantos catequizandos na turma). */
  count?: number;
  /** Aba de algo desativado — aparece apagada, mas continua clicável. */
  dimmed?: boolean;
};

// Pílulas no mesmo desenho do menu do painel. Rolam na horizontal quando não
// cabem (muitas turmas no celular), sem quebrar em duas linhas.
export function Tabs({
  items,
  defaultValue,
  ariaLabel,
  className,
}: {
  items: TabItem[];
  defaultValue?: string;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <RadixTabs.Root defaultValue={defaultValue ?? items[0]?.value} className={cn(className)}>
      <RadixTabs.List
        aria-label={ariaLabel}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              "group flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 text-body font-semibold whitespace-nowrap text-foreground/80 transition-colors duration-150",
              "hover:border-primary-light/60 hover:text-primary",
              "data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white",
              item.dimmed && "border-dashed text-foreground/55",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="min-w-6 rounded-full bg-primary/10 px-1.5 text-center text-caption font-semibold text-primary group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                {item.count}
              </span>
            )}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className="mt-5 outline-none">
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
