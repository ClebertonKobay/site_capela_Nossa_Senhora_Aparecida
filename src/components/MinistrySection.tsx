import Image, { type StaticImageData } from "next/image";
import type { ComponentType } from "react";

import { InstagramIcon } from "@/components/icons";

type Tone = "primary-light" | "accent";

const ICON_PANEL_CLASSES: Record<Tone, string> = {
  "primary-light": "bg-primary-light/15 text-primary",
  accent: "bg-accent/15 text-accent",
};

const SILL_CLASSES: Record<Tone, string> = {
  "primary-light": "bg-primary",
  accent: "bg-accent",
};

type Photo = { src: StaticImageData; alt: string; position?: "center" | "top" };

export function MinistrySection({
  id,
  title,
  description,
  scheduleLabel,
  Icon,
  photo,
  instagram,
  reverse,
  tone,
}: {
  id: string;
  title: string;
  description: string;
  scheduleLabel: string;
  Icon?: ComponentType<{ className?: string }>;
  photo?: Photo;
  instagram?: string;
  reverse: boolean;
  tone: Tone;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-4 py-8 ${reverse ? "md:flex-row-reverse" : "md:flex-row"} flex flex-col gap-6 md:items-center`}
    >
      <div className="w-full overflow-hidden rounded-t-2xl rounded-b-3xl border border-primary/15 bg-background shadow-xl md:w-1/3">
        {photo ? (
          <div className="photo-vignette hover-grow relative aspect-square w-full">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className={`object-cover ${photo.position === "top" ? "object-top" : "object-center"}`}
            />
          </div>
        ) : (
          <div className={`flex aspect-square w-full items-center justify-center ${ICON_PANEL_CLASSES[tone]}`}>
            {Icon && <Icon className="h-24 w-24" />}
          </div>
        )}
        <div className={`h-4 sm:h-5 ${SILL_CLASSES[tone]}`} />
      </div>
      <div className="md:w-2/3">
      <div>

        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        <p className="mt-2 text-lg">{description}</p>
        <p className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-body font-semibold text-white shadow-card">
          {scheduleLabel}
        </p>
      </div>
      <div>
        {instagram && (
          <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-2 text-body font-semibold text-primary-light transition-colors hover:text-accent-dark"
          >
            <InstagramIcon className="h-5 w-5" />
            Seguir no Instagram
          </a>
        )}
        </div>
      </div>
    </section>
  );
}
