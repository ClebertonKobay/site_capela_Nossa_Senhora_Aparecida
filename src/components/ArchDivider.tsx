const ARCH_COUNT = 8;
const ARCH_WIDTH = 40;

// Fileira decorativa de arcos, ecoando as janelas em arco da própria
// fachada da capela — divisor sutil entre seções, sem custo de imagem.
export function ArchDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${ARCH_COUNT * ARCH_WIDTH} 24`}
      preserveAspectRatio="none"
      className={`h-6 w-full text-primary-light/30 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {Array.from({ length: ARCH_COUNT }, (_, i) => {
        const x = i * ARCH_WIDTH + 4;
        return (
          <path key={x} d={`M${x} 24V12c0-7 3.5-11 8-11s8 4 8 11v12`} strokeLinecap="round" />
        );
      })}
    </svg>
  );
}
