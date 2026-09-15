const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#santa-missa", label: "Missa" },
  { href: "#grupo-oracao", label: "Oração" },
  { href: "#catequese", label: "Catequese" },
  { href: "#grupo-jovens", label: "Jovens" },
  { href: "#eventos", label: "Eventos" },
  { href: "#como-chegar", label: "Chegar" },
] as const;

export function Header({ nav = "home" }: { nav?: "home" | "inner" }) {
  return (
    <header className="sticky top-3 z-40 mx-3 mt-3 rounded-2xl border-b-2 border-accent bg-white text-primary shadow-lifted lg:mx-auto lg:max-w-4xl">
      <div className="flex items-center gap-4 px-4">
        <a
          href={nav === "home" ? "#inicio" : "/#inicio"}
          className="flex min-h-11 shrink-0 items-center text-base font-bold text-primary"
        >
          Capela N. Sra. Aparecida
        </a>
        <nav className="flex min-w-0 flex-1 gap-4 overflow-x-auto whitespace-nowrap py-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={nav === "home" ? link.href : `/${link.href}`}
              className="flex min-h-11 shrink-0 items-center text-base font-semibold text-primary/70 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
