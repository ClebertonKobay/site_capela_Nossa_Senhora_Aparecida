# Plano detalhado — continuação (Fases 8 a 12)

Plano ativo do projeto. As Fases 0 a 7 estão concluídas e ficam registradas em `docs/PLANO.md`
(histórico). Este arquivo continua de onde aquele parou: o site está no ar e funcionando, a home
foi reestilizada (commits `f423521` e `d3533be`) e **o resto do site ficou para trás**.

Escrito para ser executado tarefa a tarefa, uma por subagente — ver `/executar-plano`.
Para gerar novas fases aqui dentro, ver `/criar-plano`.

---

## Painel de progresso

Fonte da verdade do que já foi feito. Quem executa marca aqui, e só depois de verificar o **Aceite**.

| Tarefa | O quê | Modelo | Status |
|---|---|---|---|
| TD.1 | Geist → Inter | haiku | [x] |
| TD.2 | Ampliar a paleta em tokens | haiku | [x] |
| TD.3 | Conferir o contraste da paleta | sonnet | [x] |
| TD.4 | Escala tipográfica | haiku | [x] |
| TD.5 | Sombras padronizadas | haiku | [x] |
| TD.6 | Animações de hover | haiku | [x] |
| TD.7 | Botões: confirm, delete, secondary | haiku | [x] |
| TD.8 | Botão de ícone | haiku | [x] |
| TD.9 | Campos de formulário | haiku | [x] |
| TD.10 | Ícones em pasta, com tons prontos | haiku | [x] |
| TD.11 | Atualizar os literais da Fase 8 | haiku | [x] |
| TD.12 | Aplicar: Header, Footer, MinistrySection | haiku | [x] |
| TD.13 | Aplicar: home | haiku | [x] |
| TD.14 | Aplicar: evento, 404, BuyCards | haiku | [x] |
| TD.15 | Aplicar: casca do admin | haiku | [x] |
| TD.16 | Aplicar: botões avulsos do admin | haiku | [x] |
| TD.17 | Aplicar: formulários do admin | haiku | [x] |
| TD.18 | Aplicar: listas do admin | haiku | [x] |
| TD.19 | Documentar o sistema | haiku | [x] |
| T8.1 | Extrair o shell da home | haiku | [x] |
| T8.2 | Header fora da home | haiku | [x] |
| T8.3 | Evento dentro do shell | haiku | [ ] |
| T8.4 | Open Graph por evento | sonnet | [ ] |
| T8.5 | 404 dentro do shell | haiku | [ ] |
| T8.6 | Telas de erro | haiku | [ ] |
| T8.7 | Admin coerente | haiku | [x] |
| T8.8 | Admin no dedo | haiku | [x] |
| T9.1 | Imagens para WebP | sonnet | [ ] ⚠ |
| T9.2 | Placeholder e `sizes` | haiku | [ ] |
| T9.3 | Medir em 3G e 360px | não delegar | [ ] |
| T10.1 | `week_of_month` e `youth_group` | sonnet | [ ] |
| T10.2 | Mesclagem por ocorrência | sonnet | [ ] |
| T10.3 | Ícone e rótulo do Grupo de Jovens | haiku | [ ] |
| T10.4 | Admin da grade fixa | sonnet | [ ] ⚠ |
| T11.1 | Runner de teste | não delegar | [ ] ⚠ |
| T11.2 | Teste de telefone, dinheiro e data | haiku | [ ] |
| T11.3 | Teste da mesclagem | sonnet | [ ] |
| T11.4 | Teste do rate limit | sonnet | [ ] |
| T11.5 | `npm test` e CI | haiku | [ ] |
| T11.6 | Rate limit no banco | sonnet | [ ] ⚠ |
| T11.7 | Auditoria de segurança | não delegar | [ ] |
| T11.8 | Acessibilidade: auditoria | sonnet | [ ] |
| T11.9 | Acessibilidade: correção | haiku | [ ] |
| Fase 12 | Features novas | — | [ ] ⚠ escopo |
| T13.1 | Header flutuando sobre a foto | haiku | [x] |
| T13.2 | Cartão "Próxima Missa" mais clean | haiku | [x] |
| T13.3 | Redesenhar ícones de atividade e redes sociais | haiku | [x] |
| T13.4 | MinistrySection: badge do horário + hover do Instagram | haiku | [x] |
| T13.5 | Hover dos botões mais claro, texto neutro | sonnet | [x] |
| T13.6 | Textura sutil no fundo da home | haiku | [x] |

`⚠` = precisa de uma decisão do Cleberton antes de rodar.

**Para executar**: `/executar-plano Fase 8` (ou `T8.3`, ou `tudo`).
**Para acrescentar fases aqui**: `/criar-plano <objetivo>`.

---

## Como ler uma tarefa

Cada tarefa tem um identificador (`T8.3`), e sempre estes campos:

| Campo | Para que serve |
|---|---|
| **Arquivos** | Todo path que a tarefa pode tocar. Fora dessa lista, não mexe. |
| **Modelo** | `haiku` (mecânico, markup, teste de função pura) ou `sonnet` (banco, auth, data/fuso, SQL, segurança). `não delegar` = o orquestrador faz, com o Cleberton junto. |
| **Depende de** | Tarefas que precisam estar `[x]` antes desta começar. `—` significa que pode ir já. |
| **Fazer** | O passo a passo concreto. |
| **Aceite** | Como saber que terminou. Sempre um comando ou uma verificação objetiva. |
| **Não fazer** | O limite. É aqui que se evita um agente barato reescrevendo autenticação. |

Duas tarefas que tocam o **mesmo arquivo** nunca rodam em paralelo, mesmo sem dependência declarada.

---

## Estado atual (o que já existe)

```
src/
├── app/
│   ├── page.tsx                      home — visual novo (painel flutuante, ministérios, mapa)
│   ├── layout.tsx                    metadata + Geist; <body> sem header/footer
│   ├── globals.css                   tokens da paleta (@theme, Tailwind v4) + --sky
│   ├── not-found.tsx                 404 — visual ANTIGO, fora do shell
│   ├── icon.tsx / apple-icon.tsx / opengraph-image.tsx
│   ├── events/[id]/page.tsx          evento — visual ANTIGO, sem header/footer, sem metadata
│   ├── admin/login/page.tsx          login — visual ANTIGO
│   ├── admin/(dashboard)/            layout + índice + celebrants + events + orders (visual ANTIGO)
│   └── api/                          login, logout, orders
├── components/                       Header, Footer, ArchDivider, MinistrySection,
│                                     ScheduleScrollIndicator, icons, social-icons, BuyCards,
│                                     admin/{EventForm, DeleteEventButton, ExportCsvButton, LogoutButton}
├── lib/                              auth, session-token, rate-limit, phone, format, schedules,
│                                     location, order-message
├── db/                               schema, index (lazy), seed
├── assets/                           6 imagens, 2,6 MB no total  ← pesado demais
└── proxy.ts                          matcher /admin/:path*
```

Não existe hoje: `error.tsx`, `global-error.tsx`, nenhum teste, nenhum CI, nenhuma tela de
administração da grade fixa (`fixed_schedules` só muda por SQL na mão).

Já está resolvido e **não** precisa entrar em nenhuma tarefa: `revalidatePath("/")` já é chamado
nas Server Actions de celebrantes e eventos, então o admin não espera os 300s do ISR; `db` e
`JWT_SECRET` são lidos preguiçosamente, então `npm run build` passa sem env var.

---

## Fase D — Sistema de design (fonte, escala, sombra, animação, botões, ícones)

Hoje cada tela inventa a própria borda (`border-2 border-primary-light` num lugar,
`border border-primary/15` noutro), a própria sombra (`shadow-xl`, `shadow-lg`, `shadow-[0_10px_28px…]`,
cada uma com um valor à mão) e o próprio botão (`bg-accent px-6 py-3`, `bg-primary px-4 py-3`,
`border-2 border-primary-light px-4 py-2`, todos parecidos mas nenhum igual). O `<button disabled>` de
"Testar no WhatsApp" em `EventForm.tsx:172-179` é `bg-foreground/20`; o de `BuyCards.tsx:109-115` é
`disabled:opacity-60` — a mesma ideia, duas implementações. E a fonte é Geist, não Inter.

Esta fase cria o vocabulário (token de cor, escala de texto, sombra, `@utility` de botão, pasta de
ícone) num só lugar — `globals.css` e `src/components/icons/` — e depois passa tela por tela trocando
o à-mão pelo padrão novo. É refatoração visual pura: nenhuma tarefa aqui muda nome de campo, Server
Action, rota ou comportamento. Onde uma classe muda de cor por causa do contraste (o dourado como
texto, que reprova WCAG AA — já é um achado conhecido, reservado à T11.8/T11.9), esta fase só resolve
o caso geral (o token `accent-dark` passa a existir); a auditoria e a correção tela a tela continuam
na Fase 11, para não duplicar trabalho.

**Decisão já tomada com o Cleberton**: a paleta mantém os 5 hexes atuais do `CLAUDE.md` e ganha tokens
derivados (não reabre `primary`, `accent` etc.). Botões viram `@utility` no `globals.css` — nenhum
componente `Button.tsx` novo; aplica-se a `<button>`, `<a>` e `<Link>` com a mesma classe.

### T D.1 — Trocar Geist por Inter

- **Arquivos**: `src/app/layout.tsx`, `src/app/globals.css`
- **Modelo**: haiku
- **Depende de**: —
- **Fazer**:
  1. Em `src/app/layout.tsx:2`, trocar `import { Geist } from "next/font/google"` por
     `import { Inter } from "next/font/google"`.
  2. Trocar a chamada `Geist({ variable: "--font-geist-sans", subsets: ["latin"] })` por
     `Inter({ variable: "--font-sans", subsets: ["latin"] })` — variável renomeada porque deixa de ser
     "geist" (ver passo 4).
  3. Ajustar `className={`${geistSans.variable} …`}` para a variável nova (renomear também a
     constante `geistSans` → `inter`, para o código não mentir sobre a fonte usada).
  4. Em `src/app/globals.css:19`, `--font-sans: var(--font-geist-sans);` passa a
     `--font-sans: var(--font-sans);` do jeito que o `next/font` expõe — como o nome da variável CSS
     mudou no passo 2, ajustar para bater exatamente (confirmar o nome gerado rodando `npm run build`
     e olhando a classe aplicada no `<html>`, não adivinhar).
- **Aceite**: `npm run build`; abrir a home, inspecionar o `<body>` no DevTools e ver
  `font-family` resolvendo para Inter, não Geist/Arial.
- **Não fazer**: não adicionar nenhuma segunda família — CLAUDE.md pede "uma família tipográfica".

### T D.2 — Ampliar a paleta em tokens (sem reabrir os 5 hexes)

- **Arquivos**: `src/app/globals.css`, `CLAUDE.md`
- **Modelo**: haiku
- **Depende de**: —
- **Fazer**:
  1. Em `:root` (`globals.css:3-10`), manter `--background`, `--foreground`, `--primary`,
     `--primary-light`, `--accent`, `--sky` exatamente como estão. Acrescentar:
     ```css
     --primary-dark: #12294c;
     --accent-dark: #8a6510;
     --surface: #ffffff;
     --surface-muted: #efeade;
     --border: #1b3a6b1f;
     --danger: #9f1239;
     --success: #14532d;
     ```
  2. Repetir cada um em `@theme inline` (`globals.css:12-20`) como `--color-<nome>: var(--<nome>);`,
     do mesmo jeito que os já existentes — é isso que gera `bg-primary-dark`, `text-accent-dark`,
     `bg-surface`, `bg-surface-muted`, `border-border`, `text-danger`, `text-success` como classes
     Tailwind.
  3. No `CLAUDE.md`, na tabela de paleta (seção "Design" → "Paleta"), acrescentar uma linha para cada
     token novo com o "Uso" pretendido: `primary-dark` (hover de botão escuro/header ativo),
     `accent-dark` (texto dourado legível — nunca `accent` puro como cor de texto), `surface` (cartão
     branco explícito, em vez de `bg-background` repetido), `surface-muted` (fundo de seção alternada,
     substitui `bg-primary/5`), `border` (borda sutil padrão, substitui `border-primary/15` à mão),
     `danger`/`success` (mensagem de erro/confirmação, substitui `text-red-700`).
- **Aceite**: `npm run build`; `grep -n "color-primary-dark\|color-accent-dark\|color-surface\|color-border\|color-danger\|color-success" src/app/globals.css` retorna as 6 linhas.
- **Não fazer**: não mudar o valor de nenhum dos 5 hexes originais. Não usar cor solta (`#…`) em
  nenhum arquivo `.tsx` depois desta tarefa — só os tokens.

### T D.3 — Conferir o contraste da paleta nova

- **Arquivos**: nenhum (verificação) — pode anexar nota em `CLAUDE.md` se achar algo
- **Modelo**: sonnet
- **Depende de**: T D.2
- **Fazer**: calcular a razão de contraste (fórmula WCAG, relative luminance) de
  `accent-dark` (`#8a6510`) sobre `background` (`#f7f4ec`) e sobre `surface` (`#ffffff`); de
  `foreground` sobre `surface-muted`; de `danger`/`success` sobre `background`. Todos precisam passar
  de 4.5:1 (texto normal) — é o motivo de `accent-dark` existir em vez de reusar `accent` como texto.
  Se algum não passar, ajustar só aquele hex (mais escuro) na mesma tarefa, antes de qualquer tela
  usá-lo.
- **Aceite**: os 4 pares acima documentados com a razão calculada (comentário no `globals.css` acima
  de `:root` basta, ex. `/* accent-dark sobre background: 5.2:1 */`), todos ≥ 4.5:1.
- **Não fazer**: não fazer a auditoria de contraste do site inteiro (isso é a T11.8) — só os tokens
  novos desta fase.

### T D.4 — Escala tipográfica (título, subtítulo, corpo)

- **Arquivos**: `src/app/globals.css`
- **Modelo**: haiku
- **Depende de**: T D.1
- **Fazer**: acrescentar, depois do bloco `body { … }` (`globals.css:22-27`), utilities de texto via
  `@utility` (Tailwind v4) — só tamanho, peso e leading, **sem cor** (cor continua sendo `text-primary`
  etc. escolhida no lugar de uso, como já é hoje):
  ```css
  @utility text-display {
    font-size: 2rem;       /* 32px */
    font-weight: 700;
    line-height: 1.15;
  }
  @utility text-title {
    font-size: 1.5rem;     /* 24px */
    font-weight: 700;
    line-height: 1.2;
  }
  @utility text-subtitle {
    font-size: 1.125rem;   /* 18px */
    font-weight: 600;
    line-height: 1.35;
  }
  @utility text-body {
    font-size: 1rem;       /* 16px — mínimo do CLAUDE.md */
    font-weight: 400;
    line-height: 1.6;
  }
  @utility text-caption {
    font-size: 0.875rem;   /* 14px — só para apoio, nunca corpo principal */
    font-weight: 400;
    line-height: 1.5;
  }
  ```
  `sm:` responsivo fica por conta de quem usa (`text-display sm:text-5xl`, por exemplo), a utility dá
  só o tamanho-base mobile.
- **Aceite**: `npm run build`; `<h1 className="text-display text-primary">` renderiza 32px/700 no
  DevTools.
- **Não fazer**: não incluir `color` em nenhuma dessas utilities — é a regra que o Cleberton pediu
  explicitamente.

### T D.5 — Sombra padronizada

- **Arquivos**: `src/app/globals.css`
- **Modelo**: haiku
- **Depende de**: —
- **Fazer**: hoje o código usa `shadow-xl`, `shadow-lg`, `shadow-[0_10px_28px_-8px_rgba(212,165,55,0.5)]`
  (Header) e `shadow` sem padrão. Definir duas sombras próprias, sutis (o Cleberton pediu "sutil mas
  bom" — nada do `shadow-2xl` genérico de SaaS), como tokens `@theme inline`:
  ```css
  --shadow-card: 0 2px 8px -2px rgba(27, 58, 107, 0.12), 0 1px 2px rgba(27, 58, 107, 0.08);
  --shadow-lifted: 0 12px 28px -10px rgba(27, 58, 107, 0.28);
  ```
  Isso gera as classes `shadow-card` e `shadow-lifted`. `shadow-card` é o padrão para cartão em
  repouso; `shadow-lifted` para elemento flutuante/em destaque (o painel da home, o header sticky) —
  mantém a cor do azul-manto em vez do cinza padrão do Tailwind, que é o que dá a cara "SaaS genérico"
  que o Cleberton quer evitar.
- **Aceite**: `npm run build`; `grep -n "shadow-card\|shadow-lifted" src/app/globals.css` mostra os
  dois tokens.
- **Não fazer**: não aplicar ainda em nenhuma tela — essa troca é da T D.12 em diante.

### T D.6 — Animações de hover (escala em imagem/cartão)

- **Arquivos**: `src/app/globals.css`
- **Modelo**: haiku
- **Depende de**: —
- **Fazer**: acrescentar utilities de transição/hover reaproveitáveis:
  ```css
  @utility hover-grow {
    transition: transform 0.2s ease-out;
  }
  @utility hover-grow:hover {
    transform: scale(1.03);
  }
  ```
  Como Tailwind v4 `@utility` não aceita pseudo-classe direto no seletor dessa forma, escrever como
  classe única com o hover embutido via `&:hover` (sintaxe de aninhamento do Tailwind v4, igual ao que
  já existe em `globals.css:44` com `.photo-vignette::after`):
  ```css
  .hover-grow {
    transition: transform 0.2s ease-out;
  }
  .hover-grow:hover {
    transform: scale(1.03);
  }
  @media (prefers-reduced-motion: reduce) {
    .hover-grow {
      transition: none;
    }
    .hover-grow:hover {
      transform: none;
    }
  }
  ```
  Aplicar `overflow-hidden` no elemento pai sempre que `hover-grow` for usado num `<Image fill>`, para
  o zoom não vazar do cartão (padrão comum em `MinistrySection`, que já tem `overflow-hidden` no
  wrapper).
- **Aceite**: `npm run build`; `grep -n "hover-grow" src/app/globals.css` mostra a classe com o bloco
  de `prefers-reduced-motion`.
- **Não fazer**: não animar `box-shadow` junto (é caro para o navegador redesenhar); só `transform`.
  Não aplicar ainda em nenhuma tela — aplicação é da T D.12/T D.13.

### T D.7 — Botões: confirm, delete/cancel, secondary

- **Arquivos**: `src/app/globals.css`
- **Modelo**: haiku
- **Depende de**: T D.2, T D.5
- **Fazer**: `@utility` de botão — só cor, hover, focus e disabled, como o Cleberton pediu; o que vai
  dentro (ícone, texto, tamanho de padding) continua por conta de quem usa via classes extras no mesmo
  elemento:
  ```css
  @utility btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 2.75rem; /* 44px — alvo de toque do CLAUDE.md */
    padding-inline: 1.25rem;
    border-radius: 0.75rem;
    font-weight: 600;
    transition: background-color 0.15s ease-out, color 0.15s ease-out, opacity 0.15s ease-out;
  }
  @utility btn-confirm {
    background-color: var(--color-accent);
    color: var(--color-primary);
  }
  .btn-confirm:hover {
    background-color: var(--color-accent-dark);
    color: white;
  }
  @utility btn-delete {
    background-color: transparent;
    color: var(--color-danger);
    border: 2px solid var(--color-danger);
  }
  .btn-delete:hover {
    background-color: var(--color-danger);
    color: white;
  }
  @utility btn-secondary {
    background-color: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary-light);
  }
  .btn-secondary:hover {
    background-color: var(--color-primary-light);
    color: white;
  }
  .btn:focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }
  .btn:disabled,
  .btn[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  ```
  `btn-delete` cobre tanto "excluir" quanto "cancelar" — mesma cor de aviso, o texto dentro (`Excluir`
  vs `Cancelar`) é quem diferencia; não criar `btn-cancel` separado, é a mesma variante semântica.
  Usar sempre `btn` + uma das três variantes juntas (`className="btn btn-confirm"`), nunca a variante
  sozinha — `btn` carrega o tamanho e o `focus-visible`, a variante só a cor.
- **Aceite**: `npm run build`; `grep -n "btn-confirm\|btn-delete\|btn-secondary" src/app/globals.css`
  mostra as três; um `<a className="btn btn-confirm">texto</a>` de teste renderiza com 44px de altura
  mínima e outline dourado ao tabular até ele.
- **Não fazer**: não incluir `padding` vertical fixo nem tamanho de fonte na `@utility` — isso é
  "o que vai dentro", fica com quem usa. Não aplicar ainda nas telas.

### T D.8 — Botão de ícone (SVG com hover que muda a cor)

- **Arquivos**: `src/app/globals.css`
- **Modelo**: haiku
- **Depende de**: T D.2
- **Fazer**: utility mínima — hover muda só a cor do SVG via `currentColor`, "e mais nada" (nem fundo,
  nem borda, nem escala), como pedido:
  ```css
  @utility btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.75rem;
    min-width: 2.75rem;
    color: var(--color-primary);
    transition: color 0.15s ease-out;
  }
  .btn-icon:hover {
    color: var(--color-accent);
  }
  .btn-icon:focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }
  ```
  O SVG dentro precisa usar `stroke="currentColor"` (já é o padrão em `icons.tsx` e `social-icons.tsx`)
  para herdar a cor no hover — não mudar os ícones existentes por causa disso, eles já seguem essa
  convenção.
- **Aceite**: `npm run build`; `grep -n "btn-icon" src/app/globals.css` mostra a classe.
- **Não fazer**: não adicionar fundo, sombra ou `transform` no `btn-icon` — é a diferença combinada
  com `hover-grow` e com `btn-confirm`; cada utility faz uma coisa só.

### T D.9 — Campos de formulário padronizados

- **Arquivos**: `src/app/globals.css`
- **Modelo**: haiku
- **Depende de**: T D.2
- **Fazer**: hoje todo `input`/`select`/`textarea` repete
  `min-h-11 w-full border-2 border-primary-light px-3 py-2 text-base` na mão (`EventForm.tsx:21`,
  `BuyCards.tsx:64`, `admin/login/page.tsx:44`, `celebrants/page.tsx:150`). Extrair como utility:
  ```css
  @utility field {
    display: block;
    width: 100%;
    min-height: 2.75rem;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    border: 2px solid var(--color-primary-light);
    border-radius: 0.5rem;
    background-color: var(--color-surface);
    color: var(--color-foreground);
    transition: border-color 0.15s ease-out;
  }
  .field:focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 1px;
    border-color: var(--color-primary);
  }
  .field:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  ```
- **Aceite**: `npm run build`; `grep -n "@utility field" src/app/globals.css` presente.
- **Não fazer**: não trocar ainda nenhum `input` de tela nenhuma — a substituição é da T D.17.

### T D.10 — Ícones em pasta própria, com cor pronta

- **Arquivos**: cria `src/components/icons/activity.tsx`, `src/components/icons/social.tsx`,
  `src/components/icons/index.ts`; apaga `src/components/icons.tsx`, `src/components/social-icons.tsx`
- **Modelo**: haiku
- **Depende de**: T D.2
- **Fazer**:
  1. Mover o conteúdo de `src/components/icons.tsx` (6 componentes SVG + `ACTIVITY_ICONS`) para
     `src/components/icons/activity.tsx`, sem mudar nenhum `path`/`viewBox`.
  2. Mover `src/components/social-icons.tsx` (`InstagramIcon`, `FacebookIcon`) para
     `src/components/icons/social.tsx`, sem mudar path.
  3. Em cada componente de ícone, trocar `stroke="currentColor"` solto por um default de cor via prop:
     `className` continua controlando tamanho (`h-5 w-5`) e a cor default passa a vir de uma classe
     `text-primary-light` aplicada pelo componente quando quem chama não passar `className` com outra
     cor de texto — na prática, manter `stroke="currentColor"` (não mudar o SVG) e documentar no
     `index.ts`, via comentário, que a cor "pronta" de cada ícone é a classe de texto que quem usa
     aplica (`text-primary-light`, `text-accent`, etc.) — ou seja, esta tarefa organiza a pasta e
     define a convenção; não força cor fixa dentro do SVG, porque os mesmos ícones já trocam de cor
     conforme o contexto hoje (ex. `ACTIVITY_ICONS` em `text-primary-light` na home).
  4. `src/components/icons/index.ts` reexporta tudo: `export * from "./activity"; export * from "./social";`.
  5. Atualizar os dois imports existentes: `src/app/page.tsx` (`ACTIVITY_ICONS` de `@/components/icons`
     → `@/components/icons`, mesmo caminho porque `icons/` vira pasta, index resolve sozinho — conferir
     que `@/components/icons` aponta para `src/components/icons/index.ts` depois do `tsconfig` resolver
     por pasta) e `src/components/Footer.tsx`/`MinistrySection.tsx` (`@/components/social-icons` →
     `@/components/icons`).
- **Aceite**: `npm run build`; `ls src/components/icons/` mostra `activity.tsx`, `social.tsx`,
  `index.ts`; nenhum arquivo antigo (`icons.tsx`, `social-icons.tsx`) sobrando na raiz de
  `components/`; a home e o rodapé continuam mostrando os ícones certos.
- **Não fazer**: não redesenhar nenhum SVG, não mudar `viewBox` nem `strokeWidth`.

### T D.11 — Atualizar os literais de classe já planejados na Fase 8

- **Arquivos**: este arquivo (`.claude/PLANO-DETALHADO.md`)
- **Modelo**: haiku
- **Depende de**: T D.5, T D.7, T D.9
- **Fazer**: a Fase 8 abaixo foi escrita **antes** desta fase existir e cita classes literais
  (`rounded-2xl bg-accent px-6 py-3 text-lg font-semibold text-primary min-h-11` em T8.5,
  `min-h-11 text-base` em T8.8, etc.). Substituir, só no texto das tarefas de Fase 8 que ainda
  estiverem `[ ]`, essas classes literais pelas novas: botão vira `btn btn-confirm` (ou `btn-secondary`
  conforme o caso), input/select vira `field`. Não mudar o que a tarefa faz, só a classe que ela
  instrui a aplicar.
- **Aceite**: `grep -n "btn btn-\|className=\"field" .claude/PLANO-DETALHADO.md` aparece dentro da
  Fase 8 depois da edição.
- **Não fazer**: não editar tarefa já marcada `[x]`.

### T D.12 — Aplicar o sistema: Header, Footer, MinistrySection, ArchDivider

- **Arquivos**: `src/components/Header.tsx`, `src/components/Footer.tsx`,
  `src/components/MinistrySection.tsx`
- **Modelo**: haiku
- **Depende de**: T D.1, T D.5, T D.6, T D.8, T D.10
- **Fazer**:
  1. `Header.tsx:13`: trocar `shadow-[0_10px_28px_-8px_rgba(212,165,55,0.5)]` por `shadow-lifted`.
  2. `Footer.tsx:25,34`: os dois links de ícone (`InstagramIcon`, `FacebookIcon`) — avaliar se o
     tratamento de círculo com borda atual é intencional (é, faz parte do visual já aprovado da home)
     e por isso **não** trocar por `btn-icon` puro aqui; só trocar o import para `@/components/icons`
     (efeito da T D.10) e manter a classe visual como está. Registrar isso explicitamente para não
     confundir quem executa: nem todo ícone vira `btn-icon` — vira quando for um botão de ação isolado,
     não quando faz parte de um tratamento visual maior já definido.
  3. `MinistrySection.tsx:46`: no wrapper da foto (`w-full overflow-hidden rounded-t-2xl…`), acrescentar
     `hover-grow` na `<Image>` interna (não no wrapper, para o `overflow-hidden` do pai conter o zoom).
- **Aceite**: `npm run build`; passar o mouse sobre uma foto de `MinistrySection` na home aumenta a
  imagem suavemente sem vazar do cartão; header mantém a sombra dourada visualmente igual (só a origem
  da classe muda).
- **Não fazer**: não mudar o círculo de borda dos ícones do rodapé para `btn-icon`.

### T D.13 — Aplicar o sistema: home (tipografia, sombra, cor)

- **Arquivos**: `src/app/page.tsx`
- **Modelo**: haiku
- **Depende de**: T D.4, T D.5, T D.10
- **Fazer**:
  1. `page.tsx:109`: `text-2xl font-bold` → `text-display`; manter `text-primary` e o `sm:text-3xl`
     junto (`text-display text-primary sm:text-5xl`, ajustando o `sm:` para a escala nova — conferir
     visualmente que não ficou desproporcional ao painel).
  2. `page.tsx:175,207,234`: os três `<h2 className="text-xl font-bold text-primary">` → `text-title
     text-primary`.
  3. `page.tsx:116`: `text-3xl font-bold sm:text-4xl` (o horário da próxima missa, a informação mais
     importante da home segundo o `CLAUDE.md`) → `text-display sm:text-5xl`, mantendo o destaque maior
     que os `h2`.
  4. `page.tsx:84`: painel principal `shadow-xl` → `shadow-lifted`.
  5. `page.tsx:114,247`: `shadow-xl`/`shadow-lg` do cartão de próxima missa e do mapa → `shadow-card`.
  6. `page.tsx:206`: `bg-primary/5` (seção de eventos) → `bg-surface-muted`.
  7. `page.tsx:216`: cartão de evento (`border-2 border-primary-light bg-background px-4 py-3`) →
     acrescentar `hover-grow` e trocar a borda para `border border-border rounded-2xl bg-surface`
     (mantendo o padding).
- **Aceite**: `npm run build`; em 390px de largura sem scroll horizontal; a home renderiza visualmente
  próxima da atual (mesma hierarquia, sombra mais sutil, tipografia com a escala nova).
- **Não fazer**: não mudar a ordem das seções nem o texto de nenhum conteúdo.

### T D.14 — Aplicar o sistema: página do evento, 404, BuyCards

- **Arquivos**: `src/app/events/[id]/page.tsx`, `src/app/not-found.tsx`, `src/components/BuyCards.tsx`
- **Modelo**: haiku
- **Depende de**: T D.4, T D.7, T D.9
- **Fazer**:
  1. `events/[id]/page.tsx:21`: `text-2xl font-bold text-primary` → `text-display text-primary`.
  2. `events/[id]/page.tsx:28`: `border-2 border-primary-light bg-primary/5` → `border border-border
     rounded-2xl bg-surface-muted shadow-card`.
  3. `not-found.tsx:6`: `text-3xl font-bold text-primary` → `text-display text-primary`; `not-found.tsx:10`:
     `mt-2 min-h-11 bg-accent px-6 py-3 text-lg font-semibold text-primary` → `btn btn-confirm mt-2 px-6 py-3 text-lg`.
  4. `BuyCards.tsx:64,78`: `mt-1 min-h-11 w-full border-2 border-primary-light px-3 py-2 text-base` →
     `field mt-1`.
  5. `BuyCards.tsx:89,98`: os dois botões `-`/`+` → manter estrutura, aplicar `btn btn-secondary` no
     lugar da classe atual (`flex h-11 w-11 items-center justify-center border-2 border-primary-light
     text-2xl font-bold text-primary`), ajustando padding se o `btn` genérico ficar largo demais para
     um botão quadrado — usar `className="btn btn-secondary !min-w-11 !px-0"` se necessário para manter
     o formato quadrado.
  6. `BuyCards.tsx:107`: `text-base font-semibold text-red-700` → `text-body font-semibold text-danger`.
  7. `BuyCards.tsx:112`: `min-h-11 bg-accent px-6 py-3 text-lg font-semibold text-primary
     disabled:opacity-60` → `btn btn-confirm px-6 py-3 text-lg`.
- **Aceite**: `npm run build`; fluxo de compra de cartela (nome, telefone, quantidade, comprar) continua
  funcionando; nenhum alvo de toque abaixo de 44px.
- **Não fazer**: não tocar a chamada `POST /api/orders` nem o `handleSubmit`.

### T D.15 — Aplicar o sistema: casca do admin (layout, índice, login)

- **Arquivos**: `src/app/admin/(dashboard)/layout.tsx`, `src/app/admin/(dashboard)/page.tsx`,
  `src/app/admin/login/page.tsx`, `src/components/admin/LogoutButton.tsx`
- **Modelo**: haiku
- **Depende de**: T D.4, T D.7, T D.9
- **Fazer**:
  1. `admin/(dashboard)/layout.tsx:11-14`: header mantém `bg-primary`; `LogoutButton` usa `btn
     btn-secondary` com cores ajustadas para contraste sobre `bg-primary` (borda/texto branco no
     hover — usar `className="btn btn-secondary !border-white/40 !text-white hover:!border-accent
     hover:!text-accent hover:!bg-transparent"` para não brigar com o fundo escuro, já que `btn-secondary`
     por padrão assume fundo claro).
  2. `admin/(dashboard)/page.tsx:6-23`: os três links (`Celebrantes`, `Eventos`, `Pedidos`) trocam
     `block border-2 border-primary-light px-4 py-3 text-lg font-semibold text-primary` por `rounded-2xl
     border border-border bg-surface shadow-card px-4 py-3 text-subtitle text-primary hover-grow`.
  3. `admin/login/page.tsx:33`: `text-xl font-bold text-primary` → `text-title text-primary`.
     `admin/login/page.tsx:44`: input de senha → `field mt-1`. `admin/login/page.tsx:50`: botão Entrar →
     `btn btn-confirm mt-4 w-full text-lg`.
- **Aceite**: `npm run build`; login, índice e logout continuam funcionando; nenhuma cor fora dos
  tokens (`grep -n '#[0-9a-fA-F]\{6\}' src/app/admin -r` vazio).
- **Não fazer**: **não encostar** em `src/lib/auth.ts`, `src/proxy.ts`, `src/app/api/login/route.ts`,
  `src/app/api/logout/route.ts` nem em `requireAdmin()`. Só markup e classe.

### T D.16 — Aplicar o sistema: botões avulsos do admin

- **Arquivos**: `src/components/admin/DeleteEventButton.tsx`, `src/components/admin/ExportCsvButton.tsx`,
  `src/app/admin/(dashboard)/events/page.tsx`
- **Modelo**: haiku
- **Depende de**: T D.7
- **Fazer**:
  1. `DeleteEventButton.tsx:20`: `text-base font-semibold text-red-700 underline` → `btn btn-delete`.
     Manter o `confirm()` do `onSubmit` intocado.
  2. `ExportCsvButton.tsx:35`: `flex min-h-11 items-center border-2 border-primary-light px-4 py-2
     text-base font-semibold text-primary` → `btn btn-secondary`.
  3. `events/page.tsx:20`: link "Novo evento" (`flex min-h-11 items-center bg-accent px-4 py-2 text-base
     font-semibold text-primary`) → `btn btn-confirm`.
- **Aceite**: `npm run build`; excluir e exportar continuam funcionando.
- **Não fazer**: não tocar na Server Action `deleteEvent` nem na lógica de exportação.

### T D.17 — Aplicar o sistema: formulários do admin

- **Arquivos**: `src/components/admin/EventForm.tsx`,
  `src/app/admin/(dashboard)/celebrants/page.tsx`
- **Modelo**: haiku
- **Depende de**: T D.9, T D.7
- **Fazer**:
  1. `EventForm.tsx:21`: `const inputClass = "mt-1 min-h-11 w-full border-2 border-primary-light px-3
     py-2 text-base"` → `const inputClass = "field mt-1"`. Isso já propaga para todo `input`/`textarea`
     que usa `inputClass` no arquivo — conferir que `textarea` (linha 78) também aceita a classe sem
     quebrar `rows={4}`.
  2. `EventForm.tsx:164-171`: link "Testar no WhatsApp" habilitado → `btn btn-confirm`; `172-179`
     desabilitado (`bg-foreground/20 … cursor-not-allowed`) → `btn btn-confirm` com `disabled` nativo (o
     `.btn:disabled` da T D.7 já cobre a opacidade — remover a classe manual `cursor-not-allowed
     bg-foreground/20 text-foreground/50`).
  3. `EventForm.tsx:185`: botão "Salvar" (`min-h-11 bg-primary px-4 py-3 text-lg font-semibold
     text-white`) → `btn btn-confirm px-4 py-3 text-lg` (Salvar é uma confirmação — usar `btn-confirm`,
     não inventar uma quarta variante).
  4. `celebrants/page.tsx:150`: input de nome do celebrante → `field`. `celebrants/page.tsx:169`:
     botão Salvar → `btn btn-confirm mt-6 w-full px-4 py-3 text-lg sm:w-auto`.
  5. `celebrants/page.tsx:119`: banner "Salvo com sucesso!" (`border-2 border-primary bg-primary/10
     px-3 py-2 text-base font-semibold text-primary`) → `rounded-xl border border-success/30 bg-success/10
     px-3 py-2 text-body font-semibold text-success`.
- **Aceite**: `npm run build`; criar/editar evento e salvar celebrantes continuam funcionando; o botão
  "Testar no WhatsApp" desabilitado ainda impede clique e mostra a razão ao lado (`phoneHint`).
- **Não fazer**: não mudar `name=` de nenhum campo, nem a lógica de `phoneHint`/`normalizePhone`.

### T D.18 — Aplicar o sistema: listas do admin (eventos, pedidos)

- **Arquivos**: `src/app/admin/(dashboard)/events/page.tsx`, `src/app/admin/(dashboard)/orders/page.tsx`
- **Modelo**: haiku
- **Depende de**: T D.5, T D.16
- **Fazer**:
  1. `events/page.tsx:31`: cartão de evento (`border-2 border-primary-light px-4 py-3`) →
     `rounded-2xl border border-border bg-surface shadow-card px-4 py-3`.
  2. `events/page.tsx:43`: link "Editar" (`text-base font-semibold text-primary-light underline`) →
     manter como link de texto (não é ação primária/destrutiva o bastante para virar `btn`), só trocar
     `text-primary-light` por `text-primary-light hover:text-primary` para dar feedback de hover
     consistente com o resto.
  3. `orders/page.tsx:44`: cabeçalho da tabela (`border-b-2 border-primary`) → manter estrutura,
     trocar borda para `border-b-2 border-border`.
  4. `orders/page.tsx:54`: linha da tabela (`border-b border-primary-light/30`) → `border-b border-border`.
- **Aceite**: `npm run build`; listas continuam legíveis e funcionais, sem scroll horizontal fora da
  `<table>` (que já tem `overflow-x-auto` no wrapper).
- **Não fazer**: não mudar a query nem os campos exportados no CSV.

### T D.19 — Documentar o sistema no CLAUDE.md

- **Arquivos**: `CLAUDE.md`
- **Modelo**: haiku
- **Depende de**: T D.2 a T D.10
- **Fazer**: acrescentar, na seção "Design" do `CLAUDE.md`, um bloco curto "Sistema de UI" listando:
  fonte (Inter, `--font-sans`), as 5 utilities de texto (`text-display` a `text-caption`, sem cor
  embutida), as duas sombras (`shadow-card`, `shadow-lifted`), a utility `hover-grow`, as quatro
  utilities de botão (`btn` + `btn-confirm`/`btn-delete`/`btn-secondary`/`btn-icon`), a utility `field`,
  e o caminho `src/components/icons/` com a convenção de cor por `className` de quem usa. Cada item com
  uma linha de exemplo de classe, no mesmo estilo enxuto da tabela de paleta já existente no arquivo.
- **Aceite**: `CLAUDE.md` revisado tem a seção nova, sem duplicar a tabela de paleta já existente.
- **Não fazer**: não reescrever o resto do `CLAUDE.md`; só acrescentar.

---

## Fase 8 — A identidade visual no site inteiro

A home ganhou uma linguagem própria (fundo azul-céu, painel branco flutuante de cantos
arredondados, header em card com borda dourada, soleira, arco). Quem sai da home cai num site
diferente — sem header, sem rodapé, sem caminho de volta. É a inconsistência mais visível hoje.

### T8.1 — Extrair o shell da home para um componente

- **Arquivos**: cria `src/components/PageShell.tsx`; edita `src/app/page.tsx`
- **Modelo**: haiku
- **Depende de**: —
- **Fazer**:
  1. Criar `PageShell` (Server Component) recebendo `{ children, nav }` onde `nav` é repassado ao `Header`.
  2. Mover para dentro dele o markup de `src/app/page.tsx:83-86` e `257-259`: o `<div className="min-h-screen bg-sky">`, o painel `mx-2 my-2 flex flex-col bg-background shadow-xl sm:mx-4 sm:my-4 sm:rounded-t-3xl lg:mx-auto lg:w-[90%]`, o `<Header />`, o `<main className="flex-1">` e o `<Footer />`.
  3. `page.tsx` passa a renderizar `<PageShell nav="home"> …conteúdo… </PageShell>` seguido do `<ScheduleScrollIndicator />` (que fica **fora** do shell, é específico da home).
- **Aceite**: `npm run build` passa; `git diff` não muda nenhuma classe Tailwind da home — só move markup.
- **Não fazer**: não mudar espaçamento, cor ou ordem de seção. Esta tarefa é refatoração pura.

### T8.2 — Header funcionando fora da home

- **Arquivos**: `src/components/Header.tsx`
- **Modelo**: haiku
- **Depende de**: T8.1
- **Fazer**: os links de `NAV_LINKS` são âncoras (`#santa-missa`), que não levam a lugar nenhum fora da home. Adicionar prop `nav: "home" | "inner"` (default `"home"`): em `"home"` o href continua `#id`; em `"inner"` vira `/#id`. Manter `min-h-11` em todos os links.
- **Aceite**: na home, clicar em "Missa" rola sem recarregar; em `/events/1`, clicar em "Missa" navega para a home na seção certa.
- **Não fazer**: não trocar `<a>` por `<Link>` nas âncoras internas da home (quebra o scroll suave).

### T8.3 — Página do evento dentro do shell

- **Arquivos**: `src/app/events/[id]/page.tsx`
- **Modelo**: haiku
- **Depende de**: T8.1, T8.2
- **Fazer**:
  1. Envolver o conteúdo em `<PageShell nav="inner">`.
  2. Cartão de data/hora no mesmo tratamento do bloco "Próxima Missa" da home (`rounded-3xl bg-accent px-5 py-6 text-primary shadow-xl`), com o `formatEventDateTime` em `text-3xl font-bold`.
  3. Bloco de compra: trocar `border-2 border-primary-light bg-primary/5` por `rounded-3xl border border-primary/15 bg-background shadow-xl` e manter o `<BuyCards />` intocado.
  4. Adicionar, no topo, um link "← Voltar" para `/` com `min-h-11`.
  5. Quando houver `location`, mostrar; quando não houver, mostrar `CHAPEL_ADDRESS` de `@/lib/location` com link para `MAPS_LINK`.
- **Aceite**: `npm run build`; em 390px de largura não há scroll horizontal; todo alvo clicável tem 44px.
- **Não fazer**: não tocar em `src/components/BuyCards.tsx` nem na chamada de `POST /api/orders`.

### T8.4 — Open Graph por evento

- **Arquivos**: `src/app/events/[id]/page.tsx`
- **Modelo**: sonnet
- **Depende de**: T8.3
- **Fazer**: exportar `generateMetadata` buscando o evento pelo id e devolvendo `title` (`"<nome> · Capela Nossa Senhora Aparecida"`), `description` (nome + `formatEventDateTime` + local) e `openGraph` equivalente. Envolver a busca do evento em `cache()` do React e usar a mesma função no `generateMetadata` e no componente, para não consultar o banco duas vezes. Se o evento não existir, devolver metadata vazia (o `notFound()` do componente resolve).
- **Aceite**: `npm run dev` e `curl -s localhost:3000/events/<id> | grep -i 'og:title'` mostra o nome do evento; a home continua com o OG genérico.
- **Não fazer**: não gerar `opengraph-image` por evento (a imagem global já existe e basta).

### T8.5 — 404 dentro do shell

- **Arquivos**: `src/app/not-found.tsx`
- **Modelo**: haiku
- **Depende de**: T8.1, T8.2
- **Fazer**: envolver em `<PageShell nav="inner">`; botão "Voltar para a home" em `btn btn-confirm px-6 py-3 text-lg`.
- **Aceite**: `npm run build`; `/rota-que-nao-existe` mostra header e rodapé.

### T8.6 — Telas de erro (não existem hoje)

- **Arquivos**: cria `src/app/error.tsx` e `src/app/global-error.tsx`
- **Modelo**: haiku
- **Depende de**: T8.1
- **Fazer**:
  1. `error.tsx`: Client Component (`"use client"`), recebe `{ error, reset }`, texto em português — "Não conseguimos carregar esta página. Tente de novo em alguns instantes." — e botão "Tentar de novo" chamando `reset()`. Dentro do `PageShell`.
  2. `global-error.tsx`: Client Component com `<html lang="pt-BR"><body>` próprios (não pode usar o layout), versão mínima da mesma mensagem, sem `PageShell`.
  3. Nenhum dos dois mostra `error.message` na tela (pode vazar detalhe de infraestrutura); só `console.error` no client.
- **Aceite**: com `DATABASE_URL` inválida em `.env.local`, `npm run dev` e abrir `/` mostra a tela de erro em português, não o overlay cru do Next.
- **Não fazer**: não adicionar serviço de monitoramento/telemetria.

### T8.7 — Admin coerente com a identidade

- **Arquivos**: `src/app/admin/(dashboard)/layout.tsx`, `src/app/admin/(dashboard)/page.tsx`, `src/app/admin/login/page.tsx`
- **Modelo**: haiku
- **Depende de**: —
- **Fazer**:
  1. Login: card branco centralizado (`rounded-3xl bg-background shadow-xl`) sobre `bg-sky`, título "Painel da Capela", input com `field` e botão com `btn btn-confirm`.
  2. Layout do dashboard: header `bg-primary` com `border-b-2 border-accent`, nome da tela e o `LogoutButton`; abaixo, uma linha de navegação com Celebrantes / Eventos / Pedidos, para não ter que voltar ao índice toda vez.
  3. Índice: cards com `rounded-2xl border border-primary/15 shadow` e uma linha de descrição em cada ("Quem celebra cada missa do mês", "Festas e venda de cartela", "Quem pediu cartela").
- **Aceite**: `npm run build`; login e as três telas abrem e continuam funcionando; nenhuma cor escrita fora dos tokens (`grep -n '#[0-9a-fA-F]\{6\}' src/app/admin -r` não retorna nada).
- **Não fazer**: **não encostar** em `src/lib/auth.ts`, `src/proxy.ts`, `src/app/api/login/route.ts` nem em qualquer `requireAdmin()`. Só markup e classe.

### T8.8 — Formulários e listas do admin no dedo

- **Arquivos**: `src/app/admin/(dashboard)/celebrants/page.tsx`, `src/app/admin/(dashboard)/events/page.tsx`, `src/app/admin/(dashboard)/orders/page.tsx`, `src/components/admin/EventForm.tsx`
- **Modelo**: haiku
- **Depende de**: T8.7
- **Fazer**: todo `input`, `select` com `field` e `button` com `btn btn-confirm` (ou `btn btn-secondary` conforme o contexto); `<label>` associado a cada campo; listas que hoje são tabela viram card empilhado abaixo de `md:` (a secretaria usa celular); botão salvar fixo no rodapé da tela de celebrantes (`sticky bottom-0`) para não precisar rolar até o fim.
- **Aceite**: `npm run build`; em 360px nenhuma das quatro telas tem scroll horizontal; salvar celebrante e criar evento continuam funcionando.
- **Não fazer**: não mudar nome de campo de formulário, `name=`, Server Action, validação Zod nem o botão "Testar no WhatsApp".

---

## Fase 9 — Peso da página

`src/assets` tem 2,6 MB. `capela.png` sozinho tem 988 KB e é a primeira coisa que carrega, com
`priority`. O `CLAUDE.md` diz "sem imagem pesada" e o público-alvo abre isso no pátio da igreja com
sinal ruim.

### T9.1 — Converter as imagens para WebP

- **Arquivos**: `src/assets/*`, `src/app/page.tsx` (imports)
- **Modelo**: sonnet
- **Depende de**: —
- **Fazer**:
  1. Converter com `npx --yes sharp-cli` (roda sem virar dependência do projeto — confirmar com o Cleberton antes, por causa da regra de dependências do `CLAUDE.md`).
  2. `capela.png` → `capela.webp`, largura máxima 1600px, qualidade 78.
  3. As cinco fotos quadradas → `.webp`, largura máxima 1000px, qualidade 78.
  4. Atualizar os imports em `src/app/page.tsx:5-9` e apagar os arquivos antigos no mesmo commit (o original continua no histórico do git se precisar).
- **Aceite**: `ls -l src/assets` soma menos de 700 KB; nenhum arquivo passa de 200 KB; `npm run build` passa; a home aberta lado a lado com a versão anterior não tem diferença perceptível.
- **Não fazer**: não trocar o enquadramento, o `object-position` nem o `alt` de nenhuma foto.

### T9.2 — Placeholder borrado e `sizes` honestos

- **Arquivos**: `src/app/page.tsx`, `src/components/MinistrySection.tsx`
- **Modelo**: haiku
- **Depende de**: T9.1
- **Fazer**: `placeholder="blur"` em todas as `<Image>` de import estático (o Next gera o `blurDataURL` sozinho); conferir que o `sizes` do `MinistrySection` (`(min-width: 768px) 33vw, 100vw`) bate com o layout real depois da Fase 8.
- **Aceite**: `npm run build`; com throttle de 3G lento a foto aparece borrada antes de carregar, em vez de buraco branco.

### T9.3 — Medir de novo em 3G lento e 360px

- **Arquivos**: nenhum (verificação)
- **Modelo**: não delegar
- **Depende de**: T9.1, T9.2, Fase 8 inteira
- **Fazer**: `npm run build && npm start`, navegador com throttle 3G lento (400 kbps / 400 ms) em 360px: home, evento, 404 e admin. Anotar o tempo até a primeira missa aparecer na tela.
- **Aceite**: home abaixo de 3s no 3G lento; nenhuma página com scroll horizontal; foco de teclado visível em todas.

---

## Fase 10 — Recorrência mensal (o Grupo de Jovens)

Decisão em aberto do `docs/PLANO.md`, opção (a). Hoje `fixed_schedules` só sabe repetir toda
semana, e o horário do Grupo de Jovens está **escrito na mão** em `src/app/page.tsx:40`
(`"2º sábado do mês (horário a confirmar)"`). Ou seja: mudou o horário, muda o código.

### T10.1 — Coluna `week_of_month` e tipo `youth_group`

- **Arquivos**: `src/db/schema.ts`, `drizzle/` (migration gerada)
- **Modelo**: sonnet
- **Depende de**: —
- **Fazer**:
  1. Em `fixedSchedules`, adicionar `weekOfMonth: integer("week_of_month")` — nulo significa "toda semana", 1 a 5 significa "a n-ésima ocorrência daquele dia da semana no mês".
  2. Acrescentar `"youth_group"` ao enum `activityType` (`celebration_type`) — no fim da lista, para não renumerar nada.
  3. `npx drizzle-kit generate` e revisar o SQL gerado **antes** de aplicar: tem que ser `ALTER TABLE ... ADD COLUMN` e `ALTER TYPE ... ADD VALUE`, nunca `DROP`.
  4. `npx drizzle-kit migrate`.
- **Aceite**: a migration nova aparece em `drizzle/`; `select * from fixed_schedules` mostra as linhas antigas com `week_of_month` nulo; `npm run build` passa.
- **Não fazer**: não mexer em `celebrations`, `events` nem `card_orders`. Não recriar o enum.

### T10.2 — A mesclagem passa a respeitar a ocorrência do mês

- **Arquivos**: `src/lib/schedules.ts`
- **Modelo**: sonnet
- **Depende de**: T10.1
- **Fazer**:
  1. Exportar `export function weekOfMonthFor(dateISO: string): number` = `Math.floor((dia - 1) / 7) + 1`.
  2. Exportar `mergeDay` (hoje é privada) para poder testar sem banco.
  3. Em `mergeDay`, o filtro de `fixed` passa a ser: mesmo `weekday` **e** (`weekOfMonth == null` ou `weekOfMonth === weekOfMonthFor(dateISO)`).
  4. `ACTIVITY_TYPE_LABELS` ganha `youth_group: "Grupo de Jovens"`; `getActivityHighlights` passa a devolver também `youth_group`.
- **Aceite**: coberto pelos testes da T11.3; na prática, um registro "sábado, 2ª ocorrência" aparece na grade só na semana certa.
- **Não fazer**: não mudar a assinatura pública de `getWeekSchedule` nem de `getNextMass`.

### T10.3 — Ícone e rótulo do Grupo de Jovens

- **Arquivos**: `src/components/icons.tsx`, `src/lib/format.ts`, `src/app/page.tsx`, `src/db/seed.ts`
- **Modelo**: haiku
- **Depende de**: T10.2
- **Fazer**:
  1. `ACTIVITY_ICONS` ganha a entrada `youth_group`.
  2. `formatOccurrenceLabel(weekOfMonth, weekday, time)` em `format.ts` devolvendo `"2º sábado do mês · 19h30"` (e só `"sábado · 19h30"` quando `weekOfMonth` for nulo).
  3. Apagar a constante `YOUTH_GROUP_SCHEDULE_LABEL` de `src/app/page.tsx:40` e montar o rótulo a partir de `getActivityHighlights().youth_group`, com fallback "Consulte o mural da capela" igual às outras seções.
  4. Acrescentar o Grupo de Jovens ao `seed.ts` com `weekOfMonth: 2`, `weekday: 6`.
- **Aceite**: `npm run build`; a home mostra o horário do Grupo de Jovens vindo do banco; mudar o registro no banco muda o texto na tela.
- **Não fazer**: não inventar o horário — usar o que o Cleberton confirmar (hoje o texto diz "a confirmar").

### T10.4 — Admin da grade fixa ⚠ confirmar antes

- **Arquivos**: cria `src/app/admin/(dashboard)/schedules/page.tsx` e `.../schedules/actions.ts`; edita `src/app/admin/(dashboard)/layout.tsx`
- **Modelo**: sonnet
- **Depende de**: T10.2, T8.7
- **Fazer**: tela listando `fixed_schedules` agrupada por dia da semana, com editar/criar/desativar. Campos: dia da semana, horário, descrição, tipo, "toda semana ou n-ésima do mês", ativo. Server Actions com `requireAdmin()` na primeira linha, Zod no body, `revalidatePath("/")` no fim.
- **Aceite**: criar um horário pela tela e vê-lo na home; desativar e vê-lo sumir; `curl -X POST` sem cookie volta 307/401.
- **Não fazer**: não expor exclusão definitiva — desativar (`active: false`) basta e é reversível.
- **Decisão pendente**: vale a pena? Sem isso, mudar o horário de uma missa continua exigindo um desenvolvedor. Recomendo que sim, logo depois da Fase 8.

---

## Fase 11 — Robustez

O site funciona, mas tudo que foi validado até aqui foi validado na mão. Um refactor da Fase 8 ou
da Fase 10 pode quebrar o cálculo da próxima missa e ninguém fica sabendo até um domingo de manhã.

### T11.1 — Escolher o runner de teste ⚠ decisão do Cleberton

- **Modelo**: não delegar
- **Contexto**: o Node local é o v20.14.0, que saiu do suporte em abril de 2026 e não roda TypeScript direto.
- **Opções**:
  - **(a) Recomendada** — subir para o Node 24 LTS e usar o `node --test` nativo com type stripping. Zero dependência nova, alinhado com "o projeto deve ficar leve".
  - (b) `vitest` como `devDependency` — mais confortável (watch, melhores mensagens), custo de uma dependência de peso razoável.
  - (c) `tsx` + `node --test` — uma dependência pequena, sem precisar subir o Node.
- **Aceite**: decisão registrada aqui neste arquivo e `"test"` no `package.json`.

### T11.2 — Teste das funções puras de telefone, dinheiro e data

- **Arquivos**: cria `src/lib/phone.test.ts` e `src/lib/format.test.ts`
- **Modelo**: haiku
- **Depende de**: T11.1
- **Fazer** — casos obrigatórios:
  - `normalizePhone("(42) 99999-8888")` → `"5542999998888"`; já com 55 não duplica; 9 dígitos continua inválido em `isValidPhone`.
  - `formatPhone("5542999998888")` → `"(42) 99999-8888"`; fixo de 8 dígitos também formata.
  - `whatsappLink` escapa a mensagem (espaço vira `%20`, quebra de linha vira `%0A`).
  - `parseCurrencyToCents("10,50")` → `1050`; `"10.5"` → `1050`; `"abc"` → `null`; negativo → `null`.
  - `parseSaoPauloDateTime("2026-10-12T15:00")` → instante `18:00Z`; ida e volta com `toSaoPauloDateTimeLocal` devolve a string original.
  - `formatTime("19:30:00")` → `"19h30"`; `"08:00:00"` → `"08h"`.
- **Aceite**: `npm test` verde.
- **Não fazer**: não testar componente React nem nada que toque no banco.

### T11.3 — Teste da mesclagem de horários

- **Arquivos**: cria `src/lib/schedules.test.ts`
- **Modelo**: sonnet
- **Depende de**: T11.1, T10.2
- **Fazer** — testar `mergeDay` e `weekOfMonthFor` (puras, sem banco), com fixtures montadas à mão:
  - uma exceção com o mesmo horário de um fixo sobrescreve celebrante e nota, sem duplicar a linha;
  - uma exceção em horário novo entra como item extra;
  - `canceled: true` some da lista;
  - a ordenação é por horário crescente;
  - fixo com `weekOfMonth: 2` aparece no dia 8 e não aparece no dia 1 (para um mês que começa no sábado, confira a conta antes de escrever o caso);
  - `weekOfMonthFor("2026-09-01")` → 1; `"2026-09-07"` → 1; `"2026-09-08"` → 2.
- **Aceite**: `npm test` verde; comentar no teste o motivo de cada data escolhida.

### T11.4 — Teste do rate limit

- **Arquivos**: `src/lib/rate-limit.ts`, cria `src/lib/rate-limit.test.ts`
- **Modelo**: sonnet
- **Depende de**: T11.1
- **Fazer**: exportar `WINDOW_MS` e `MAX_ATTEMPTS` e aceitar um parâmetro opcional `now = Date.now()` em `tooManyAttempts`, para poder testar a expiração da janela sem relógio falso. Casos: 5 tentativas passam, a 6ª bloqueia; chave diferente não interfere; passada a janela, libera de novo.
- **Aceite**: `npm test` verde; `POST /api/login` e `POST /api/orders` continuam funcionando sem mudança de chamada.
- **Não fazer**: não mudar `MAX_ATTEMPTS` nem `WINDOW_MS`.

### T11.5 — `npm test` e CI no GitHub

- **Arquivos**: `package.json`, cria `.github/workflows/ci.yml`
- **Modelo**: haiku
- **Depende de**: T11.2
- **Fazer**: script `"test"` conforme a decisão da T11.1; workflow rodando em `push` e `pull_request`, Node da versão decidida, `npm ci`, `npm run lint`, `npm test`, `npm run build`. Sem env var real — o banco e o `JWT_SECRET` são lidos preguiçosamente, o build passa sem eles.
- **Aceite**: workflow verde no GitHub no primeiro push.
- **Não fazer**: não colocar segredo nenhum no workflow, nem step de deploy (a Vercel já cuida disso).

### T11.6 — Rate limit que sobrevive ao serverless ⚠ decisão

- **Arquivos**: `src/lib/rate-limit.ts`, `src/db/schema.ts`, migration
- **Modelo**: sonnet
- **Depende de**: T11.4
- **Contexto**: o limite é um `Map` em memória do processo. Na Vercel, cada instância tem o seu — com duas instâncias quentes, o teto vira 10 tentativas, e ele zera a cada deploy. O `CLAUDE.md` pede 5 por IP a cada 15 minutos, e hoje isso não é garantido.
- **Fazer** (se aprovado): tabela `rate_limits` (`key` text pk, `attempts` int, `window_start` timestamptz), `tooManyAttempts` vira `async` com uma consulta e um upsert via Drizzle. Limpeza: apagar linhas com `window_start` mais velho que a janela na própria chamada.
- **Aceite**: dois processos `npm run dev` em portas diferentes compartilham o limite; a 6ª tentativa bloqueia mesmo alternando entre eles.
- **Alternativa**: aceitar o limite atual e escrever isso explicitamente aqui como decisão consciente. Para o volume desta capela, é defensável — mas é a decisão do Cleberton, não a minha.

### T11.7 — Auditoria de segurança

- **Arquivos**: nenhum (leitura)
- **Modelo**: não delegar
- **Depende de**: Fases 8 e 10 concluídas
- **Fazer**: rodar `/security-review` sobre o diff acumulado e conferir à mão a lista do `CLAUDE.md`:
  - `requireAdmin()` na primeira linha de **toda** Server Action e Route Handler administrativa (incluindo as novas da T10.4);
  - nenhum `db.execute` com string, nenhum `sql.unsafe`, nenhuma concatenação em query;
  - Zod em todo body, sem `as` forçando tipo;
  - nenhum segredo em `NEXT_PUBLIC_*`;
  - `.env.local` fora do git (`git check-ignore -v .env.local`);
  - `POST /api/orders` continua com quantidade limitada e rate limit.
- **Aceite**: relatório escrito, com cada item marcado ou com uma tarefa nova criada aqui.

### T11.8 — Acessibilidade: auditoria

- **Arquivos**: nenhum (leitura)
- **Modelo**: sonnet
- **Depende de**: Fase 8
- **Fazer**: levantar (sem corrigir) — contraste real de cada par cor/fundo em uso, com destaque para `text-accent` (`#D4A537`) sobre fundo claro, que fica em torno de 2:1 e reprova no WCAG AA; ordem de headings (`h1` único por página, sem pular nível); `aria-label` no `<nav>`; `alt` de cada imagem; foco visível em elemento interativo novo; o `<iframe>` do mapa com `title`.
- **Aceite**: lista de achados com arquivo e linha, em `.claude/relatorios/a11y.md`.

### T11.9 — Acessibilidade: correção

- **Arquivos**: os apontados pela T11.8
- **Modelo**: haiku
- **Depende de**: T11.8
- **Fazer**: aplicar item a item. Onde o dourado for texto sobre fundo claro, trocar por `text-primary` e deixar o dourado como fundo, borda ou ícone — que é como ele já funciona bem na home.
- **Aceite**: `npm run build`; cada item do relatório marcado; nenhuma cor nova fora dos tokens.

---

## Fase 12 — Features novas ⚠ escopo a definir

O Cleberton pediu features novas mas ainda não disse quais. As candidatas abaixo estão ordenadas
pelo que eu acho que rende mais para esta capela. **Nenhuma entra em execução antes de ser
escolhida** — quando escolher, o `/criar-plano` detalha a fase com o mesmo formato das anteriores.

### F1 — Avisos da semana (recomendada)

O que mais se aproxima do mural físico da igreja: um bloco de recados curtos, com validade, que a
secretaria escreve sem depender de ninguém. Tabela `notices` (`id`, `text`, `starts_at`,
`ends_at`, `pinned`), bloco no topo da home abaixo da próxima missa, tela em
`/admin/(dashboard)/notices`. Pequeno, isolado do resto, e é o pedido que toda paróquia faz na
segunda semana de uso.

### F2 — PIX na venda de cartela

Já está listado como decisão em aberto no `docs/PLANO.md`. Versão sem dependência nova: chave PIX
em variável de ambiente, mostrada na página do evento e incluída no texto do WhatsApp, com botão
"copiar chave". QR Code exigiria uma biblioteca — precisa de aprovação, e provavelmente não
compensa: quem está no celular copia e cola.

### F3 — Galeria de fotos

`/galeria` com as fotos da comunidade. Começar estático (arquivos em `src/assets`, como hoje) é
barato; deixar a secretaria subir foto exige armazenamento de blob (Vercel Blob ou similar), o que
significa custo e dependência — decidir antes de começar.

### F4 — Pedido de oração

Formulário simples que abre o WhatsApp da capela com o pedido montado, sem banco nenhum.
Reaproveita `whatsappLink` e o padrão do `BuyCards`. É a menor de todas.

---

## Fase 13 — Refino visual da home (cabeçalho, próxima missa, ícones, botões)

Depois da Fase D o sistema de design existe, mas a aplicação na home ainda tem sobras: o header
empurra a foto do início para baixo em vez de flutuar sobre ela; o cartão "Próxima Missa" empilha
três parágrafos soltos sem hierarquia; os ícones em `icons/activity.tsx` e `icons/social.tsx` são
desenhos abstratos que não comunicam o que representam (um "cálice" que não parece cálice, um
Facebook que é um círculo enquanto o Instagram é um quadrado — sem linguagem visual em comum); o
selo de horário do `MinistrySection` é um retângulo de canto reto no meio de um site todo
arredondado; os botões escurecem e trocam o texto para branco no hover, o oposto do que o
Cleberton quer; o link "Seguir no Instagram" no meio do conteúdo não muda nada ao passar o mouse; e
o fundo azul ao redor do painel branco é uma cor chapada sem textura.

Esta fase mexe só em `src/app/page.tsx`, `src/components/MinistrySection.tsx`,
`src/components/icons/activity.tsx`, `src/components/icons/social.tsx` e `src/app/globals.css` —
nenhuma Server Action, nenhuma rota, nenhum dado. Roda **antes** da Fase 8, pelo mesmo motivo da
Fase D: T13.1 e T13.2 citam número de linha do `page.tsx` como está hoje, antes do `PageShell`
(T8.1) mover esse markup para dentro de um componente.

### T13.1 — Header flutuando sobre a foto do início

- **Arquivos**: `src/app/page.tsx`
- **Modelo**: haiku
- **Depende de**: —
- **Fazer**:
  1. Em `page.tsx:82-106`, hoje a estrutura é `<Header />` seguido de `<main>` (que abre com o
     banner condicional da festa da padroeira e, na sequência, a `<section id="inicio">` com a
     foto). Como `Header` vem antes da foto no fluxo normal do documento, ele empurra a foto para
     baixo em vez de flutuar sobre ela.
  2. Tirar a `<section id="inicio">…</section>` (linhas 94-106) de dentro do `<main>` e colocá-la
     num wrapper novo, junto com `<Header />`, **antes** do `<main>`:
     ```tsx
     <div className="grid">
       <section
         id="inicio"
         className="photo-vignette relative col-start-1 row-start-1 aspect-[4/3] w-full overflow-hidden sm:rounded-t-3xl"
       >
         <Image
           src={capelaPhoto}
           alt="Fachada da Capela Nossa Senhora Aparecida"
           fill
           priority
           sizes="100vw"
           className="object-cover"
         />
       </section>
       <div className="col-start-1 row-start-1 self-start">
         <Header />
       </div>
     </div>
     <main className="flex-1">
       {isPatronessFeastWindow() && (
         …resto igual, começando pelo banner da padroeira…
     ```
  3. `col-start-1 row-start-1` nos dois elementos os empilha na mesma célula do grid (a foto e o
     header ocupam o mesmo espaço); `self-start` no wrapper do `Header` evita que ele estique até a
     altura da foto — assim só a área do próprio header fica clicável por cima da imagem, o resto da
     foto continua "atrás". Não editar `src/components/Header.tsx`: ele já é `sticky top-3 z-40` e
     isso é suficiente para flutuar sobre a foto e continuar grudado no topo ao rolar a página.
  4. Conferir que o banner da padroeira (`isPatronessFeastWindow()`) e o `<h1>` continuam sendo os
     dois primeiros itens dentro de `<main>`, na mesma ordem de antes — só a foto e o header saem de
     lá.
- **Aceite**: `npm run build`; abrir a home — a foto cobre desde o topo do painel (sem faixa vazia
  acima dela), o header aparece flutuando por cima da foto, e ao rolar a página o header continua
  visível no topo.
- **Não fazer**: não mudar `Header.tsx`, não mudar o `aspect-[4/3]` nem o `object-cover` da foto.

### T13.2 — Cartão "Próxima Missa" mais clean

- **Arquivos**: `src/app/page.tsx`
- **Modelo**: haiku
- **Depende de**: T13.1
- **Fazer**: trocar o bloco do `nextMass` (hoje três `<p>` soltos, um embaixo do outro) por:
  ```tsx
  {nextMass && (
    <section className="relative z-10 mx-3 -mt-6 rounded-3xl bg-accent px-5 py-6 text-primary shadow-card sm:-mt-8">
      <p className="text-caption font-semibold uppercase tracking-widest text-primary/70">Próxima Missa</p>
      <p className="mt-2 text-display leading-tight sm:text-5xl">
        {WEEKDAY_LABELS[nextMass.weekday]}, {formatShortDate(nextMass.date)} às {formatTime(nextMass.time)}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-primary/15 pt-3 text-body">
        <span className="font-semibold">Celebrante:</span>
        <span>{nextMass.celebrant ?? "A definir"}</span>
      </div>
      {nextMass.note && <p className="mt-2 text-caption italic text-primary/80">{nextMass.note}</p>}
    </section>
  )}
  ```
  A mudança real: `leading-tight` na data/hora (evita linha solta grande demais), uma borda fina
  separando o bloco do celebrante do resto (em vez de mais um parágrafo empilhado) e a nota em
  itálico/tom mais claro para marcar que é informação secundária.
- **Aceite**: `npm run build`; o cartão continua sendo a informação mais destacada da home (regra
  do `CLAUDE.md`), agora com uma separação visual clara entre data/hora e celebrante.
- **Não fazer**: não remover o fundo dourado (`bg-accent`) nem diminuir o tamanho da data/hora — é
  a informação mais importante da home.

### T13.3 — Redesenhar os ícones de atividade e de redes sociais

- **Arquivos**: `src/components/icons/activity.tsx`, `src/components/icons/social.tsx`
- **Modelo**: haiku
- **Depende de**: —
- **Contexto**: os ícones atuais são formas abstratas que não comunicam o que representam (o
  `MassIcon` não parece um cálice, por exemplo), e o par Instagram/Facebook usa duas linguagens
  diferentes (quadrado arredondado vs. círculo). Esta tarefa troca **só o conteúdo interno de cada
  `<svg>`** por desenhos mais literais e consistentes entre si (mesmo `viewBox`, mesma
  `strokeWidth`, mesmo `strokeLinecap`/`strokeLinejoin`) — não muda nome de export, nem a assinatura
  `{ className }: { className?: string }`, nem o `Record<…, ComponentType<…>>` de `ACTIVITY_ICONS`.
- **Fazer**:
  1. Substituir o conteúdo de `src/components/icons/activity.tsx` por:
     ```tsx
     import type { ComponentType } from "react";

     export function MassIcon({ className }: { className?: string }) {
       return (
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
           <path d="M7 3h10" />
           <path d="M7 3c0 4.5 2 7 5 7s5-2.5 5-7" />
           <path d="M12 10v7" />
           <path d="M8 21h8" />
           <path d="M12 17v4" />
         </svg>
       );
     }

     export function PrayerGroupIcon({ className }: { className?: string }) {
       return (
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
           <path d="M12 3v16" />
           <path d="M12 3c-3 1-4 5-3 9 1 3 2 5 3 6" />
           <path d="M12 3c3 1 4 5 3 9-1 3-2 5-3 6" />
           <path d="M7 12c-1 2-1 4 0 6" />
           <path d="M17 12c1 2 1 4 0 6" />
         </svg>
       );
     }

     export function CatechismIcon({ className }: { className?: string }) {
       return (
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
           <path d="M12 6c-1.5-1.5-4-2-7-1.5v13c3-.5 5.5 0 7 1.5 1.5-1.5 4-2 7-1.5v-13c-3-.5-5.5 0-7 1.5Z" />
           <path d="M12 6v13" />
         </svg>
       );
     }

     export function YouthGroupIcon({ className }: { className?: string }) {
       return (
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
           <circle cx="9" cy="7" r="2.5" />
           <circle cx="16" cy="8.5" r="2" />
           <path d="M4 20c0-3.3 2.2-5.5 5-5.5s5 2.2 5 5.5" />
           <path d="M14.5 15c2.2.3 3.5 2 3.5 5" />
         </svg>
       );
     }

     export function RosaryIcon({ className }: { className?: string }) {
       return (
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
           <circle cx="12" cy="8.5" r="5.5" strokeDasharray="1.4 2.6" />
           <path d="M12 14v7" />
           <path d="M9.5 17.5h5" />
         </svg>
       );
     }

     export function NovenaIcon({ className }: { className?: string }) {
       return (
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
           <path d="M12 3c1.2 1.6 1.2 2.9 0 4.2-1.2-1.3-1.2-2.6 0-4.2Z" />
           <rect x="9" y="8" width="6" height="12" rx="1" />
           <path d="M9 12h6" />
         </svg>
       );
     }

     export const ACTIVITY_ICONS: Record<
       "mass" | "rosary" | "novena" | "prayer_group" | "catechism",
       ComponentType<{ className?: string }>
     > = {
       mass: MassIcon,
       rosary: RosaryIcon,
       novena: NovenaIcon,
       prayer_group: PrayerGroupIcon,
       catechism: CatechismIcon,
     };
     ```
  2. Substituir o conteúdo de `src/components/icons/social.tsx` por:
     ```tsx
     export function InstagramIcon({ className }: { className?: string }) {
       return (
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
           <rect x="3" y="3" width="18" height="18" rx="5" />
           <circle cx="12" cy="12" r="4" />
           <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
         </svg>
       );
     }

     export function FacebookIcon({ className }: { className?: string }) {
       return (
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
           <rect x="3" y="3" width="18" height="18" rx="5" />
           <path d="M14 21v-7h2.5l.4-3H14V9c0-.9.3-1.5 1.6-1.5H17V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V11H8v3h2.5v7" />
         </svg>
       );
     }
     ```
     Agora os dois ícones sociais compartilham o mesmo selo de quadrado arredondado
     (`rect … rx="5"`), só o glifo interno muda — é a consistência que faltava.
  3. Não mexer em `src/components/icons/index.ts` — os exports continuam com o mesmo nome, o
     barrel file não precisa mudar.
- **Aceite**: `npm run build`; abrir a home e o rodapé — cada ícone é reconhecível como o que
  representa (cálice, mãos em oração, livro aberto, duas pessoas, terço com cruz, vela), e
  Instagram/Facebook têm o mesmo formato de selo.
- **Não fazer**: não mudar `h-5 w-5` nem nenhuma outra classe de tamanho/cor de quem chama os
  ícones — só o miolo do `<svg>`.

### T13.4 — MinistrySection: badge do horário e hover do Instagram

- **Arquivos**: `src/components/MinistrySection.tsx`
- **Modelo**: haiku
- **Depende de**: —
- **Fazer**:
  1. `MinistrySection.tsx:67-69`, o selo do horário (`<p className="mt-3 inline-block bg-primary
     px-3 py-2 text-base font-semibold text-white">`) tem cantos retos, destoando do resto do site
     (tudo arredondado). Trocar `inline-block … text-base` por `inline-block rounded-full … text-body
     shadow-card`:
     ```tsx
     <p className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-body font-semibold text-white shadow-card">
       {scheduleLabel}
     </p>
     ```
  2. `MinistrySection.tsx:70-79`, o link "Seguir no Instagram" não tem nenhum estado de hover hoje.
     Trocar a `className` do `<a>` por:
     ```tsx
     className="mt-3 inline-flex min-h-11 items-center gap-2 text-body font-semibold text-primary-light transition-colors hover:text-accent-dark"
     ```
     `inline-flex` no lugar de `flex` faz a área de hover acompanhar só o texto/ícone (hoje o link
     estica até a largura do container, então passar o mouse longe do texto já mudava o estado, o
     que não parece intencional); `hover:text-accent-dark` é o mesmo dourado usado no hover dos
     ícones do rodapé (`Footer.tsx:25,34` usa `hover:text-accent` sobre fundo escuro — aqui o fundo é
     claro, então precisa ser `accent-dark`, não `accent` puro, para não reprovar contraste — mesma
     regra do `CLAUDE.md` sobre a paleta).
- **Aceite**: `npm run build`; passar o mouse sobre "Seguir no Instagram" em qualquer seção muda a
  cor do texto e do ícone suavemente; o selo de horário aparece como pílula arredondada, não
  retângulo.
- **Não fazer**: não mudar o texto "Seguir no Instagram" nem a lógica de `instagram &&`.

### T13.5 — Hover dos botões: mais claro, texto neutro

- **Arquivos**: `src/app/globals.css`
- **Modelo**: sonnet
- **Depende de**: —
- **Contexto**: hoje `btn-confirm`/`btn-delete`/`btn-secondary` escurecem no hover e trocam o texto
  para branco (`globals.css:117-147`). O Cleberton pediu o oposto: o texto deve ficar num "preto
  mais claro" (o token `foreground`, `#1f2937`, em vez de `primary`/`danger` coloridos) e continuar
  praticamente o mesmo no hover; quem muda é o fundo, que deve clarear, não escurecer.
- **Fazer**:
  1. Trocar as três `@utility` em `globals.css:117-147` por:
     ```css
     @utility btn-confirm {
       background-color: var(--color-accent);
       color: var(--color-foreground);

       &:hover {
         background-color: color-mix(in srgb, var(--color-accent) 65%, white);
       }
     }

     @utility btn-delete {
       background-color: transparent;
       color: var(--color-foreground);
       border: 2px solid var(--color-danger);

       &:hover {
         background-color: color-mix(in srgb, var(--color-danger) 10%, white);
       }
     }

     @utility btn-secondary {
       background-color: transparent;
       color: var(--color-foreground);
       border: 2px solid var(--color-primary-light);

       &:hover {
         background-color: color-mix(in srgb, var(--color-primary-light) 10%, white);
       }
     }
     ```
     `color-mix(in srgb, X 65%, white)` gera uma variante mais clara de `X` sem precisar cadastrar um
     hex novo por token — é CSS puro, sem depender de nenhuma lib.
  2. Calcular o contraste (fórmula WCAG, a mesma da T D.3) de `foreground` (`#1f2937`) sobre
     `accent` (`#d4a537`, o estado padrão do `btn-confirm`) e documentar o resultado num comentário
     acima do bloco `@utility btn-confirm`, no formato `/* foreground sobre accent: X:1 */`. Se ficar
     abaixo de 4.5:1, escurecer só o `color-mix` do hover (não o `--color-accent` em si) até passar.
- **Aceite**: `npm run build`; `grep -n "color-mix" src/app/globals.css` mostra as três ocorrências;
  um `<button className="btn btn-confirm">Salvar</button>` de teste mostra texto escuro tanto parado
  quanto no hover, e o fundo do hover é visivelmente mais claro que o fundo padrão.
- **Não fazer**: não mudar `btn-icon` nem `field` — só as três variantes de `btn`. Não adicionar
  nenhuma dependência para o `color-mix` (é CSS nativo, já suportado pelos navegadores que a Vercel
  atende).

### T13.6 — Textura sutil no fundo da home

- **Arquivos**: `src/app/globals.css`, `src/app/page.tsx`
- **Modelo**: haiku
- **Depende de**: T13.2, T13.5
- **Fazer**:
  1. Em `globals.css`, acrescentar (perto de `--shadow-card`/`--shadow-lifted`, dentro do
     `@theme inline` não — como utility separada, fora do `@theme`):
     ```css
     @utility bg-sky-texture {
       background-color: var(--color-sky);
       background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg fill='none' stroke='%231B3A6B' stroke-opacity='0.08' stroke-width='1.5'%3E%3Cpath d='M28 4c-6 8-6 16 0 24M28 28c-6 8-6 16 0 24'/%3E%3C/g%3E%3C/svg%3E");
       background-repeat: repeat;
     }
     ```
     É um padrão de arcos repetido (ecoa o `ArchDivider` já usado na home), em `primary` a 8% de
     opacidade sobre o azul — sutil o bastante para não pesar a página, e é uma `data:` URI inline,
     sem requisição HTTP nem arquivo novo em `src/assets`.
  2. Em `page.tsx`, trocar `<div className="min-h-screen bg-sky">` por
     `<div className="min-h-screen bg-sky-texture">`.
- **Aceite**: `npm run build`; a faixa azul ao redor do painel branco mostra uma textura discreta de
  arcos, não uma cor totalmente chapada; em 390px de largura não aparece scroll horizontal.
- **Não fazer**: não trocar a cor base `--sky`, não adicionar nenhum arquivo de imagem novo.

---

## Decisões em aberto

| # | Decisão | Bloqueia |
|---|---|---|
| 1 | Runner de teste e versão do Node (T11.1) | Fase 11 inteira |
| 2 | Rate limit no banco ou aceitar o de memória (T11.6) | T11.6 |
| 3 | Admin da grade fixa vale a pena? (T10.4) | T10.4 |
| 4 | Horário real do Grupo de Jovens (hoje "a confirmar") | T10.3 |
| 5 | Quais features novas entram na Fase 12 | Fase 12 |
| 6 | Domínio próprio (~R$40/ano) ou seguir no `.vercel.app` | — |
| 7 | Quem tem a senha do admin — se for mais de uma pessoa, um dia vira usuário de verdade | — |
| 8 | `npx sharp-cli` para converter as imagens (não vira dependência, mas é ferramenta externa) | T9.1 |

---

## Ordem sugerida de execução

A Fase D roda **antes** da Fase 8: as tarefas T D.13/T D.14 citam número de linha do `page.tsx` e do
`events/[id]/page.tsx` como estão hoje, antes do `PageShell` (T8.1) mover esse markup. Se a Fase 8 for
executada primeiro, quem rodar T D.12/T D.13 precisa localizar o markup equivalente dentro de
`PageShell.tsx` em vez de `page.tsx` — mesma classe, arquivo diferente.

```
Fase D  →  (TD.1 ∥ TD.2 ∥ TD.4 ∥ TD.5 ∥ TD.6) → TD.3 (depende de TD.2)
           TD.7 (depende de TD.2, TD.5) → TD.8 (depende de TD.2) → TD.9 (depende de TD.2)
           TD.10 (depende de TD.2)
           TD.11 (depende de TD.5, TD.7, TD.9)
           (TD.12 ∥ TD.13 ∥ TD.14 ∥ TD.15) — cada uma só depois das utilities de que precisa, ver "Depende de"
           TD.16 (depende de TD.7) ∥ TD.17 (depende de TD.9, TD.7) ∥ TD.18 (depende de TD.5, TD.16)
           TD.19 por último (depende de TD.2 a TD.10)

Fase 13 →  (T13.3 ∥ T13.4) ∥ (T13.1 → T13.2) ∥ T13.5 → T13.6 (depende de T13.2 e T13.5)
           roda antes da Fase 8, mesmo motivo da Fase D (T13.1/T13.2 citam linha do page.tsx atual)
Fase 8  →  T8.1 → T8.2 → (T8.3 ∥ T8.5 ∥ T8.6) → T8.4
           T8.7 → T8.8                            (em paralelo com a linha de cima)
Fase 9  →  T9.1 → T9.2 → T9.3
Fase 10 →  T10.1 → T10.2 → T10.3 → [T10.4 se aprovada]
Fase 11 →  T11.1 → (T11.2 ∥ T11.3 ∥ T11.4) → T11.5 → T11.8 → T11.9 → T11.7
Fase 12 →  depois de escolher o escopo
```

O `∥` marca o que pode rodar em paralelo, porque não compartilha arquivo.
