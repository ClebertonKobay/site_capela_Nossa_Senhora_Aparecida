import Link from "next/link";

import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell nav="inner">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="text-display text-primary">Página não encontrada</h1>
        <p className="text-lg text-foreground/70">Esse endereço não existe ou o conteúdo foi removido.</p>
        <Link href="/" className="btn btn-confirm mt-2 px-6 py-3 text-lg">
          Voltar para a home
        </Link>
      </div>
    </PageShell>
  );
}
