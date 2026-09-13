// Rate limit em memória, por instância do processo. Suficiente para o volume
// desse site (não é infra distribuída), mas não é consistente entre múltiplas
// instâncias serverless simultâneas — se isso virar problema real, trocar por
// um store externo (ex. Upstash Redis).
const attempts = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(key, recent);
    return true;
  }

  recent.push(now);
  attempts.set(key, recent);
  return false;
}
