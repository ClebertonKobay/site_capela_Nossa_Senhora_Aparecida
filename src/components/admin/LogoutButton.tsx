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
      className="btn border-2 border-white/40 !bg-transparent px-3 py-1 text-sm font-semibold text-white hover:border-accent hover:!text-accent"
    >
      Sair
    </button>
  );
}
