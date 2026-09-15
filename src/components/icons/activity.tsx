import type { ComponentType } from "react";

export function MassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 3h10" />
      <path d="M7 3c0 4.5 2 7 5 7s5-2.5 5-7" />
      <path d="M12 10v7" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

export function PrayerGroupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v16" />
      <path d="M12 3c-3 1-4 5-3 9 1 3 2 5 3 6" />
      <path d="M12 3c3 1 4 5 3 9-1 3-2 5-3 6" />
      <path d="M7 12c-1 2-1 4 0 6" />
      <path d="M17 12c1 2 1 4 0 6" />
    </svg>
  );
}

export function CatechismIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 6c-1.5-1.5-4-2-7-1.5v13c3-.5 5.5 0 7 1.5 1.5-1.5 4-2 7-1.5v-13c-3-.5-5.5 0-7 1.5Z" />
      <path d="M12 6v13" />
    </svg>
  );
}

export function YouthGroupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="7" r="2.5" />
      <circle cx="16" cy="8.5" r="2" />
      <path d="M4 20c0-3.3 2.2-5.5 5-5.5s5 2.2 5 5.5" />
      <path d="M14.5 15c2.2.3 3.5 2 3.5 5" />
    </svg>
  );
}

export function RosaryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8.5" r="5.5" strokeDasharray="1.4 2.6" />
      <path d="M12 14v7" />
      <path d="M9.5 17.5h5" />
    </svg>
  );
}

export function NovenaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3c1.2 1.6 1.2 2.9 0 4.2-1.2-1.3-1.2-2.6 0-4.2Z" />
      <rect x="9" y="8" width="6" height="12" rx="1" />
      <path d="M9 12h6" />
    </svg>
  );
}

export const ACTIVITY_ICONS: Record<
  "mass" | "rosary" | "novena" | "prayer_group" | "catechism",
  ComponentType<{ className?: string }>
> = {
  mass: MassIcon,
  rosary: RosaryIcon,
  novena: NovenaIcon,
  prayer_group: PrayerGroupIcon,
  catechism: CatechismIcon,
};
