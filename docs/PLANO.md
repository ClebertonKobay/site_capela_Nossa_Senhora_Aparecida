# Plano de construção

Documento vivo. Marque as fases conforme terminar e edite o que mudar de ideia.

---

## Fase 0 — Fundação

- [x] `npx create-next-app@latest` com TypeScript, Tailwind, App Router, `src/`
- [x] Criar projeto no Neon, copiar a connection string
- [x] `.env.local` e `.env.example` com: `DATABASE_URL`, `ADMIN_PASSWORD_HASH_BASE64`, `JWT_SECRET`
- [x] Confirmar que `.env*` está no `.gitignore` (o `.env.example` precisa ser a exceção)
- [x] Instalar: `drizzle-orm`, `@neondatabase/serverless`, `zod`, `jose`, `@node-rs/argon2`
- [x] Dev: `drizzle-kit`, `@types/node`
- [x] Primeiro deploy na Vercel, mesmo com a página em branco — descobrir problema de build no dia 1, não no dia 20

**Gerar o hash da senha** (rodar uma vez, colar o resultado no `.env.local` e nas env vars da Vercel).
Vai em base64 porque o carregador de `.env` do Next.js expande `$nome` como variável — um hash
Argon2id cru, cheio de `$`, vira lixo se colado direto (ver `ADMIN_PASSWORD_HASH_BASE64`):

```bash
node -e "require('@node-rs/argon2').hash('SUA_SENHA_AQUI').then(h => console.log(Buffer.from(h).toString('base64')))"
```

**Gerar o JWT_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Fase 1 — Banco

- [x] Schema Drizzle em `src/db/schema.ts`
- [x] Cliente em `src/db/index.ts`
- [x] Primeira migration aplicada
- [x] Seed com dados reais da capela para não desenvolver no vazio

### Tabelas

**`fixed_schedules`** — a grade semanal que quase nunca muda
`id`, `weekday` (0=domingo), `time`, `description`, `active` (bool)

**`celebrations`** — exceções e escala de celebrante por data
`id`, `date`, `time`, `celebrant` (text), `type` (text: mass | rosary | novena), `note`, `canceled` (bool)

**`events`**
`id`, `name` (text), `description`, `start_at` (timestamptz), `end_at` (timestamptz, nullable), `location`, `whatsapp_phone` (text, só dígitos), `card_price` (integer, **em centavos**), `sells_cards` (bool), `featured` (bool), `created_at`

> Preço em centavos, inteiro. Nunca `float` para dinheiro.

**`card_orders`**
`id`, `event_id` (fk), `name`, `phone`, `quantity` (int), `created_at`

---

## Fase 2 — Autenticação

- [x] `src/lib/auth.ts` com `createSession()`, `readSession()`, `requireAdmin()`
- [x] `POST /api/login` — valida com Zod, compara o hash, grava o cookie
- [x] `POST /api/logout` — limpa o cookie
- [x] `proxy.ts` (renomeado de `middleware.ts` no Next.js 16) com matcher `/admin/:path*`
- [x] Rate limit no login — testado com curl: 6ª tentativa bloqueada mesmo com senha certa
- [ ] **Testar o furo:** com o navegador deslogado, tentar `curl -X POST .../api/events` com um corpo válido. Precisa voltar 401. Se criar o evento, a Fase 2 não está pronta. *(Pendente até a Fase 5 criar `/api/events` — lembrar de chamar `requireAdmin()` na primeira linha da rota quando ela existir.)*

```ts
// src/lib/auth.ts — esqueleto
export async function requireAdmin() {
  const token = (await cookies()).get("session")?.value;
  if (!token) throw new Response("Não autorizado", { status: 401 });
  try {
    await jwtVerify(token, SECRET);
  } catch {
    throw new Response("Não autorizado", { status: 401 });
  }
}
```

Chamar na primeira linha de **toda** rota administrativa.

---

## Fase 3 — Site público

- [x] `/` — próxima missa em destaque, grade da semana, eventos futuros
- [x] Componente de grade de horários, combinando `fixed_schedules` com as exceções de `celebrations`
- [x] `/events/[id]` — detalhe do evento com bloco de compra **básico** (link direto pro WhatsApp). O formulário completo (nome/telefone/quantidade + grava pedido antes de redirecionar) é da Fase 6 — este aqui só cobre "tem interesse, manda mensagem".
- [x] Seção "Como chegar" na home: endereço + mapa embutido (ver coordenadas e URLs em `CLAUDE.md` > Localização)
- [x] `revalidate: 300`

A regra de mesclagem foi implementada em `src/lib/schedules.ts` (`getWeekSchedule`, `getNextMass`). Testado manualmente: build, dev server com Playwright headless (screenshot em mobile 390px), e um evento fictício inserido/removido direto no banco para validar a listagem e a página de detalhe. Confirmado visualmente: próxima missa calculada corretamente considerando o horário atual de São Paulo (não UTC do servidor), grade da semana com os 7 itens certos, dia sem atividade mostrando estado vazio, mapa apontando pro endereço certo.

---

## Fase 4 — Admin: celebrantes

- [ ] `/admin` com login
- [ ] `/admin/celebrants` — visão do mês, edição inline, um botão salvar

Formato de tabelinha do mês com campo de texto em cada linha, não um CRUD com formulário em página separada. A secretaria pensa em "quem celebra domingo que vem", não em "criar registro".

- [ ] Autocomplete de celebrante a partir dos nomes já usados — são sempre os mesmos 4 ou 5 padres
- [ ] Feedback visível de salvo, porque essa tela vai ser usada com pressa

---

## Fase 5 — Admin: eventos

- [ ] `/admin/events` — lista
- [ ] `/admin/events/new` e `/admin/events/[id]`

Campos do formulário: nome da festa, descrição, data/hora de início e fim, local, telefone do WhatsApp, preço da cartela, "vende cartela?", "destacar na home?".

### Botão de teste do WhatsApp

Ao lado do campo de telefone, um botão **"Testar no WhatsApp"** que abre o `wa.me` em nova aba com a mensagem de exemplo montada — os mesmos dados que o comprador vai enviar, com quantidade 1.

Serve para quem cadastra confirmar, antes de publicar, que o número está certo e que a mensagem chega bonita. Errar um dígito do telefone é o tipo de erro que só aparece quando um paroquiano reclama uma semana depois.

Comportamento:

- [ ] Desabilitado enquanto o telefone não for válido, com o motivo escrito ao lado ("faltam 2 dígitos")
- [ ] Abre em nova aba (`target="_blank"`, `rel="noopener"`) para não perder o formulário preenchido
- [ ] Funciona **antes** de salvar, usando o valor atual do campo — o ponto é testar antes de publicar
- [ ] Mostrar embaixo a prévia da mensagem em texto, porque no desktop o `wa.me` abre o WhatsApp Web e nem todo mundo tem sessão aberta

---

## Fase 6 — Venda de cartelas

- [ ] Componente `BuyCards` na página do evento
- [ ] Campos: nome, telefone, quantidade (stepper `-` / `+`, não um `<input type="number">` — dedo grande, tela pequena)
- [ ] Total calculado ao vivo
- [ ] `POST /api/orders` grava antes de redirecionar
- [ ] Só então abrir o `wa.me`

Gravar o pedido antes do redirect é o que dá valor à tela seguinte. Sem isso, quem desiste no meio do caminho some.

- [ ] `/admin/orders` — lista com nome, telefone, quantidade e data, para a comissão da festa ligar de volta
- [ ] Exportar CSV (pode ser um `<a download>` com `Blob`, sem biblioteca)

> `POST /api/orders` é público, então precisa de cuidado próprio: validação Zod estrita, `quantity` limitada a um máximo razoável (ex. 50) e rate limit por IP. Sem isso, é um formulário aberto para encher a tabela de lixo.

---

## Fase 7 — Acabamento

- [ ] Metadados e Open Graph — o link vai circular em grupo de WhatsApp, então a prévia importa mais que o SEO
- [ ] `favicon` e ícone
- [ ] Página 404
- [ ] Testar com throttle de rede em 3G lento
- [ ] Testar em tela de 360px
- [ ] Foco de teclado visível
- [ ] Revisar as env vars na Vercel (produção **e** preview)

---

## Decisões em aberto

- Domínio próprio (~R$40/ano no registro.br) ou ficar no `.vercel.app`?
- Vale colocar PIX na mensagem do WhatsApp para adiantar o pagamento?
- Quem vai ter a senha do admin? Se for mais de uma pessoa, em algum momento vale trocar a senha única por usuários de verdade.
- **Recorrência mensal (não semanal):** a capela tem o "Grupo de Jovens" no 2º sábado de cada mês. `fixed_schedules` só modela recorrência semanal (um `weekday` que repete toda semana), então isso não entra lá como está. Ficou de fora do seed da Fase 1. Opções para resolver depois: (a) campo extra em `fixed_schedules` tipo `occurrence` (ex: "2º sábado") e a lógica de mesclagem da Fase 3 interpreta; (b) cadastrar manualmente mês a mês pela tabela `celebrations`, que já tem data específica — mais trabalho manual pra secretaria, mas não exige mudar o schema.

## Notas

O Neon suspende o banco com inatividade e religa sozinho na primeira query, com cold start de ~1s. É esperado, não é bug.
