"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@/components/ui";
import {
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  EventGlyph,
  MapPinIcon,
} from "@/components/icons";
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

const TIME_ZONE = "America/Sao_Paulo";

function datePart(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, ...options })
    .format(date)
    .replace(".", "");
}

function formatHour(date: Date) {
  const [hour, minute] = datePart(date, { hour: "2-digit", minute: "2-digit" }).split(":");
  return minute === "00" ? `${hour}h` : `${hour}h${minute}`;
}

// Folhinha de calendário: dia da semana na faixa dourada, dia grande, mês.
function DateLeaf({ date, className = "" }: { date: Date; className?: string }) {
  return (
    <span
      className={`flex w-14 flex-col items-center overflow-hidden rounded-xl bg-surface text-center text-primary shadow-card ${className}`}
    >
      <span className="w-full bg-accent py-0.5 text-caption font-semibold text-primary-dark">
        {datePart(date, { weekday: "short" })}
      </span>
      <span className="pt-1 text-title leading-none tabular-nums">{datePart(date, { day: "2-digit" })}</span>
      <span className="pb-1.5 text-caption">{datePart(date, { month: "short" })}</span>
    </span>
  );
}

export function EventCard({ event }: { event: Event }) {
  const price = event.sellsCards ? event.cardPrice : null;

  const photo = event.image ? (
    <Image
      src={event.image}
      alt=""
      fill
      sizes="(min-width: 1024px) 40vw, 85vw"
      className="object-cover"
    />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center bg-water-texture">
      <EventGlyph className="h-14 w-14 text-white/25" />
    </div>
  );

  return (
    <Dialog
      title={event.name}
      media={
        <div className="relative aspect-16/9 w-full">
          {event.image ? (
            <Image src={event.image} alt={event.name} fill sizes="448px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-water-texture">
              <EventGlyph className="h-16 w-16 text-white/25" />
            </div>
          )}
          <DateLeaf date={event.startAt} className="absolute bottom-3 left-4" />
        </div>
      }
      footer={
        price != null ? (
          <div className="flex items-center justify-between gap-4">
            <p className="leading-tight">
              <span className="block text-caption text-foreground/70">Cartela</span>
              <span className="text-title text-primary tabular-nums">{formatCurrency(price)}</span>
            </p>
            <Link href={`/events/${event.id}`} className="btn btn-confirm">
              Comprar cartela
            </Link>
          </div>
        ) : (
          <Link href={`/events/${event.id}`} className="btn btn-confirm w-full">
            Ver página do evento
          </Link>
        )
      }
      trigger={
        // O recorte (máscara) fica no div de dentro: no botão ele cortaria
        // também o contorno de foco do teclado. A sombra vem de drop-shadow,
        // que respeita os recortes do ingresso.
        <button
          type="button"
          className="group block h-full w-full rounded-2xl text-left drop-shadow-[0_10px_18px_rgba(10,25,50,0.35)]"
        >
          <div className="ticket-cut flex h-full flex-col overflow-hidden rounded-2xl bg-surface">
            <div className="relative aspect-16/10 w-full overflow-hidden">
              {photo}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-primary-dark/50 via-transparent to-transparent"
              />
              <DateLeaf date={event.startAt} className="absolute left-3 top-3" />
              {event.featured && (
                <span className="absolute top-3 right-3 rounded-full bg-accent px-2.5 py-1 text-caption font-semibold text-primary-dark shadow-card">
                  Destaque
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3 pb-4">
              <p className="line-clamp-2 text-subtitle text-primary">{event.name}</p>
              <p className="flex items-center gap-2 text-body text-foreground/75">
                <ClockIcon className="h-4 w-4 shrink-0 text-primary-light" />
                {formatHour(event.startAt)}
              </p>
              {event.location && (
                <p className="flex items-center gap-2 text-body text-foreground/75">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-primary-light" />
                  <span className="truncate">{event.location}</span>
                </p>
              )}
            </div>

            {/* Canhoto do ingresso — altura igual ao --ticket-stub (3.5rem). */}
            <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-t-2 border-dashed border-border px-4 transition-colors duration-150 group-hover:bg-accent/15">
              {price != null ? (
                <span className="font-semibold text-accent-dark">
                  Cartela {formatCurrency(price)}
                </span>
              ) : (
                <span className="font-semibold text-primary-light">Ver detalhes</span>
              )}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary transition-colors duration-150 group-hover:bg-accent group-hover:text-primary-dark">
                <ChevronRightIcon className="h-4 w-4" />
              </span>
            </div>
          </div>
        </button>
      }
    >
      <ul className="mt-2 flex flex-col gap-2 text-body">
        <li className="flex items-start gap-3">
          <CalendarIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" />
          <span className="first-letter:uppercase">{formatEventDateTime(event.startAt)}</span>
        </li>
        {event.location && (
          <li className="flex items-start gap-3">
            <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" />
            <span>{event.location}</span>
          </li>
        )}
      </ul>
      {event.description && (
        <p className="mt-4 border-t border-border pt-4 text-body whitespace-pre-line text-foreground/85">
          {event.description}
        </p>
      )}
    </Dialog>
  );
}
