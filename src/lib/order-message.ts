import { formatCurrency } from "./format";

// Mesma mensagem usada pelo botão "Testar no WhatsApp" do admin (Fase 5,
// quantidade 1) e pelo fluxo real de compra (Fase 6) — precisam bater.
export function buildCardOrderMessage(
  eventName: string,
  quantity: number,
  unitPriceCents: number | null,
): string {
  const plural = quantity === 1 ? "cartela" : "cartelas";
  let message = `Olá! Quero comprar ${quantity} ${plural} do evento "${eventName}".`;
  if (unitPriceCents != null) {
    message += ` Total: ${formatCurrency(unitPriceCents * quantity)}.`;
  }
  return message;
}
