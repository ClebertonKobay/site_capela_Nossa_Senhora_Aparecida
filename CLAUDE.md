# Site da Capela

Site da capela: horários de missas, eventos e venda de cartelas da festa via WhatsApp.
Quem administra **não é desenvolvedor** — é a secretaria da paróquia. Toda decisão de UX do `/admin` parte disso.

Plano ativo: `.claude/PLANO-DETALHADO.md` (Fases 8 a 12, com tarefas prontas para executar).
Histórico das Fases 0 a 7 e decisões antigas: `docs/PLANO.md`.

Para planejar, `/criar-plano`. Para executar, `/executar-plano`.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind para todo o estilo — sem CSS module, sem styled-components
- Postgres no Neon, acessado via Drizzle ORM
- Deploy na Vercel

## Regras de segurança (não negociáveis)

Este é um site público com área administrativa. Se houver dúvida entre conveniência e segurança, escolha segurança e me avise.

### SQL

- Toda query passa por Drizzle ou por template tag do driver Neon (`` sql`...` ``), que parametriza sozinho.
- **Nunca** montar SQL com template string do JS, concatenação ou `+`.
- **Nunca** usar `sql.unsafe()`, `db.execute()` com string crua ou `drizzle-orm/sql` com input do usuário interpolado.
- Ordenação e filtro dinâmicos (`ORDER BY`, `LIMIT`) só a partir de uma allowlist de colunas em constante no código — nunca direto do query param, porque parametrização não protege identificadores.

### Autenticação

- Conta individual por pessoa, tabela `users` no Postgres (`id`, `username`, `name`, `password_hash`, `role`, `active`, `created_at`). Nada de senha única de admin em env var — cada usuário tem seu próprio hash Argon2id (`@node-rs/argon2`). Nunca a senha em texto puro, nunca no client.
- Login por **nome de usuário**, não e-mail — coordenadores e catequistas costumam ser leigos, sem hábito de checar e-mail.
- Comparação de senha só em Route Handler / Server Action. Nenhuma lógica de auth em componente client.
- Sessão: JWT assinado com `jose` (HS256, segredo de 32+ bytes) em cookie `httpOnly`, `secure`, `sameSite: "lax"`, `maxAge` 30 dias. Payload carrega `{ userId, role }`.
- **O `proxy.ts` (era `middleware.ts` antes do Next.js 16) não é suficiente.** Ele protege a navegação, mas toda Route Handler e Server Action que lê ou escreve dado administrativo precisa chamar `requireRole(allowed: UserRole[])` por conta própria, na primeira linha, passando os papéis permitidos naquela ação. Esse é o furo mais comum: proteger `/admin` e deixar `POST /api/events` aberto para qualquer um com `curl`.
- Rate limit no login: máximo 5 tentativas por IP a cada 15 minutos. Resposta genérica em erro ("Usuário ou senha incorretos."), sem revelar qual campo errou.
- O primeiro usuário `admin` é criado uma vez, manualmente, pelo script `scripts/create-admin-user.mjs` — não existe cadastro público de admin.

Papéis (enum `user_role`, valores em inglês por convenção — rótulo de UI em português):

| Role (enum) | Rótulo em português | Acesso |
|---|---|---|
| `admin` | Administrador | Tudo, incluindo gerenciar outros usuários (único papel que cria/desativa contas). |
| `chapel_coordinator` | Coordenador de Capela | Conteúdo da capela — celebrantes, eventos, pedidos. Hoje quase igual a `admin` (só existe uma capela), mas separado pensando num futuro projeto multi-capela. |
| `pastoral_coordinator` | Coordenador de Pastoral | Cadastra pessoas só na própria pastoral. |
| `catechesis_coordinator` | Coordenador de Catequese | Cadastra catequistas, turmas, catequizandos e horários. |
| `catechist` | Catequista | Vê só as próprias turmas; marca presença/falta. |

### Entrada de dados

- Todo Route Handler e Server Action valida o body com Zod antes de qualquer uso. Sem `as` para forçar tipo.
- Nunca `dangerouslySetInnerHTML` com conteúdo vindo do banco.
- Segredo nunca em variável `NEXT_PUBLIC_*`.
- `.env` no `.gitignore` desde o primeiro commit. Só `.env.example` vai pro repositório.

## Telefone e WhatsApp

Formato canônico no banco: **só dígitos, com DDI**, ex. `5542999998888`.

- Normalizar na entrada removendo tudo que não for dígito.
- Validar: 12 ou 13 dígitos, começando com `55`.
- Se o usuário digitar sem o `55`, prefixar automaticamente em vez de rejeitar — a secretaria vai digitar `(42) 99999-8888` e isso precisa funcionar.
- Exibir sempre formatado (`(42) 99999-8888`), guardar sempre cru.

O link de compra é `https://wa.me/<telefone>?text=<encodeURIComponent(mensagem)>`. Sem API oficial, sem custo.

## Convenções

- Inglês nos nomes de tabela, coluna, rota, função e variável. Texto de UI visível ao usuário (labels, botões, mensagens) em português — quem usa é a secretaria da paróquia, não desenvolvedor.
- Datas e horas em `America/Sao_Paulo`. Guardar `timestamptz`, converter só na renderização.
- Página pública: renderização estática com `revalidate: 300`. Admin sempre dinâmico.
- Server Component por padrão. `"use client"` só onde há estado ou evento.

## Design

Mobile é o caso principal: as pessoas vão abrir isso no celular, no pátio da igreja, com sinal ruim. Mobile-first de verdade, sem imagem pesada.

Evite a estética genérica de landing page de SaaS — cards todos iguais com sombra cinza e gradiente de enfeite. A referência visual é o mural de avisos da igreja: hierarquia clara, tipografia grande e legível para quem tem 70 anos, contraste alto. Uma família tipográfica (Geist). O horário da próxima missa é a informação mais importante da home.

Tamanho mínimo de fonte no corpo: 16px. Alvo de toque mínimo: 44px.

### Paleta

Baseada no manto de Nossa Senhora Aparecida. Definida como tokens CSS em `src/app/globals.css` (Tailwind v4, `@theme`) — usar as classes `bg-primary`, `text-primary`, `bg-primary-light`, `bg-accent` etc., nunca cor solta no meio do JSX. Visual fixo, sem variação por tema do sistema (não é um app com dark mode — é o mural de avisos da paróquia).

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#1B3A6B` | Azul-manto escuro — header, footer, texto de destaque |
| `primary-light` | `#3D6FA8` | Azul-manto claro — links, ícones, apoio |
| `accent` | `#D4A537` | Dourado — botão do WhatsApp, CTAs, badges de destaque |
| `background` | `#F7F4EC` | Branco-céu — fundo geral |
| `foreground` | `#1F2937` | Texto de corpo |
| `primary-dark` | `#12294C` | Hover de botão escuro, header ativo |
| `accent-dark` | `#8A6510` | Dourado legível como texto (nunca `accent` puro como cor de texto — reprova contraste) |
| `surface` | `#FFFFFF` | Cartão branco explícito |
| `surface-muted` | `#EFEADE` | Fundo de seção alternada |
| `border` | `#1B3A6B1F` | Borda sutil padrão |
| `danger` | `#9F1239` | Mensagem de erro |
| `success` | `#14532D` | Mensagem de confirmação |

### Sistema de UI

Definido em `src/app/globals.css` (Tailwind v4, `@utility`), aplicado no site inteiro.

- **Fonte**: Inter, via `--font-sans` (`src/app/layout.tsx`).
- **Texto** (tamanho/peso, sem cor — cor é sempre `text-primary` etc. à parte): `text-display` (título de página), `text-title` (h2), `text-subtitle`, `text-body`, `text-caption`.
- **Sombra**: `shadow-card` (cartão em repouso), `shadow-lifted` (elemento flutuante/destaque). Tom azul-manto, não cinza.
- **Hover**: `hover-grow` (zoom sutil; use com `overflow-hidden` no pai).
- **Botão**: sempre `btn` + uma variante — `btn-confirm` (ação primária/confirmação), `btn-delete` (excluir/cancelar), `btn-secondary` (ação secundária). `btn-icon` para SVG isolado (44×44px, hover muda só a cor).
- **Campo de formulário**: `field` (input, select, textarea).
- **Ícones**: `src/components/icons/` (`activity.tsx`, `social.tsx`) — SVG com `stroke="currentColor"`; a cor vem do `className` de texto de quem usa.
- **Componentes React**: `src/components/ui/` — biblioteca de componentes reutilizáveis (`Typography`, `Button`, `IconButton`, `Input`, `Checkbox`, `Select`, `Popover`, `DatePicker`, `Table`/`DataTable`), importados de `@/components/ui`. `Checkbox`/`Select`/`Popover` são adapters sobre o pacote `radix-ui`; `DatePicker` usa `react-day-picker` (locale `pt-BR`); `DataTable` usa `@tanstack/react-table` v8 (headless) por cima dos componentes `Table`. Telas antigas ainda usam `<input>`/`<select>`/`<table>` nativos com as classes `field`/`btn` direto — migração é gradual, tela por tela.

### Localização

A capela fica em R. Pedro Lessinski, S/N - Boa Vista, Ponta Grossa - PR, 84073-179 (coordenadas: -25.0582828, -50.1536695). Usar no mapa embutido da home (Fase 3):

- Embed sem API key: `https://www.google.com/maps?q=-25.0582828,-50.1536695&z=17&output=embed`
- Link "abrir no Google Maps": `https://www.google.com/maps/place/Capela+Nossa+Senhora+Aparecida/@-25.0579981,-50.1537934,19.83z/data=!4m6!3m5!1s0x94e81920eea21979:0xf7d21fcd3578d31!8m2!3d-25.0582828!4d-50.1536695!16s%2Fg%2F11f5mb4rj9`

## Comandos

```bash
npm run dev
npm run build          # rodar antes de todo commit
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Como trabalhar comigo

- Uma fase do `docs/PLANO.md` por vez. Termine e valide antes de ir para a próxima.
- Antes de instalar dependência nova, pergunte. O projeto deve ficar leve.
- Ao terminar uma fase, marque o checkbox em `docs/PLANO.md`.
