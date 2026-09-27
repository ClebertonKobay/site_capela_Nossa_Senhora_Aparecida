"use client";

import type { ReactNode } from "react";
import { Dialog as RadixDialog } from "radix-ui";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";

export function Dialog({
  trigger,
  title,
  children,
  media,
  footer,
  className,
  open,
  onOpenChange,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  /** Foto/cabeçalho visual de ponta a ponta, acima do título. */
  media?: ReactNode;
  /** Rodapé fixo (ação principal) — fica visível mesmo com texto longo rolando. */
  footer?: ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const closeButton = (
    <RadixDialog.Close asChild>
      <IconButton
        aria-label="Fechar"
        className={
          media
            ? "absolute top-3 right-3 z-10 rounded-full bg-surface/90 text-primary shadow-card backdrop-blur-sm hover:!bg-surface"
            : "-mr-3 -mt-1"
        }
      >
        <CloseIcon />
      </IconButton>
    </RadixDialog.Close>
  );

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-primary-dark/60 backdrop-blur-sm" />
        <RadixDialog.Content
          aria-describedby={undefined}
          className={cn(
            "dialog-content fixed top-1/2 left-1/2 z-50 flex max-h-[88vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-surface shadow-lifted",
            className,
          )}
        >
          {media && (
            <div className="relative shrink-0">
              {media}
              {closeButton}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <RadixDialog.Title className={cn("text-primary", media ? "text-title" : "pt-2 text-subtitle")}>
                {title}
              </RadixDialog.Title>
              {!media && closeButton}
            </div>
            <div className="mt-4">{children}</div>
          </div>

          {footer && <div className="shrink-0 border-t border-border bg-background px-6 py-4">{footer}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
