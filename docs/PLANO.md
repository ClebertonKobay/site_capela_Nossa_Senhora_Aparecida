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
- [x] **Testar o furo.** A Fase 5 não criou `POST /api/events` — criar/editar/excluir evento virou Server Action dentro de `src/app/admin/(dashboard)/events/actions.ts`, no próprio caminho `/admin/*`. Isso significa que o matcher do proxy (`/admin/:path*`) já barra a chamada não-autenticada antes mesmo dela chegar na action — testado com `curl -X POST http://localhost:3000/admin/events/new` sem cookie, voltou 307 pro login. E cada action ainda chama `requireAdmin()` na primeira linha, como segunda camada.

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

- [x] `/admin` com login
- [x] `/admin/celebrants` — visão do mês (hoje em diante, domingo já passado não aparece), edição inline, um botão salvar

Formato de tabelinha do mês com campo de texto em cada linha, não um CRUD com formulário em página separada. A secretaria pensa em "quem celebra domingo que vem", não em "criar registro".

- [x] Autocomplete de celebrante a partir dos nomes já usados — são sempre os mesmos 4 ou 5 padres (`<datalist>`, sem JS)
- [x] Feedback visível de salvo, porque essa tela vai ser usada com pressa

Implementado: `src/app/admin/login` (form client-side, chama `POST /api/login`), grupo de rotas `src/app/admin/(dashboard)` com layout próprio (header + botão Sair) e `celebrants/page.tsx` com Server Action `saveCelebrants` (chama `requireAdmin()` na primeira linha, upsert em `celebrations` via `onConflictDoUpdate` na constraint única `(date, time, type)`, delete quando o campo fica vazio e não-cancelado). Testado via Playwright: login errado/certo, editar e salvar celebrante, confirmar persistência após reload, confirmar que aparece mesclado na home pública, logout, e confirmar que `/admin/celebrants` volta a bloquear depois do logout.

---

## Fase 5 — Admin: eventos

- [x] `/admin/events` — lista (com editar e excluir, sem estar no checklist original — CRUD sem exclusão não fazia sentido)
- [x] `/admin/events/new` e `/admin/events/[id]`

Campos do formulário: nome da festa, descrição, data/hora de início e fim, local, telefone do WhatsApp, preço da cartela, "vende cartela?", "destacar na home?".

### Botão de teste do WhatsApp

Ao lado do campo de telefone, um botão **"Testar no WhatsApp"** que abre o `wa.me` em nova aba com a mensagem de exemplo montada — os mesmos dados que o comprador vai enviar, com quantidade 1.

Serve para quem cadastra confirmar, antes de publicar, que o número está certo e que a mensagem chega bonita. Errar um dígito do telefone é o tipo de erro que só aparece quando um paroquiano reclama uma semana depois.

Comportamento:

- [x] Desabilitado enquanto o telefone não for válido, com o motivo escrito ao lado ("faltam 2 dígitos")
- [x] Abre em nova aba (`target="_blank"`, `rel="noopener"`) para não perder o formulário preenchido
- [x] Funciona **antes** de salvar, usando o valor atual do campo — o ponto é testar antes de publicar
- [x] Mostrar embaixo a prévia da mensagem em texto, porque no desktop o `wa.me` abre o WhatsApp Web e nem todo mundo tem sessão aberta

Implementado em `src/components/admin/EventForm.tsx` (client component, reaproveitado por `new` e `[id]`) e `src/lib/order-message.ts` (mensagem compartilhada com a Fase 6 — quantidade 1, mesmo texto que o comprador real vai mandar). Datas: `<input type="datetime-local">` não carrega fuso, então `parseSaoPauloDateTime`/`toSaoPauloDateTimeLocal` (`src/lib/format.ts`) tratam esse valor como horário de São Paulo (fixo UTC-3, sem horário de verão desde 2019) na ida e na volta do formulário. Testado via Playwright: telefone incompleto desabilita o botão com a mensagem certa, telefone completo monta o link `wa.me` certo, criar/editar preserva o horário digitado (15:00 entra, 15:00 volta — confirmado também direto no banco: `18:00:00.000Z` = 15h em São Paulo), evento aparece na home, excluir remove de verdade.

---

## Fase 6 — Venda de cartelas

- [x] Componente `BuyCards` na página do evento
- [x] Campos: nome, telefone, quantidade (stepper `-` / `+`, não um `<input type="number">` — dedo grande, tela pequena)
- [x] Total calculado ao vivo
- [x] `POST /api/orders` grava antes de redirecionar
- [x] Só então abrir o `wa.me`

Gravar o pedido antes do redirect é o que dá valor à tela seguinte. Sem isso, quem desiste no meio do caminho some.

- [x] `/admin/orders` — lista com nome, telefone, quantidade e data, para a comissão da festa ligar de volta
- [x] Exportar CSV (pode ser um `<a download>` com `Blob`, sem biblioteca)

> `POST /api/orders` é público, então precisa de cuidado próprio: validação Zod estrita, `quantity` limitada a um máximo razoável (ex. 50) e rate limit por IP. Sem isso, é um formulário aberto para encher a tabela de lixo.

Implementado em `src/app/api/orders/route.ts` (Zod estrito, `quantity` 1-50, rate limit reaproveitando `tooManyAttempts` com chave `order:<ip>`), `src/components/BuyCards.tsx` (client, stepper com botões `-`/`+`, total ao vivo via `formatCurrency`) e `src/app/admin/(dashboard)/orders`. Testado via curl (quantidade>50 → 400, telefone inválido → 400, evento inexistente → 404, 6ª tentativa do mesmo IP → 429) e via Playwright (compra completa: pedido gravado no banco *antes* de tentar abrir o `wa.me` — confirmado interceptando a navegação para `wa.me` e checando a query da mensagem; export CSV baixado e conferido linha a linha).

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
