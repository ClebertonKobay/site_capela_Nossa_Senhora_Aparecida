"use client";

import { useEffect, useState } from "react";

export function ScheduleScrollIndicator({
  sections,
}: {
  sections: { id: string; title: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        }
        const active = sections.find((section) => intersecting.has(section.id));
        setActiveId(active?.id ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const active = sections.find((section) => section.id === activeId);
  if (!active) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 rounded-t-3xl border-t-4 border-accent bg-primary px-4 py-3 text-white shadow-xl
        md:inset-x-auto md:top-1/2 md:right-4 md:bottom-auto md:w-56 md:-translate-y-1/2 md:rounded-3xl md:border-4 md:border-t-4 md:border-accent md:px-4 md:py-4"
    >
      <p className="text-sm text-white/70">{active.title}</p>
      <p className="text-lg font-bold">{active.label}</p>
    </div>
  );
}
