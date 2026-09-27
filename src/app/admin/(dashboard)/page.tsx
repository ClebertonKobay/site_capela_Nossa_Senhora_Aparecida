import Link from "next/link";

import { getSession } from "@/lib/auth";
import { ADMIN_NAV_BY_ROLE, ADMIN_NAV_ICON } from "@/lib/admin-nav";
import { PageHeader, Panel } from "@/components/ui";

export default async function AdminHomePage() {
  const session = await getSession();
  const navItems = ADMIN_NAV_BY_ROLE[session?.role ?? "admin"];

  return (
    <div>
      <PageHeader title="Painel administrativo" description="O que você quer fazer hoje?" />

      <Panel>
        {/* gap-px sobre fundo de borda desenha as linhas entre os itens,
            em uma ou duas colunas, sem um cartão com sombra para cada um. */}
        <div className="grid gap-px bg-border sm:grid-cols-2">
          {navItems.map((item) => {
            const Icon = ADMIN_NAV_ICON[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-4 bg-surface px-4 py-4 transition-colors duration-150 hover:bg-background sm:px-5 sm:last:odd:col-span-2"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-150 group-hover:bg-primary group-hover:text-accent">
                  {Icon && <Icon className="h-[1.125rem] w-[1.125rem]" />}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-primary">{item.label}</span>
                  <span className="block text-body text-foreground/70">{item.description}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
