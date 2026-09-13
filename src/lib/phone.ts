// Formato canônico: só dígitos, com DDI (55). Ex: 5542999998888.

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}

export function isValidPhone(phone: string): boolean {
  return /^55\d{10,11}$/.test(phone);
}

export function formatPhone(phone: string): string {
  const match = phone.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  if (!match) return phone;
  const [, ddd, prefix, suffix] = match;
  return `(${ddd}) ${prefix}-${suffix}`;
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
