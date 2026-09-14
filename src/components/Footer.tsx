import { CHAPEL_ADDRESS, FACEBOOK_LINK, INSTAGRAM_LINK, MAPS_LINK } from "@/lib/location";
import { FacebookIcon, InstagramIcon } from "@/components/social-icons";

export function Footer() {
  return (
    <footer className="mt-10 rounded-t-3xl bg-primary px-4 py-8 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
        <p className="text-lg font-bold">Capela Nossa Senhora Aparecida</p>
        <p className="text-base text-white/80">{CHAPEL_ADDRESS}</p>
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-semibold text-accent underline"
        >
          Abrir no Google Maps
        </a>

        <div className="mt-2 flex gap-4">
          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da capela"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 text-white hover:border-accent hover:text-accent"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={FACEBOOK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook da capela"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 text-white hover:border-accent hover:text-accent"
          >
            <FacebookIcon className="h-5 w-5" />
          </a>
        </div>

        <p className="mt-4 text-sm text-white/60">
          Sob a proteção de Nossa Senhora Aparecida, padroeira do Brasil.
        </p>
      </div>
    </footer>
  );
}
