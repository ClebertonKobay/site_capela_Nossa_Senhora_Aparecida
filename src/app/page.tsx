import { and, asc, gte, isNotNull, or } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

import capelaPhoto from "@/assets/capela.jpg";
import catequistasPhoto from "@/assets/catequistas.jpeg";
import grupoDeJovensPhoto from "@/assets/grupo_de_jovens_2.jpg";
import grupoDeOracaoPhoto from "@/assets/grupo_de_oracao.jpg";
import santaMissaPhoto from "@/assets/santa_missa.jpg";
import { db } from "@/db";
import { events } from "@/db/schema";
import { ArchDivider } from "@/components/ArchDivider";
import { ACTIVITY_ICONS } from "@/components/icons";
import { MinistrySection } from "@/components/MinistrySection";
import { PageShell } from "@/components/PageShell";
import { ScheduleScrollIndicator } from "@/components/ScheduleScrollIndicator";
import {
  formatCurrency,
  formatEventDateTime,
  formatShortDate,
  formatTime,
  formatWeekdayList,
} from "@/lib/format";
import {
  CHAPEL_ADDRESS,
  MAPS_EMBED_SRC,
  MAPS_LINK,
  PRAYER_GROUP_INSTAGRAM,
  YOUTH_GROUP_INSTAGRAM,
} from "@/lib/location";
import {
  WEEKDAY_LABELS,
  getActivityHighlights,
  getNextMass,
  getWeekSchedule,
  isPatronessFeastWindow,
} from "@/lib/schedules";

const YOUTH_GROUP_SCHEDULE_LABEL = "2º sábado do mês · 18h";

const ABOUT_TEXT =
  "A Capela Nossa Senhora Aparecida é um espaço de fé, acolhida e comunidade no bairro Boa Vista, em Ponta Grossa. Aqui celebramos a Santa Missa, rezamos juntos e cuidamos da formação de crianças, jovens e adultos na caminhada da fé — sempre sob o olhar de Nossa Senhora Aparecida, padroeira do Brasil.";

export const revalidate = 300;

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
  const [nextMass, week, upcomingEvents, highlights] = await Promise.all([
    getNextMass(),
    getWeekSchedule(),
    getUpcomingEvents(),
    getActivityHighlights(),
  ]);

  const massLabel = highlights.mass[0]
    ? `${WEEKDAY_LABELS[highlights.mass[0].weekday]} · ${formatTime(highlights.mass[0].time)}`
    : "Consulte o mural da capela";
  const prayerGroupLabel = highlights.prayer_group[0]
    ? `${WEEKDAY_LABELS[highlights.prayer_group[0].weekday]} · ${formatTime(highlights.prayer_group[0].time)}`
    : "Consulte o mural da capela";
  const catechismLabel = highlights.catechism.length
    ? formatWeekdayList(highlights.catechism.map((h) => h.weekday))
    : "Consulte o mural da capela";

  const scrollIndicatorSections = [
    { id: "santa-missa", title: "Santa Missa", label: massLabel },
    { id: "grupo-oracao", title: "Grupo de Oração", label: prayerGroupLabel },
    { id: "catequese", title: "Catequese", label: catechismLabel },
    { id: "grupo-jovens", title: "Grupo de Jovens", label: YOUTH_GROUP_SCHEDULE_LABEL },
  ];

  return (
    <>
      <PageShell
        hero={
          <section
            id="inicio"
            className="photo-vignette relative col-start-1 row-start-1 aspect-4/3 w-full overflow-hidden sm:rounded-t-3xl"
          >
            <Image
              src={capelaPhoto}
              alt="Fachada da Capela Nossa Senhora Aparecida"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </section>
        }
      >
          {isPatronessFeastWindow() && (
            <div className="mx-3 mt-3 rounded-2xl bg-primary px-4 py-3 text-center text-white shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">12 de outubro</p>
              <p className="text-base font-semibold">Dia de Nossa Senhora Aparecida, padroeira do Brasil</p>
            </div>
          )}

          <div className="px-4 pt-8 pb-10 text-center">
            <h1 className="text-display text-primary sm:text-5xl">Capela Nossa Senhora Aparecida</h1>
            <p className="mt-1 text-base text-foreground/70">Boa Vista, Ponta Grossa - PR</p>
          </div>

          {nextMass && (
            <section className="relative z-10 mx-3 -mt-6 rounded-3xl bg-accent px-5 py-6 text-primary shadow-card sm:-mt-8">
              <p className="text-caption font-semibold uppercase tracking-widest text-primary/70">Próxima Missa</p>
              <p className="mt-2 text-display leading-tight sm:text-5xl">
                {WEEKDAY_LABELS[nextMass.weekday]}, {formatShortDate(nextMass.date)} às {formatTime(nextMass.time)}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-primary/15 pt-3 text-body">
                <span className="font-semibold">Celebrante:</span>
                <span>{nextMass.celebrant ?? "A definir"}</span>
              </div>
              {nextMass.note && <p className="mt-2 text-caption italic text-primary/80">{nextMass.note}</p>}
            </section>
          )}

          <ArchDivider className="mt-10" />

          <section className="px-4 py-6 text-center">
            <p className="mx-auto max-w-2xl text-lg">{ABOUT_TEXT}</p>
          </section>

          <MinistrySection
            id="santa-missa"
            title="Santa Missa"
            description="Venha conhecer e participar da Santa Missa com a nossa comunidade."
            scheduleLabel={massLabel}
            photo={{ src: santaMissaPhoto, alt: "Celebração da Santa Missa na Capela Nossa Senhora Aparecida" }}
            reverse={false}
            tone="primary-light"
          />

          <MinistrySection
            id="grupo-oracao"
            title="Grupo de Oração Porta do Céu"
            description="Venha louvar com a gente no Grupo de Oração Porta do Céu."
            scheduleLabel={prayerGroupLabel}
            photo={{ src: grupoDeOracaoPhoto, alt: "Encontro do Grupo de Oração Porta do Céu", position: "top" }}
            instagram={PRAYER_GROUP_INSTAGRAM}
            reverse={true}
            tone="accent"
          />

          <MinistrySection
            id="catequese"
            title="Catequese"
            description="Coloque seu filho na catequese e venha fazer parte dessa caminhada de fé."
            scheduleLabel={catechismLabel}
            photo={{ src: catequistasPhoto, alt: "Equipe de catequistas da Capela Nossa Senhora Aparecida" }}
            reverse={false}
            tone="primary-light"
          />

          <MinistrySection
            id="grupo-jovens"
            title="Grupo de Jovens Aos Pés da Cruz"
            description="Venha participar do Grupo de Jovens da nossa comunidade e nos conhecer."
            scheduleLabel={YOUTH_GROUP_SCHEDULE_LABEL}
            photo={{ src: grupoDeJovensPhoto, alt: "Grupo de Jovens Aos Pés da Cruz reunido na capela", position: "top" }}
            instagram={YOUTH_GROUP_INSTAGRAM}
            reverse={true}
            tone="accent"
          />

          <ArchDivider className="mt-4" />

          <section className="px-4 py-6">
            <h2 className="text-title text-primary">Horários da semana</h2>
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
                      {day.items.map((item) => {
                        const ActivityIcon = ACTIVITY_ICONS[item.type];
                        return (
                          <li key={`${item.time}-${item.description}`} className="flex items-start gap-2 text-base">
                            <ActivityIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" />
                            <span>
                              <span className="font-semibold">{formatTime(item.time)}</span> — {item.description}
                              {item.celebrant && ` (${item.celebrant})`}
                              {item.note && <span className="block text-sm text-foreground/70">{item.note}</span>}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section id="eventos" className="scroll-mt-24 bg-surface-muted px-4 py-6">
            <h2 className="text-title text-primary">Próximos eventos</h2>
            {upcomingEvents.length === 0 ? (
              <p className="mt-2 text-base text-foreground/60">Nenhum evento programado no momento.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {upcomingEvents.map((event) => (
                  <li
                    key={event.id}
                    className="hover-lift flex flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-card sm:flex-row sm:items-center sm:justify-between"
                  >
                    <Link href={`/events/${event.id}`} className="block rounded-xl">
                      <p className="font-semibold text-primary">
                        {event.featured && <span className="mr-1 text-accent">★</span>}
                        {event.name}
                      </p>
                      <p className="text-base">{formatEventDateTime(event.startAt)}</p>
                      {event.sellsCards && event.cardPrice != null && (
                        <p className="text-sm text-foreground/70">Cartela: {formatCurrency(event.cardPrice)}</p>
                      )}
                    </Link>

                    {event.sellsCards && event.cardPrice != null && (
                      <Link
                        href={`/events/${event.id}`}
                        className="btn btn-confirm shrink-0 self-start sm:self-center"
                      >
                        Comprar cartela
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id="como-chegar" className="scroll-mt-24 px-4 py-8">
            <h2 className="text-title text-primary">Como chegar</h2>
            <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center">
              <div className="md:w-1/2">
                <p className="text-base">{CHAPEL_ADDRESS}</p>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-base font-semibold text-primary-light underline"
                >
                  Abrir no Google Maps
                </a>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-card md:w-1/2">
                <iframe
                  src={MAPS_EMBED_SRC}
                  title="Mapa com a localização da Capela Nossa Senhora Aparecida"
                  loading="lazy"
                  className="h-full w-full"
                />
              </div>
            </div>
          </section>
      </PageShell>
      <ScheduleScrollIndicator sections={scrollIndicatorSections} />
    </>
  );
}
