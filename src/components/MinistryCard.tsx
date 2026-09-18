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
            className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/10 to-transparent"
          />
        )}
        <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary shadow-card">
          {Icon && <Icon className="h-5 w-5" />}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-subtitle font-bold">{title}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-body text-foreground/80">{description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-full bg-primary px-3 py-1.5 text-caption font-semibold text-white">
            {scheduleLabel}
          </span>
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 text-caption font-semibold text-primary-light hover:text-accent-dark"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
