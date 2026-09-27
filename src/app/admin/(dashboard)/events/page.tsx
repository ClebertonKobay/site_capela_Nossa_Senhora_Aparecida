import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

import { db } from "@/db";
import { events } from "@/db/schema";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";
import { EventGlyph, PlusIcon } from "@/components/icons";
import { Badge, PageHeader, Panel } from "@/components/ui";
import { formatCurrency, formatEventDateTime } from "@/lib/format";

import { deleteEvent } from "./actions";

export default async function EventsListPage() {
  const allEvents = await db.select().from(events).orderBy(desc(events.startAt));

  return (
    <div>
      <PageHeader
        title="Eventos"
        description="Festas, encontros e venda de cartela que aparecem no site."
        actions={
          <Link href="/admin/events/new" className="btn btn-confirm">
            <PlusIcon />
            Novo evento
          </Link>
        }
      />

      <Panel>
        {allEvents.length === 0 ? (
          <p className="px-4 py-10 text-center text-body text-foreground/70 sm:px-5">
            Nenhum evento cadastrado. Use “Novo evento” para divulgar o primeiro.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {allEvents.map((event) => (
              <li key={event.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                    {event.image ? (
                      <Image src={event.image} alt="" fill sizes="80px" className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-water-texture">
                        <EventGlyph className="h-6 w-6 text-white/40" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-primary">{event.name}</p>
                      {event.featured && <Badge tone="accent">Destaque</Badge>}
                    </div>
                    <p className="text-body">{formatEventDateTime(event.startAt)}</p>
                    {event.sellsCards && event.cardPrice != null && (
                      <p className="text-caption text-foreground/70">
                        Cartela: {formatCurrency(event.cardPrice)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-end gap-1">
                  <Link href={`/admin/events/${event.id}`} className="btn btn-ghost">
                    Editar
                  </Link>
                  <DeleteEventButton id={event.id} action={deleteEvent} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
