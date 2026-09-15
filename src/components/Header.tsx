"use client";

import { useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-3 left-3 right-3 z-40 rounded-2xl border-b-2 border-accent bg-white text-primary shadow-lifted lg:left-1/2 lg:right-auto lg:w-full lg:max-w-4xl lg:-translate-x-1/2">
      <div className="flex items-center gap-4 px-4">
        <a
          href={nav === "home" ? "#inicio" : "/#inicio"}
          className="flex min-h-11 shrink-0 items-center text-base font-bold text-primary"
          onClick={() => setMenuOpen(false)}
        >
          Capela N. Sra. Aparecida
        </a>

        {/* Desktop */}
        <nav className="hidden min-w-0 flex-1 gap-4 overflow-x-auto whitespace-nowrap py-2 md:flex" aria-label="Navegação principal">
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

        {/* Mobile */}
        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-auto flex min-h-11 min-w-11 items-center justify-center text-primary md:hidden"
        >
          {menuOpen ? (
            <span className="text-2xl leading-none">×</span>
          ) : (
            <span className="text-2xl leading-none">☰</span>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-primary/10 px-4 pb-2 md:hidden" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={nav === "home" ? link.href : `/${link.href}`}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center text-base font-semibold text-primary/70 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
