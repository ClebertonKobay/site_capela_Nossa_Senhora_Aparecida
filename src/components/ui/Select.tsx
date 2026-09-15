"use client";

import { Select as RadixSelect } from "radix-ui";
import { cn } from "@/lib/cn";

interface SelectProps {
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function Select({
  label,
  value,
  onValueChange,
  name,
  options,
  placeholder,
  className,
}: SelectProps) {
  return (
    <>
      {label && <label className="text-body font-semibold text-foreground">{label}</label>}
      <RadixSelect.Root value={value} onValueChange={onValueChange}>
        <RadixSelect.Trigger className={cn("field flex items-center justify-between", label && "mt-1", className)}>
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" fill="none">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className="bg-surface shadow-lifted rounded-xl border border-border overflow-hidden">
            <RadixSelect.Viewport>
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="px-3 py-2 text-body cursor-pointer outline-none data-[highlighted]:bg-primary-light/15"
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {name && <input type="hidden" name={name} value={value ?? ""} />}
    </>
  );
}
