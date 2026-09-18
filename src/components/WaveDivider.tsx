export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 24"
      preserveAspectRatio="none"
      className={`h-12 w-[110%] ${className}`}
    >
      <path
        fill="currentColor"
        d="
          M0 0
          H200
          V12
          Q175 2 150 12
          T100 12
          T50 12
          T0 12
          Z
        "
      />
    </svg>
  );
}
