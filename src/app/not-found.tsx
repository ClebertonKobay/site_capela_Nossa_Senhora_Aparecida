import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-primary">Página não encontrada</h1>
      <p className="text-lg text-foreground/70">Esse endereço não existe ou o conteúdo foi removido.</p>
      <Link
        href="/"
        className="mt-2 min-h-11 bg-accent px-6 py-3 text-lg font-semibold text-primary"
      >
        Voltar para a home
      </Link>
    </main>
  );
}
