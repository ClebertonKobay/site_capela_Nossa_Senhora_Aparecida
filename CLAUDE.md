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

Evite a estética genérica de landing page de SaaS — cards todos iguais com sombra cinza e gradiente de enfeite. A referência visual é o mural de avisos da igreja: hierarquia clara, tipografia grande e legível para quem tem 70 anos, contraste alto. Uma família tipográfica, no máximo duas. O horário da próxima missa é a informação mais importante da home.

Tamanho mínimo de fonte no corpo: 16px. Alvo de toque mínimo: 44px.

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
