import Image, { type StaticImageData } from "next/image";
import type { ComponentType } from "react";

import { InstagramIcon } from "@/components/icons";

type Tone = "primary-light" | "accent";

const ICON_PANEL_CLASSES: Record<Tone, string> = {
  "primary-light": "bg-primary-light/15 text-primary",
  accent: "bg-accent/15 text-accent-dark",
};

type Photo = { src: StaticImageData; alt: string; position?: "center" | "top" };

export function MinistryCard({
  id,
  title,
  description,
  scheduleLabel,
  Icon,
  photo,
  instagram,
  tone,
}: {
  id: string;
  title: string;
  description: string;
  scheduleLabel: string;
  Icon?: ComponentType<{ className?: string }>;
  photo?: Photo;
  instagram?: string;
  tone: Tone;
}) {
  return (
    <div id={id} className="scroll-mt-24 flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="photo-vignette relative aspect-4/3 w-full overflow-hidden">
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 33vw, 85vw"
            className={`object-cover ${photo.position === "top" ? "object-top" : "object-center"}`}
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${ICON_PANEL_CLASSES[tone]}`}>
            {Icon && <Icon className="h-16 w-16" />}
          </div>
        )}
        {photo && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-primary-dark via-primary-dark/10 to-transparent"
          />
        )}
        <p className="absolute inset-x-0 bottom-0 p-4 text-subtitle font-bold text-white">{title}</p>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-3 text-body text-foreground/80">{description}</p>

        {/* Horário com o ícone da atividade — o ícone ajuda a achar de relance
            "quando é a missa", "quando é a catequese". */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border pt-3">
          <p className="flex items-center gap-2 font-semibold text-primary">
            {Icon && (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-accent">
                <Icon className="h-[1.125rem] w-[1.125rem]" />
              </span>
            )}
            {scheduleLabel}
          </p>
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary-light hover:text-accent-dark"
            >
              <InstagramIcon className="h-[1.125rem] w-[1.125rem]" />
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
