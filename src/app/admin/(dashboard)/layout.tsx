import { AdminBackLink } from "@/components/admin/AdminBackLink";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { getSession } from "@/lib/auth";
import { ADMIN_NAV_BY_ROLE } from "@/lib/admin-nav";
import { ToastProvider } from "@/components/ui";

// Admin sempre dinâmico (CLAUDE.md) — nunca pré-renderizar dado
// administrativo em build time. Vale para toda a subárvore /admin/*
// dentro deste grupo de rotas.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const navItems = session ? ADMIN_NAV_BY_ROLE[session.role] : [];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-water-texture">
        <div className="mx-auto flex min-h-screen w-full flex-col bg-background shadow-lifted sm:w-[95%] lg:w-[90%]">
          <header className="flex items-center justify-between gap-3 bg-primary px-4 py-3 text-white sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/20 text-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-5 w-5">
                  <path d="M12 3v18" />
                  <path d="M7 8h10" />
                </svg>
              </span>
              <span className="truncate font-semibold">Painel administrativo</span>
              <AdminBackLink />
            </div>
            <LogoutButton />
          </header>
          <AdminNav items={navItems} />
          <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
