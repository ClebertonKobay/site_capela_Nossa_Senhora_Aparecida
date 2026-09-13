"use client";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="min-h-11 border-2 border-white px-3 py-1 text-sm font-semibold text-white"
    >
      Sair
    </button>
  );
}
