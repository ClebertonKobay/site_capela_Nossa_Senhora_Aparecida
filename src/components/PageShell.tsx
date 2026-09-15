import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

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
    <div className="min-h-screen bg-sky-texture">
      <div className="mx-2 mt-2 flex flex-col bg-background shadow-lifted sm:mx-4 sm:mt-4 sm:rounded-t-3xl lg:mx-auto lg:w-[90%] overflow-hidden">
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
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
