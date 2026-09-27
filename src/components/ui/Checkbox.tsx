"use client";

import { Checkbox as RadixCheckbox } from "radix-ui";
import { cn } from "@/lib/cn";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  /** Valor enviado no form quando marcado (padrão "on"). Vários checkboxes
      com o mesmo `name` e `value`s diferentes viram uma lista no servidor. */
  value?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

export function Checkbox({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  name,
  value,
  disabled,
  className,
  labelClassName,
}: CheckboxProps) {
  return (
    <label className={cn("flex min-h-11 items-center gap-2", labelClassName)}>
      <RadixCheckbox.Root
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        name={name}
        value={value}
        disabled={disabled}
        className={cn(
          "h-5 w-5 shrink-0 rounded border-2 border-primary-light bg-surface data-[state=checked]:border-primary data-[state=checked]:bg-primary",
          className,
        )}
      >
        <RadixCheckbox.Indicator className="flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" fill="none" className="h-3.5 w-3.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
