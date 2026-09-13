import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { BuyCards } from "@/components/BuyCards";
import { db } from "@/db";
import { events } from "@/db/schema";
import { formatCurrency, formatEventDateTime } from "@/lib/format";

export const revalidate = 300;

export default async function EventPage({ params }: PageProps<"/events/[id]">) {
  const { id } = await params;
  const eventId = Number(id);
  if (!Number.isInteger(eventId)) notFound();

  const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!event) notFound();

  return (
    <main className="flex-1 px-4 py-6">
      <h1 className="text-2xl font-bold text-primary">{event.name}</h1>
      <p className="mt-1 text-lg">{formatEventDateTime(event.startAt)}</p>
      {event.location && <p className="mt-1 text-base text-foreground/70">{event.location}</p>}

      {event.description && <p className="mt-4 text-base whitespace-pre-line">{event.description}</p>}

      {event.sellsCards && (
        <div className="mt-6 border-2 border-primary-light bg-primary/5 px-4 py-4">
          {event.cardPrice != null && (
            <p className="text-lg font-semibold text-primary">Cartela: {formatCurrency(event.cardPrice)}</p>
          )}
          <div className="mt-3">
            <BuyCards
              eventId={event.id}
              eventName={event.name}
              whatsappPhone={event.whatsappPhone}
              cardPriceCents={event.cardPrice}
            />
          </div>
        </div>
      )}
    </main>
  );
}
