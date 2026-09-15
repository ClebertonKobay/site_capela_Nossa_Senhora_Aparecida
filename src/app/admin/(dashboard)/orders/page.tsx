import { desc, eq } from "drizzle-orm";

import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { db } from "@/db";
import { cardOrders, events } from "@/db/schema";
import { formatDateTime } from "@/lib/format";
import { formatPhone } from "@/lib/phone";

export default async function OrdersPage() {
  const rows = await db
    .select({
      id: cardOrders.id,
      name: cardOrders.name,
      phone: cardOrders.phone,
      quantity: cardOrders.quantity,
      createdAt: cardOrders.createdAt,
      eventName: events.name,
    })
    .from(cardOrders)
    .innerJoin(events, eq(cardOrders.eventId, events.id))
    .orderBy(desc(cardOrders.createdAt));

  const exportRows = rows.map((r) => ({
    name: r.name,
    phone: formatPhone(r.phone),
    quantity: r.quantity,
    eventName: r.eventName,
    createdAtLabel: formatDateTime(r.createdAt),
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Pedidos de cartela</h1>
        {rows.length > 0 && <ExportCsvButton rows={exportRows} />}
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 text-base text-foreground/60">Nenhum pedido ainda.</p>
      ) : (
        <>
          <ul className="mt-4 flex flex-col gap-3 md:hidden">
            {rows.map((row) => (
              <li key={row.id} className="rounded-2xl border border-border bg-surface shadow-card px-4 py-3">
                <p className="font-semibold text-primary">{row.name}</p>
                <p className="text-body">{formatPhone(row.phone)}</p>
                <p className="text-body">Qtd: {row.quantity}</p>
                <p className="text-body">{row.eventName}</p>
                <p className="text-caption text-foreground/70">{formatDateTime(row.createdAt)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[560px] border-collapse text-left text-base">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="py-2 pr-3">Nome</th>
                  <th className="py-2 pr-3">Telefone</th>
                  <th className="py-2 pr-3">Qtd</th>
                  <th className="py-2 pr-3">Evento</th>
                  <th className="py-2 pr-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border">
                    <td className="py-2 pr-3">{row.name}</td>
                    <td className="py-2 pr-3">{formatPhone(row.phone)}</td>
                    <td className="py-2 pr-3">{row.quantity}</td>
                    <td className="py-2 pr-3">{row.eventName}</td>
                    <td className="py-2 pr-3">{formatDateTime(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
