import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { EventForm } from "@/components/admin/EventForm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { toSaoPauloDateTimeLocal } from "@/lib/format";

import { updateEvent } from "../actions";

export default async function EditEventPage({ params }: PageProps<"/admin/events/[id]">) {
  const { id } = await params;
  const eventId = Number(id);
  if (!Number.isInteger(eventId)) notFound();

  const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!event) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-primary">Editar evento</h1>
      <div className="mt-4">
        <EventForm
          action={updateEvent}
          defaultValues={{
            id: event.id,
            name: event.name,
            description: event.description ?? "",
            startAt: toSaoPauloDateTimeLocal(event.startAt),
            endAt: event.endAt ? toSaoPauloDateTimeLocal(event.endAt) : "",
            location: event.location ?? "",
            whatsappPhone: event.whatsappPhone,
            cardPrice: event.cardPrice != null ? (event.cardPrice / 100).toFixed(2) : "",
            sellsCards: event.sellsCards,
            featured: event.featured,
          }}
        />
      </div>
    </div>
  );
}
