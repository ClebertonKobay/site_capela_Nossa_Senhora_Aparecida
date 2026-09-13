import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between bg-primary px-4 py-3 text-white">
        <span className="font-semibold">Painel administrativo</span>
        <LogoutButton />
      </header>
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
