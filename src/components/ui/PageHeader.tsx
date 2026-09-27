import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Cabeçalho padrão de toda tela do admin: título, uma linha dizendo para que
// serve a tela, e as ações principais à direita (empilham no celular).
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="text-title text-primary">{title}</h1>
        {description && <p className="mt-1 text-body text-foreground/70">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
