"use client";

import type { ReactNode } from "react";
import { Dialog as RadixDialog } from "radix-ui";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";

export function Dialog({
  trigger,
  title,
  children,
  className,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <RadixDialog.Root>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-primary-dark/60 backdrop-blur-sm" />
        <RadixDialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-surface p-6 shadow-lifted",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <RadixDialog.Title className="text-title text-primary">{title}</RadixDialog.Title>
            <RadixDialog.Close asChild>
              <IconButton aria-label="Fechar">
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </IconButton>
            </RadixDialog.Close>
          </div>
          <div className="mt-4">{children}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
