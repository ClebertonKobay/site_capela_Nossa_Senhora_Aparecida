"use client";

import { Checkbox as RadixCheckbox } from "radix-ui";
import { cn } from "@/lib/cn";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  name,
  disabled,
  className,
}: CheckboxProps) {
  return (
    <label className="flex min-h-11 items-center gap-2">
      <RadixCheckbox.Root
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        name={name}
        disabled={disabled}
        className={cn(
          "h-5 w-5 shrink-0 rounded border-2 border-primary-light bg-surface data-[state=checked]:border-primary data-[state=checked]:bg-primary",
          className,
        )}
      >
        <RadixCheckbox.Indicator className="flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" fill="none">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
