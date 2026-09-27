"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Popover as RadixPopover } from "radix-ui";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { Dialog } from "./Dialog";
import { IconButton } from "./IconButton";

// Abaixo de sm (640px) um popover ancorado no botão fica apertado e some atrás
// do teclado virtual — nesse caso o mesmo conteúdo abre como modal de tela cheia.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

interface PopoverProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({ trigger, title, children, align, side, className, open, onOpenChange }: PopoverProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Dialog trigger={trigger} title={title} className={className} open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    );
  }

  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align={align}
          side={side}
          sideOffset={8}
          className={cn("w-72 rounded-xl border border-border bg-surface p-4 shadow-lifted", className)}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-subtitle text-primary">{title}</p>
            <RadixPopover.Close asChild>
              <IconButton aria-label="Fechar" className="-mr-2 -mt-2">
                <CloseIcon />
              </IconButton>
            </RadixPopover.Close>
          </div>
          {children}
          <RadixPopover.Arrow className="fill-surface" />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
