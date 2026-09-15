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
    <main className="flex flex-1 flex-col items-center justify-center bg-sky px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-background p-6 shadow-lifted">
        <h1 className="text-title text-primary">Painel da Capela</h1>
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
          className="field mt-1"
        />
        {error && <p className="mt-2 text-body font-semibold text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-confirm mt-4 w-full text-lg"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
