import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/admin/celebrants"
        className="block rounded-2xl border border-border bg-surface shadow-card px-4 py-3 hover-grow"
      >
        <p className="text-subtitle text-primary">Celebrantes do mês</p>
        <p className="mt-1 text-body text-foreground/70">Quem celebra cada missa do mês</p>
      </Link>
      <Link
        href="/admin/events"
        className="block rounded-2xl border border-border bg-surface shadow-card px-4 py-3 hover-grow"
      >
        <p className="text-subtitle text-primary">Eventos</p>
        <p className="mt-1 text-body text-foreground/70">Festas e venda de cartela</p>
      </Link>
      <Link
        href="/admin/orders"
        className="block rounded-2xl border border-border bg-surface shadow-card px-4 py-3 hover-grow"
      >
        <p className="text-subtitle text-primary">Pedidos de cartela</p>
        <p className="mt-1 text-body text-foreground/70">Quem pediu cartela</p>
      </Link>
    </div>
  );
}
