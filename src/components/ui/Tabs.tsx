"use client";

import type { ReactNode } from "react";
import { Tabs as RadixTabs } from "radix-ui";
import { cn } from "@/lib/cn";

export function Tabs({
  items,
  defaultValue,
  ariaLabel,
  className,
}: {
  items: { value: string; label: string; content: ReactNode }[];
  defaultValue?: string;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <RadixTabs.Root defaultValue={defaultValue ?? items[0]?.value} className={cn(className)}>
      <RadixTabs.List
        aria-label={ariaLabel}
        className="flex gap-1 overflow-x-auto border-b border-border"
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className="min-h-11 shrink-0 rounded-t-lg px-4 text-body font-semibold whitespace-nowrap text-foreground/70 data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-card"
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className="mt-4 outline-none">
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
