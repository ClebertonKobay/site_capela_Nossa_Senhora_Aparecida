"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/admin";
      return;
    }

    setLoading(false);
    setError("Senha incorreta.");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-primary px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-background p-6">
        <h1 className="text-xl font-bold text-primary">Acesso administrativo</h1>
        <label htmlFor="password" className="mt-4 block text-base font-semibold text-primary">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 min-h-11 w-full border-2 border-primary-light px-3 py-2 text-base"
        />
        {error && <p className="mt-2 text-base font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 min-h-11 w-full bg-accent px-4 py-2 text-lg font-semibold text-primary disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
