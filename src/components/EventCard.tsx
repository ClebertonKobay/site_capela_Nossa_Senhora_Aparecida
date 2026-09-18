"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@/components/ui";
import { formatCurrency, formatEventDateTime } from "@/lib/format";

type Event = {
  id: number;
  name: string;
  startAt: Date;
  location: string | null;
  description: string | null;
  image: string | null;
  sellsCards: boolean;
  cardPrice: number | null;
  featured: boolean;
};

export function EventCard({ event }: { event: Event }) {
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(event.startAt);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(event.startAt)
    .replace(".", "")
    .toUpperCase();

  return (
    <Dialog
      title={event.name}
      trigger={
        event.image ? (
          <button
            type="button"
            className="hover-lift block h-full w-full overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-card"
          >
            <div className="photo-vignette relative aspect-4/3 w-full overflow-hidden">
              <Image src={event.image} alt={event.name} fill sizes="(min-width: 1024px) 33vw, 85vw" className="object-cover" />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/10 to-transparent"
              />
              <span className="absolute left-3 top-3 flex w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-white py-1.5 text-primary shadow-card">
                <span className="text-title leading-none">{day}</span>
                <span className="text-caption uppercase tracking-wide">{month}</span>
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="font-semibold">
                  {event.featured && <span className="mr-1 text-accent">★</span>}
                  {event.name}
                </p>
                <p className="text-caption text-white/85">{formatEventDateTime(event.startAt)}</p>
              </div>
            </div>
          </button>
        ) : (
          <button
            type="button"
            className="hover-lift flex w-full items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3 text-left shadow-card"
          >
            <span className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary py-2 text-white">
              <span className="text-title leading-none">{day}</span>
              <span className="text-caption uppercase tracking-wide">{month}</span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-primary">
                {event.featured && <span className="mr-1 text-accent-dark">★</span>}
                {event.name}
              </span>
              <span className="block text-base">{formatEventDateTime(event.startAt)}</span>
            </span>
          </button>
        )
      }
    >
      {event.location && <p className="text-body text-foreground/80">{event.location}</p>}
      {event.description && <p className="mt-2 text-body whitespace-pre-line">{event.description}</p>}
      {event.sellsCards && event.cardPrice != null && (
        <p className="mt-3 text-body font-semibold text-primary">Cartela: {formatCurrency(event.cardPrice)}</p>
      )}
      <Link href={`/events/${event.id}`} className="btn btn-confirm mt-4 w-full">
        {event.sellsCards ? "Comprar cartela" : "Ver detalhes"}
      </Link>
    </Dialog>
  );
}
