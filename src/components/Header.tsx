"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#capela", label: "A Capela" },
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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-primary/95 shadow-lifted backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href={nav === "home" ? "#inicio" : "/#inicio"}
          className="flex min-w-0 shrink-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/20 text-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-5 w-5">
              <path d="M12 3v18" />
              <path d="M7 8h10" />
            </svg>
          </span>
          <span className="truncate text-base font-bold text-white sm:text-lg">
            Capela Nossa Senhora Aparecida
          </span>
        </a>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={nav === "home" ? link.href : `/${link.href}`}
              className="text-sm font-semibold text-white/85 transition-colors hover:text-accent"
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
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center text-white lg:hidden"
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-6 w-6">
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-6 w-6">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 pb-4 lg:hidden" aria-label="Navegação para celular">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={nav === "home" ? link.href : `/${link.href}`}
              onClick={() => setMenuOpen(false)}
              className="min-h-11 rounded-md px-3 py-3 text-sm font-semibold text-white/90 transition-colors duration-150 hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
