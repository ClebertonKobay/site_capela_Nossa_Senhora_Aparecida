"use client";

import { useState } from "react";

import { formatCurrency } from "@/lib/format";
import { buildCardOrderMessage } from "@/lib/order-message";
import { whatsappLink } from "@/lib/phone";

const MAX_QUANTITY = 50;

export function BuyCards({
  eventId,
  eventName,
  whatsappPhone,
  cardPriceCents,
}: {
  eventId: number;
  eventName: string;
  whatsappPhone: string;
  cardPriceCents: number | null;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cardPriceCents != null ? cardPriceCents * quantity : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, name, phone, quantity }),
    });

    if (!res.ok) {
      setLoading(false);
      setError("Não deu pra registrar o pedido agora. Tente novamente em alguns minutos.");
      return;
    }

    // Só abre o WhatsApp depois de gravar — se desistir no meio, o
    // pedido já existe e a comissão da festa consegue ligar de volta.
    const message = buildCardOrderMessage(eventName, quantity, cardPriceCents);
    window.location.href = whatsappLink(whatsappPhone, message);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="buyer-name" className="block text-base font-semibold text-primary">
          Nome
        </label>
        <input
          id="buyer-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field mt-1"
        />
      </div>

      <div>
        <label htmlFor="buyer-phone" className="block text-base font-semibold text-primary">
          Seu telefone
        </label>
        <input
          id="buyer-phone"
          required
          placeholder="(42) 99999-8888"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="field mt-1"
        />
      </div>

      <div>
        <p className="text-base font-semibold text-primary">Quantidade</p>
        <div className="mt-1 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Diminuir quantidade"
            className="btn btn-secondary !min-w-11 !px-0 text-2xl font-bold"
          >
            −
          </button>
          <span className="min-w-8 text-center text-xl font-bold text-primary">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            aria-label="Aumentar quantidade"
            className="btn btn-secondary !min-w-11 !px-0 text-2xl font-bold"
          >
            +
          </button>
        </div>
      </div>

      {total != null && <p className="text-lg font-semibold text-primary">Total: {formatCurrency(total)}</p>}

      {error && <p className="text-body font-semibold text-danger">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-confirm px-6 py-3 text-lg"
      >
        {loading ? "Enviando..." : "Comprar pelo WhatsApp"}
      </button>
    </form>
  );
}
