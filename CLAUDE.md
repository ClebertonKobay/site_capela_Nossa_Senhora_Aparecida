# Site da Capela

Site da capela: horários de missas, eventos e venda de cartelas da festa via WhatsApp.
Quem administra **não é desenvolvedor** — é a secretaria da paróquia. Toda decisão de UX do `/admin` parte disso.

Roadmap e decisões em aberto: `docs/PLANO.md`.

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

- Senha única de admin, guardada como hash Argon2id em env var. Nunca a senha em texto puro, nunca no client.
- Comparação de senha só em Route Handler / Server Action. Nenhuma lógica de auth em componente client.
- Sessão: JWT assinado com `jose` (HS256, segredo de 32+ bytes) em cookie `httpOnly`, `secure`, `sameSite: "lax"`, `maxAge` 30 dias.
- **O `proxy.ts` (era `middleware.ts` antes do Next.js 16) não é suficiente.** Ele protege a navegação, mas toda Route Handler e Server Action que lê ou escreve dado administrativo precisa chamar `requireAdmin()` por conta própria, na primeira linha. Esse é o furo mais comum: proteger `/admin` e deixar `POST /api/events` aberto para qualquer um com `curl`.
- Rate limit no login: máximo 5 tentativas por IP a cada 15 minutos. Resposta genérica em erro ("senha incorreta"), sem revelar detalhe.

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
