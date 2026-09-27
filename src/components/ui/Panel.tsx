import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// A "folha" do admin: uma superfície branca com moldura. Listas e tabelas
// ficam dentro de uma folha só, com linhas divididas — em vez de um cartão
// com sombra para cada item.
export function Panel({
  header,
  footer,
  className,
  children,
}: {
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-border bg-surface shadow-card", className)}>
      {header && <div className="border-b border-border px-4 py-4 sm:px-5">{header}</div>}
      {children}
      {footer && <div className="border-t border-border bg-surface-muted/50 px-4 py-3 sm:px-5">{footer}</div>}
    </section>
  );
}
