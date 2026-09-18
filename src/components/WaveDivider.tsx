export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 24"
      preserveAspectRatio="none"
      className={`h-6 w-full text-primary-light/25 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M0 12 Q 25 2 50 12 T 100 12 T 150 12 T 200 12"
        strokeLinecap="round"
      />
    </svg>
  );
}
