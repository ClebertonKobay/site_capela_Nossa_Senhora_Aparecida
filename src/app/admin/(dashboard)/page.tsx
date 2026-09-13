import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/admin/celebrants"
        className="block border-2 border-primary-light px-4 py-3 text-lg font-semibold text-primary"
      >
        Celebrantes do mês
      </Link>
      <Link
        href="/admin/events"
        className="block border-2 border-primary-light px-4 py-3 text-lg font-semibold text-primary"
      >
        Eventos
      </Link>
    </div>
  );
}
