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
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-base">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="py-2 pr-3">Nome</th>
                <th className="py-2 pr-3">Telefone</th>
                <th className="py-2 pr-3">Qtd</th>
                <th className="py-2 pr-3">Evento</th>
                <th className="py-2 pr-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-primary-light/30">
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
      )}
    </div>
  );
}
