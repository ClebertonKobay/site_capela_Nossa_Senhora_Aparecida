import { and, asc, gte, isNotNull, or } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/db";
import { events } from "@/db/schema";
import { formatCurrency, formatEventDateTime, formatShortDate, formatTime } from "@/lib/format";
import {
  ACTIVITY_TYPE_LABELS,
  WEEKDAY_LABELS,
  getNextMass,
  getWeekSchedule,
} from "@/lib/schedules";

export const revalidate = 300;

const MAPS_EMBED_SRC = "https://www.google.com/maps?q=-25.0582828,-50.1536695&z=17&output=embed";
const MAPS_LINK =
  "https://www.google.com/maps/place/Capela+Nossa+Senhora+Aparecida/@-25.0579981,-50.1537934,19.83z/data=!4m6!3m5!1s0x94e81920eea21979:0xf7d21fcd3578d31!8m2!3d-25.0582828!4d-50.1536695!16s%2Fg%2F11f5mb4rj9";

async function getUpcomingEvents() {
  const now = new Date();
  return db
    .select()
    .from(events)
    .where(or(gte(events.startAt, now), and(isNotNull(events.endAt), gte(events.endAt, now))))
    .orderBy(asc(events.startAt))
    .limit(5);
}

export default async function HomePage() {
  const [nextMass, week, upcomingEvents] = await Promise.all([
    getNextMass(),
    getWeekSchedule(),
    getUpcomingEvents(),
  ]);

  return (
    <main className="flex-1">
      <header className="bg-primary px-4 py-6 text-white">
        <h1 className="text-2xl font-bold">Capela Nossa Senhora Aparecida</h1>
        <p className="mt-1 text-base text-white/80">Boa Vista, Ponta Grossa - PR</p>
      </header>

      {nextMass && (
        <section className="bg-accent px-4 py-6 text-primary">
          <p className="text-sm font-semibold uppercase tracking-wide">Próxima Missa</p>
          <p className="mt-1 text-3xl font-bold">
            {WEEKDAY_LABELS[nextMass.weekday]}, {formatShortDate(nextMass.date)} às {formatTime(nextMass.time)}
          </p>
          {nextMass.celebrant && <p className="mt-1 text-lg">Celebrante: {nextMass.celebrant}</p>}
          {nextMass.note && <p className="mt-1 text-base">{nextMass.note}</p>}
        </section>
      )}

      <section className="px-4 py-6">
        <h2 className="text-xl font-bold text-primary">Horários da semana</h2>
        <div className="mt-4 flex flex-col gap-3">
          {week.map((day) => (
            <div key={day.date} className="border-l-4 border-primary-light pl-3">
              <p className="font-semibold text-primary">
                {WEEKDAY_LABELS[day.weekday]} · {formatShortDate(day.date)}
              </p>
              {day.items.length === 0 ? (
                <p className="text-base text-foreground/60">Sem atividades programadas.</p>
              ) : (
                <ul className="mt-1 flex flex-col gap-1">
                  {day.items.map((item) => (
                    <li key={`${item.time}-${item.description}`} className="text-base">
                      <span className="font-semibold">{formatTime(item.time)}</span> — {item.description}
                      {item.celebrant && ` (${item.celebrant})`}
                      {item.note && <span className="block text-sm text-foreground/70">{item.note}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 px-4 py-6">
        <h2 className="text-xl font-bold text-primary">Próximos eventos</h2>
        {upcomingEvents.length === 0 ? (
          <p className="mt-2 text-base text-foreground/60">Nenhum evento programado no momento.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.id}`}
                  className="block border-2 border-primary-light bg-background px-4 py-3"
                >
                  <p className="font-semibold text-primary">
                    {event.featured && <span className="mr-1 text-accent">★</span>}
                    {event.name}
                  </p>
                  <p className="text-base">{formatEventDateTime(event.startAt)}</p>
                  {event.sellsCards && event.cardPrice != null && (
                    <p className="text-sm text-foreground/70">Cartela: {formatCurrency(event.cardPrice)}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="px-4 py-6">
        <h2 className="text-xl font-bold text-primary">Como chegar</h2>
        <p className="mt-2 text-base">R. Pedro Lessinski, S/N - Boa Vista, Ponta Grossa - PR, 84073-179</p>
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-base font-semibold text-primary-light underline"
        >
          Abrir no Google Maps
        </a>
        <div className="mt-4 aspect-[4/3] w-full overflow-hidden border-2 border-primary-light">
          <iframe
            src={MAPS_EMBED_SRC}
            title="Mapa com a localização da Capela Nossa Senhora Aparecida"
            loading="lazy"
            className="h-full w-full"
          />
        </div>
      </section>
    </main>
  );
}
