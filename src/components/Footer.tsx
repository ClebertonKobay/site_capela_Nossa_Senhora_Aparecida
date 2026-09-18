import { CHAPEL_ADDRESS, FACEBOOK_LINK, INSTAGRAM_LINK, MAPS_LINK } from "@/lib/location";
import { FacebookIcon, InstagramIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="mt-10 rounded-t-3xl bg-primary-dark px-4 py-12 text-center text-white sm:px-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="h-6 w-6 text-accent"
        >
          <path d="M12 3v18" />
          <path d="M7 8h10" />
        </svg>

        <p className="max-w-md text-lg italic leading-relaxed text-accent sm:text-xl">
          &ldquo;Ó incomparável Senhora da Conceição Aparecida, acolhei-nos em vosso manto.&rdquo;
        </p>

        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-lg font-bold">Capela Nossa Senhora Aparecida</p>
          <p className="text-base text-white/70">{CHAPEL_ADDRESS}</p>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-accent underline"
          >
            Abrir no Google Maps
          </a>
        </div>

        <div className="mt-2 flex gap-4">
          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da capela"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 text-white transition-colors duration-150 hover:border-accent hover:text-accent"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={FACEBOOK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook da capela"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 text-white transition-colors duration-150 hover:border-accent hover:text-accent"
          >
            <FacebookIcon className="h-5 w-5" />
          </a>
        </div>

        <p className="mt-4 text-sm text-white/50">
          Capela Nossa Senhora Aparecida · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
