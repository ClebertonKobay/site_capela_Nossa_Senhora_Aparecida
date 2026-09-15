import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BuyCards } from "@/components/BuyCards";
import { PageShell } from "@/components/PageShell";
import { db } from "@/db";
import { events } from "@/db/schema";
import { formatCurrency, formatEventDateTime } from "@/lib/format";
import { CHAPEL_ADDRESS, MAPS_LINK } from "@/lib/location";

export const revalidate = 300;

export default async function EventPage({ params }: PageProps<"/events/[id]">) {
  const { id } = await params;
  const eventId = Number(id);
  if (!Number.isInteger(eventId)) notFound();

  const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!event) notFound();

  return (
    <PageShell nav="inner">
      <div className="px-4 py-6">
        <Link
          href="/"
          className="flex min-h-11 w-fit items-center text-base font-semibold text-primary-light hover:text-primary mt-8 md:mt-0"
        >
          ← Voltar
        </Link>

        <h1 className="mt-2 text-display text-primary">{event.name}</h1>

        <section className="mt-4 rounded-3xl bg-accent px-5 py-6 text-primary shadow-card">
          <p className="text-display leading-tight sm:text-4xl">{formatEventDateTime(event.startAt)}</p>
          {event.location ? (
            <p className="mt-2 text-body">{event.location}</p>
          ) : (
            <p className="mt-2 text-body">
              {CHAPEL_ADDRESS} —{" "}
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="underline">
                abrir no Google Maps
              </a>
            </p>
          )}
        </section>

        {event.description && <p className="mt-4 text-base whitespace-pre-line">{event.description}</p>}

        {event.sellsCards && (
          <div className="mt-6 rounded-3xl border border-border bg-surface-muted shadow-card px-4 py-4">
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
      </div>
    </PageShell>
  );
}
