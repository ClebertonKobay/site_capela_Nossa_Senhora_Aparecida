import { desc, eq } from "drizzle-orm";

import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { PageHeader } from "@/components/ui";
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
      <PageHeader
        title="Pedidos de cartela"
        description="Quem pediu cartela pelo site, do mais recente para o mais antigo."
        actions={rows.length > 0 && <ExportCsvButton rows={exportRows} />}
      />

      <OrdersTable rows={rows} />
    </div>
  );
}
