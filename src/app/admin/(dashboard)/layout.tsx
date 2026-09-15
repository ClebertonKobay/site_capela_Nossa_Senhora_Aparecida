import Link from "next/link";

import { AdminBackLink } from "@/components/admin/AdminBackLink";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { getSession } from "@/lib/auth";
import { ADMIN_NAV_BY_ROLE } from "@/lib/admin-nav";

// Admin sempre dinâmico (CLAUDE.md) — nunca pré-renderizar dado
// administrativo em build time. Vale para toda a subárvore /admin/*
// dentro deste grupo de rotas.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const navItems = session ? ADMIN_NAV_BY_ROLE[session.role] : [];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between gap-3 border-b-2 border-accent bg-primary px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <AdminBackLink />
          <span className="font-semibold">Painel administrativo</span>
        </div>
        <LogoutButton />
      </header>
      <nav className="flex gap-4 overflow-x-auto whitespace-nowrap bg-primary px-4 py-2 text-sm" aria-label="Navegação do painel">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-11 items-center font-semibold text-white/80 hover:text-accent"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
