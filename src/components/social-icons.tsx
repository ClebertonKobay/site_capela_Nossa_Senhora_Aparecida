export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path
        d="M13.5 21v-7h2.2l.3-2.6h-2.5v-1.7c0-.75.2-1.3 1.3-1.3h1.4V6.1c-.25 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2h-2.3v2.6h2.3v7"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
