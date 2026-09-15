"use client";

import { useState } from "react";

import { buildCardOrderMessage } from "@/lib/order-message";
import { isValidPhone, normalizePhone, whatsappLink } from "@/lib/phone";
import { Button, Checkbox, Input } from "@/components/ui";

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

      <Input
        label="Nome da festa"
        id="name"
        name="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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
          <Input
            label="Início"
            id="startAt"
            type="datetime-local"
            name="startAt"
            required
            defaultValue={defaultValues?.startAt}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Fim (opcional)"
            id="endAt"
            type="datetime-local"
            name="endAt"
            defaultValue={defaultValues?.endAt}
          />
        </div>
      </div>

      <Input label="Local" id="location" name="location" defaultValue={defaultValues?.location} />

      <Input
        label="Telefone do WhatsApp"
        id="whatsappPhone"
        name="whatsappPhone"
        required
        placeholder="(42) 99999-8888"
        value={phoneInput}
        onChange={(e) => setPhoneInput(e.target.value)}
      />

      <Input
        label="Preço da cartela (R$)"
        id="cardPrice"
        name="cardPrice"
        inputMode="decimal"
        placeholder="10,00"
        value={priceInput}
        onChange={(e) => setPriceInput(e.target.value)}
      />

      <Checkbox name="sellsCards" defaultChecked={defaultValues?.sellsCards} label="Vende cartela?" />

      <Checkbox name="featured" defaultChecked={defaultValues?.featured} label="Destacar na home?" />

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
          <Button type="button" disabled>
            Testar no WhatsApp
          </Button>
        )}
        <p className="mt-1 text-sm text-foreground/70">{phoneHint(normalizedPhone)}</p>
        <p className="mt-2 text-sm text-foreground/70 italic">&quot;{previewMessage}&quot;</p>
      </div>

      <Button type="submit" className="px-4 py-3 text-lg">
        Salvar
      </Button>
    </form>
  );
}
