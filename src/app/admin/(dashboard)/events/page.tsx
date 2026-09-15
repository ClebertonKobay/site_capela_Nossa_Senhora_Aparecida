import { desc } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/db";
import { events } from "@/db/schema";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";
import { formatCurrency, formatEventDateTime } from "@/lib/format";

import { deleteEvent } from "./actions";

export default async function EventsListPage() {
  const allEvents = await db.select().from(events).orderBy(desc(events.startAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Eventos</h1>
        <Link
          href="/admin/events/new"
          className="btn btn-confirm"
        >
          Novo evento
        </Link>
      </div>

      {allEvents.length === 0 ? (
        <p className="mt-4 text-base text-foreground/60">Nenhum evento cadastrado.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {allEvents.map((event) => (
            <li key={event.id} className="rounded-2xl border border-border bg-surface shadow-card px-4 py-3">
              <p className="font-semibold text-primary">
                {event.featured && <span className="mr-1 text-accent">★</span>}
                {event.name}
              </p>
              <p className="text-base">{formatEventDateTime(event.startAt)}</p>
              {event.sellsCards && event.cardPrice != null && (
                <p className="text-sm text-foreground/70">Cartela: {formatCurrency(event.cardPrice)}</p>
              )}
              <div className="mt-2 flex items-center gap-4">
                <Link
                  href={`/admin/events/${event.id}`}
                  className="text-base font-semibold text-primary-light underline hover:text-primary"
                >
                  Editar
                </Link>
                <DeleteEventButton id={event.id} action={deleteEvent} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
