import Link from "next/link";

import { getSession } from "@/lib/auth";
import { ADMIN_NAV_BY_ROLE } from "@/lib/admin-nav";

export default async function AdminHomePage() {
  const session = await getSession();
  const navItems = ADMIN_NAV_BY_ROLE[session?.role ?? "admin"];

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-title text-primary">Painel administrativo</h1>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block rounded-2xl border border-border bg-surface shadow-card px-4 py-3 hover-grow"
        >
          <p className="text-subtitle text-primary">{item.label}</p>
          <p className="mt-1 text-body text-foreground/70">{item.description}</p>
        </Link>
      ))}
    </div>
  );
}
