"use client";

import { Button } from "@/components/ui";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <Button
      type="button"
      onClick={handleLogout}
      variant="secondary"
      className="!min-h-9 border-2 border-white/40 !bg-transparent px-3 py-1 text-sm font-semibold text-white hover:border-accent hover:!text-accent"
    >
      Sair
    </Button>
  );
}
