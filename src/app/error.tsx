"use client";

import { useEffect } from "react";

import { PageShell } from "@/components/PageShell";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell nav="inner">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="text-display text-primary">Algo deu errado</h1>
        <p className="text-lg text-foreground/70">
          Não conseguimos carregar esta página. Tente de novo em alguns instantes.
        </p>
        <button type="button" onClick={reset} className="btn btn-confirm mt-2 px-6 py-3 text-lg">
          Tentar de novo
        </button>
      </div>
    </PageShell>
  );
}
