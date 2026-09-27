import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WavesBackground } from "@/components/WavesBackground";

export function PageShell({
  hero,
  nav = "home",
  children,
}: {
  hero?: ReactNode;
  nav?: "home" | "inner";
  children: ReactNode;
}) {
  return (
    // `isolate` cria o contexto de empilhamento: sem ele o fundo azul deste
    // div é pintado por cima das ondas (-z-10) e elas somem.
    <div className="relative isolate min-h-screen bg-water-texture">
      <WavesBackground />
      <div className="relative mx-2 mt-2 flex flex-col bg-background shadow-lifted sm:mx-4 sm:mt-4 sm:rounded-t-3xl lg:mx-auto lg:w-[90%] overflow-hidden">
        {hero ? (
          <div className="grid">
            {hero}
            <div className="col-start-1 row-start-1 self-start">
              <Header nav={nav} />
            </div>
          </div>
        ) : (
          <Header nav={nav} />
        )}
        <main className={hero ? "flex-1" : "flex-1 pt-20"}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
