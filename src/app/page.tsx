import { and, asc, gte, isNotNull, or } from "drizzle-orm";
import Image from "next/image";

import capelaPhoto from "@/assets/capela.jpg";
import catequistasPhoto from "@/assets/catequistas.jpeg";
import grupoDeJovensPhoto from "@/assets/grupo_de_jovens_2.jpg";
import grupoDeOracaoPhoto from "@/assets/grupo_de_oracao.jpg";
import interiorCapelaPhoto from "@/assets/interior-capela.jpg";
import santaMissaPhoto from "@/assets/santa_missa.jpg";
import { db } from "@/db";
import { events } from "@/db/schema";
import { EventCard } from "@/components/EventCard";
import { WaveDivider } from "@/components/WaveDivider";
import {
  ACTIVITY_ICONS,
  CatechismIcon,
  ChevronRightIcon,
  MassIcon,
  PrayerGroupIcon,
  YouthGroupIcon,
} from "@/components/icons";
import { MinistryCard } from "@/components/MinistryCard";
import { PageShell } from "@/components/PageShell";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui";
import {
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
  todayInSaoPaulo,
  type ScheduleOccurrence,
} from "@/lib/schedules";

const YOUTH_GROUP_SCHEDULE_LABEL = "2º sábado do mês · 18h";

const ABOUT_TEXT =
  "A Capela Nossa Senhora Aparecida é um espaço de fé, acolhida e comunidade no bairro Boa Vista, em Ponta Grossa. Aqui celebramos a Santa Missa, rezamos juntos e cuidamos da formação de crianças, jovens e adultos na caminhada da fé — sempre sob o olhar de Nossa Senhora Aparecida.";

export const revalidate = 300;

const WEEKDAY_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTH_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// "Hoje" / "Amanhã" — quem abre no pátio quer saber se é hoje, sem fazer conta.
function relativeDayLabel(isoDate: string): string | null {
  const today = todayInSaoPaulo();
  const [year, month, day] = isoDate.split("-").map(Number);
  const diff = Math.round(
    (Date.UTC(year, month - 1, day) - Date.UTC(today.year, today.month - 1, today.day)) / 86_400_000,
  );
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  return null;
}

// Card da próxima missa em forma de folhinha de calendário: a coluna dourada
// é a data, o horário grande ao lado é o que se procura primeiro.
function NextMassCard({ mass }: { mass: ScheduleOccurrence }) {
  const [, month, day] = mass.date.split("-").map(Number);
  const relative = relativeDayLabel(mass.date);

  return (
    <aside
      aria-label="Próxima Santa Missa"
      className="overflow-hidden rounded-2xl bg-primary-dark/85 text-left text-white shadow-lifted ring-1 ring-white/10 backdrop-blur-md"
    >
      <div className="flex">
        <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-accent py-5 text-primary-dark">
          <span className="text-body font-semibold">{WEEKDAY_SHORT[mass.weekday]}</span>
          <span className="text-5xl leading-none font-bold tabular-nums">{String(day).padStart(2, "0")}</span>
          <span className="text-body">{MONTH_SHORT[month - 1]}</span>
        </div>

        <div className="min-w-0 flex-1 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-body font-semibold text-accent">Próxima Santa Missa</h2>
            {relative && (
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-caption font-semibold">{relative}</span>
            )}
          </div>
          <p className="mt-1 text-6xl leading-none font-bold tabular-nums">{formatTime(mass.time)}</p>
          <p className="mt-3 flex items-center gap-2 text-body text-white/85">
            <MassIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-accent" />
            <span className="truncate">
              {mass.celebrant ? mass.celebrant : "Celebrante a definir"}
            </span>
          </p>
          <p className="sr-only">
            {WEEKDAY_LABELS[mass.weekday]}, {formatShortDate(mass.date)}
          </p>
        </div>
      </div>

      {mass.note && (
        <p className="border-t border-white/10 px-5 py-2.5 text-body text-white/80 italic">{mass.note}</p>
      )}

      <a
        href="#horarios"
        className="flex min-h-12 items-center justify-between border-t border-white/10 px-5 font-semibold text-white/90 transition-colors duration-150 hover:bg-white/5 hover:text-accent"
      >
        Ver todos os horários da semana
        <ChevronRightIcon className="h-[1.125rem] w-[1.125rem]" />
      </a>
    </aside>
  );
}

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
  const massTimeLabel = highlights.mass[0] ? `às ${formatTime(highlights.mass[0].time)}` : "— consulte o mural";
  const prayerGroupLabel = highlights.prayer_group[0]
    ? `${WEEKDAY_LABELS[highlights.prayer_group[0].weekday]} · ${formatTime(highlights.prayer_group[0].time)}`
    : "Consulte o mural da capela";
  const catechismLabel = highlights.catechism.length
    ? formatWeekdayList(highlights.catechism.map((h) => h.weekday))
    : "Consulte o mural da capela";

  return (
      <PageShell
        hero={
          <section
            id="inicio"
            className="photo-vignette photo-vignette-light relative col-start-1 row-start-1 flex min-h-[88vh] w-full items-end overflow-hidden pt-20 sm:rounded-t-3xl"
          >
            <Image
              src={capelaPhoto}
              alt="Fachada da Capela Nossa Senhora Aparecida"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-[#152F57] via-[#152F57]/40 to-transparent"
            />
            <div className="relative z-10 grid w-full items-end gap-8 px-4 pb-12 sm:px-6 md:grid-cols-[minmax(0,1fr)_22rem] md:pb-16">
              <div className="text-center md:text-left">
                <p className="mb-3 flex items-center justify-center gap-2 text-caption font-bold uppercase tracking-widest text-accent md:justify-start">
                  Uma comunidade que acolhe
                </p>
                <h1 className="text-display leading-[1.05] text-white sm:text-5xl md:text-6xl">
                  Capela Nossa Senhora Aparecida
                </h1>
                <p className="mt-4 text-lg text-white/90">Boa Vista, Ponta Grossa - PR</p>
                <a
                  href="#capela"
                  className="mt-6 inline-flex items-center gap-2 text-caption font-bold uppercase tracking-widest text-white hover:text-accent"
                >
                  Conheça nossa capela
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </a>
              </div>

              {nextMass && <NextMassCard mass={nextMass} />}
            </div>
          </section>
        }
      >
          {isPatronessFeastWindow() && (
            <div className="mx-3 mt-3 rounded-2xl bg-primary px-4 py-3 text-center text-white shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">12 de outubro</p>
              <p className="text-base font-semibold">Dia de Nossa Senhora Aparecida, padroeira do Brasil</p>
            </div>
          )}

          <WaveDivider className="text-[#152F57]" />

          <section id="capela" className="scroll-mt-24 px-4 py-10">
            <div className="grid gap-6 md:grid-cols-[1.08fr_0.92fr] md:items-center md:gap-10">
              <div className="overflow-hidden rounded-3xl shadow-card">
                <div className="photo-vignette relative aspect-4/5 w-full md:aspect-5/4">
                  <Image
                    src={interiorCapelaPhoto}
                    alt="Comunidade reunida para a Santa Missa no interior da capela"
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="border-t-4 border-accent bg-primary px-5 py-4 text-white">
                  <p className="text-subtitle font-semibold">Uma casa de fé e encontro</p>
                </div>
              </div>
              <div>
                <p className="eyebrow text-accent-dark">Nossa comunidade</p>
                <h2 className="mt-2 text-title text-primary sm:text-3xl">A Capela começa pelas pessoas</h2>
                <p className="mt-4 text-lg leading-relaxed">{ABOUT_TEXT}</p>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
                  <div>
                    <p className="text-title text-primary">Domingo</p>
                    <p className="text-caption text-foreground/70">Santa Missa {massTimeLabel}</p>
                  </div>
                  <div>
                    <p className="text-title text-primary">Todos</p>
                    <p className="text-caption text-foreground/70">são bem-vindos</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pt-2 pb-4">
            <p className="eyebrow text-accent-dark">Vida comunitária</p>
            <h2 className="mt-1 text-title text-primary sm:text-3xl">Pastorais e grupos</h2>

            <Carousel ariaLabel="Pastorais e grupos" opts={{ align: "start", loop: true }} className="mt-6">
              <CarouselContent>
                <CarouselItem className="basis-[88%] sm:basis-1/2 lg:basis-[42%]">
                  <MinistryCard
                    id="santa-missa"
                    title="Santa Missa"
                    description="Venha conhecer e participar da Santa Missa com a nossa comunidade."
                    scheduleLabel={massLabel}
                    Icon={MassIcon}
                    photo={{ src: santaMissaPhoto, alt: "Celebração da Santa Missa na Capela Nossa Senhora Aparecida" }}
                    tone="primary-light"
                  />
                </CarouselItem>
                <CarouselItem className="basis-[88%] sm:basis-1/2 lg:basis-[42%]">
                  <MinistryCard
                    id="grupo-oracao"
                    title="Grupo de Oração Porta do Céu"
                    description="Venha louvar com a gente no Grupo de Oração Porta do Céu."
                    scheduleLabel={prayerGroupLabel}
                    Icon={PrayerGroupIcon}
                    photo={{ src: grupoDeOracaoPhoto, alt: "Encontro do Grupo de Oração Porta do Céu", position: "top" }}
                    instagram={PRAYER_GROUP_INSTAGRAM}
                    tone="accent"
                  />
                </CarouselItem>
                <CarouselItem className="basis-[88%] sm:basis-1/2 lg:basis-[42%]">
                  <MinistryCard
                    id="catequese"
                    title="Catequese"
                    description="Coloque seu filho na catequese e venha fazer parte dessa caminhada de fé."
                    scheduleLabel={catechismLabel}
                    Icon={CatechismIcon}
                    photo={{ src: catequistasPhoto, alt: "Equipe de catequistas da Capela Nossa Senhora Aparecida" }}
                    tone="primary-light"
                  />
                </CarouselItem>
                <CarouselItem className="basis-[88%] sm:basis-1/2 lg:basis-[42%]">
                  <MinistryCard
                    id="grupo-jovens"
                    title="Grupo de Jovens Aos Pés da Cruz"
                    description="Venha participar do Grupo de Jovens da nossa comunidade e nos conhecer."
                    scheduleLabel={YOUTH_GROUP_SCHEDULE_LABEL}
                    Icon={YouthGroupIcon}
                    photo={{ src: grupoDeJovensPhoto, alt: "Grupo de Jovens Aos Pés da Cruz reunido na capela", position: "top" }}
                    instagram={YOUTH_GROUP_INSTAGRAM}
                    tone="accent"
                  />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:-left-4" />
              <CarouselNext className="right-2 sm:-right-4" />
            </Carousel>
          </section>

          <section id="horarios" className="scroll-mt-24 px-4 py-8">
            <h2 className="text-title text-primary">Horários da semana</h2>
            <div className="mt-4 divide-y divide-white/10 rounded-3xl bg-primary p-5 text-white shadow-lifted sm:p-6">
              {week.map((day) => (
                <div key={day.date} className="py-4 first:pt-0 last:pb-0">
                  <p className="font-semibold text-accent">
                    {WEEKDAY_LABELS[day.weekday]} · {formatShortDate(day.date)}
                  </p>
                  {day.items.length === 0 ? (
                    <p className="mt-1 text-base text-white/70">Sem atividades programadas.</p>
                  ) : (
                    <ul className="mt-2 flex flex-col gap-2">
                      {day.items.map((item) => {
                        const ActivityIcon = ACTIVITY_ICONS[item.type];
                        return (
                          <li key={`${item.time}-${item.description}`} className="flex items-start gap-2 text-base">
                            <ActivityIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                            <span>
                              <span className="font-semibold">{formatTime(item.time)}</span> — {item.description}
                              {item.celebrant && ` (${item.celebrant})`}
                              {item.note && <span className="block text-sm text-white/70">{item.note}</span>}
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

          <section id="eventos" className="scroll-mt-24 px-4 py-8">
            <h2 className="text-title text-primary">Próximos eventos</h2>
            {upcomingEvents.length === 0 ? (
              <p className="mt-2 text-base text-foreground/70">Nenhum evento programado no momento.</p>
            ) : (
              <div className="mt-4 rounded-3xl bg-water-texture p-5 shadow-lifted sm:p-6">
                <Carousel ariaLabel="Próximos eventos" opts={{ align: "start", loop: true }}>
                  <CarouselContent>
                    {upcomingEvents.map((event) => (
                      <CarouselItem key={event.id} className="basis-[85%] sm:basis-1/2 lg:basis-[42%]">
                        <EventCard event={event} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 sm:-left-4" />
                  <CarouselNext className="right-2 sm:-right-4" />
                </Carousel>
              </div>
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
  );
}
