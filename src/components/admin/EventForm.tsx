"use client";

import { useState } from "react";

import { buildCardOrderMessage } from "@/lib/order-message";
import { isValidPhone, normalizePhone, whatsappLink } from "@/lib/phone";

export type EventFormValues = {
  id?: number;
  name?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  location?: string;
  whatsappPhone?: string;
  cardPrice?: string;
  sellsCards?: boolean;
  featured?: boolean;
};

const inputClass = "field mt-1";
const labelClass = "block text-base font-semibold text-primary";

function phoneHint(normalized: string): string {
  if (isValidPhone(normalized)) return "Abre em nova aba com a mensagem de exemplo.";
  if (normalized.length > 13) return "Telefone com dígitos demais.";
  const missing = 12 - normalized.length;
  return missing > 0 ? `Telefone incompleto — faltam ${missing} dígitos.` : "Telefone inválido.";
}

export function EventForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: EventFormValues;
}) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [phoneInput, setPhoneInput] = useState(defaultValues?.whatsappPhone ?? "");
  const [priceInput, setPriceInput] = useState(defaultValues?.cardPrice ?? "");

  const normalizedPhone = normalizePhone(phoneInput);
  const phoneValid = isValidPhone(normalizedPhone);
  const priceCents = priceInput.trim() ? Math.round(Number(priceInput.replace(",", ".")) * 100) : null;
  const previewMessage = buildCardOrderMessage(
    name.trim() || "(nome do evento)",
    1,
    Number.isFinite(priceCents) ? priceCents : null,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      {defaultValues?.id != null && <input type="hidden" name="id" value={defaultValues.id} />}

      <div>
        <label className={labelClass} htmlFor="name">
          Nome da festa
        </label>
        <input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label className={labelClass} htmlFor="startAt">
            Início
          </label>
          <input
            id="startAt"
            type="datetime-local"
            name="startAt"
            required
            defaultValue={defaultValues?.startAt}
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label className={labelClass} htmlFor="endAt">
            Fim (opcional)
          </label>
          <input
            id="endAt"
            type="datetime-local"
            name="endAt"
            defaultValue={defaultValues?.endAt}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="location">
          Local
        </label>
        <input id="location" name="location" defaultValue={defaultValues?.location} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="whatsappPhone">
          Telefone do WhatsApp
        </label>
        <input
          id="whatsappPhone"
          name="whatsappPhone"
          required
          placeholder="(42) 99999-8888"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="cardPrice">
          Preço da cartela (R$)
        </label>
        <input
          id="cardPrice"
          name="cardPrice"
          inputMode="decimal"
          placeholder="10,00"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
          className={inputClass}
        />
      </div>

      <label className="flex min-h-11 items-center gap-2 text-base">
        <input
          type="checkbox"
          name="sellsCards"
          defaultChecked={defaultValues?.sellsCards}
          className="h-5 w-5"
        />
        Vende cartela?
      </label>

      <label className="flex min-h-11 items-center gap-2 text-base">
        <input type="checkbox" name="featured" defaultChecked={defaultValues?.featured} className="h-5 w-5" />
        Destacar na home?
      </label>

      <div className="border-2 border-primary-light bg-primary/5 p-4">
        {phoneValid ? (
          <a
            href={whatsappLink(normalizedPhone, previewMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-confirm"
          >
            Testar no WhatsApp
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="btn btn-confirm"
          >
            Testar no WhatsApp
          </button>
        )}
        <p className="mt-1 text-sm text-foreground/70">{phoneHint(normalizedPhone)}</p>
        <p className="mt-2 text-sm text-foreground/70 italic">&quot;{previewMessage}&quot;</p>
      </div>

      <button type="submit" className="btn btn-confirm px-4 py-3 text-lg">
        Salvar
      </button>
    </form>
  );
}
