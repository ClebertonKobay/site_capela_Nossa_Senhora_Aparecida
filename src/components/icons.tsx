// Ícones simples em SVG inline, sem lib externa — traço geométrico, no
// estilo "recorte de mural", não ilustração realista.
import type { ComponentType } from "react";

export function MassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <path d="M32 6v20M22 12h20" strokeLinecap="round" />
      <path
        d="M20 30c0 8 5 12 12 12s12-4 12-12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18 58c2-10 8-16 14-16s12 6 14 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 58h36" strokeLinecap="round" />
    </svg>
  );
}

export function PrayerGroupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <path
        d="M32 12c-4 6-4 12 0 16 4-4 4-10 0-16Z"
        strokeLinejoin="round"
      />
      <path
        d="M18 42c2-8 7-13 14-13s12 5 14 13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20 42v6c0 6 5 10 12 10s12-4 12-10v-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 58h36" strokeLinecap="round" />
    </svg>
  );
}

export function CatechismIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <path
        d="M32 18c-4-4-11-6-18-4v30c7-2 14 0 18 4 4-4 11-6 18-4V14c-7-2-14 0-18 4Z"
        strokeLinejoin="round"
      />
      <path d="M32 18v30" strokeLinecap="round" />
    </svg>
  );
}

export function YouthGroupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <path d="M32 6v34M20 16h24" strokeLinecap="round" />
      <circle cx="22" cy="46" r="6" />
      <circle cx="42" cy="46" r="6" />
      <path d="M12 58c1-6 5-9 10-9s9 3 10 9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 58c1-6 5-9 10-9s9 3 10 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RosaryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <circle cx="32" cy="24" r="16" strokeDasharray="3 6" strokeLinecap="round" />
      <path d="M32 40v8M28 56h8M32 48v8" strokeLinecap="round" />
    </svg>
  );
}

export function NovenaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <path d="M32 6c4 5 4 9 0 13-4-4-4-8 0-13Z" strokeLinejoin="round" />
      <rect x="23" y="19" width="18" height="37" rx="2" />
      <path d="M23 38h18" />
    </svg>
  );
}

// Ícone por tipo de atividade (mesmos tipos de celebration_type no schema),
// usado na grade de horários da semana pra ficar mais visual/escaneável.
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
