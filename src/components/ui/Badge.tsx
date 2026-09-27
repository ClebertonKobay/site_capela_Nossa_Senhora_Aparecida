import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const TONE_CLASS = {
  neutral: "bg-primary/10 text-primary",
  muted: "bg-foreground/10 text-foreground/75",
  accent: "bg-accent/25 text-accent-dark",
  danger: "bg-danger/10 text-danger",
} as const;

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: keyof typeof TONE_CLASS;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold whitespace-nowrap",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
