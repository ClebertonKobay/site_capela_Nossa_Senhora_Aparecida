"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAV_ICON, type AdminNavItem } from "@/lib/admin-nav";
import { cn } from "@/lib/cn";

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto whitespace-nowrap bg-primary-dark px-2 py-2 sm:px-4"
      aria-label="Navegação do painel"
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        const Icon = ADMIN_NAV_ICON[item.href];
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-base font-semibold transition-colors duration-150",
              active ? "bg-accent text-primary-dark" : "text-white/80 hover:bg-white/10 hover:text-white",
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
