"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminBackLink() {
  const pathname = usePathname();
  if (pathname === "/admin") return null;

  return (
    <Link
      href="/admin"
      className="btn !min-h-9 border-2 border-white/40 !bg-transparent px-3 py-1 text-sm font-semibold text-white hover:border-accent hover:!text-accent"
    >
      Voltar
    </Link>
  );
}
