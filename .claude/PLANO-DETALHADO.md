# Plano detalhado — Sistema de papéis (roles)

Plano ativo do projeto. O `PLANO-DETALHADO.md` anterior (Fases D e 8 a 12 — sistema de design,
identidade visual, PageShell, acessibilidade) foi concluído e removido por decisão do Cleberton;
está recuperável no histórico do git (`git log --all --oneline -- .claude/PLANO-DETALHADO.md`) se
precisar reconsultar alguma tarefa. Ficou pendente daquele plano, sem registro em arquivo agora:
Fase 9 (WebP das imagens — precisa aprovar `npx sharp-cli`), Fase 10 (recorrência mensal do Grupo
de Jovens — migration + horário "a confirmar"), T11.1/T11.6/T11.7 (runner de teste, rate limit em
banco, auditoria de segurança) e Fase 12 (features novas, escopo indefinido). Nenhuma dessas foi
esquecida — só não é o foco deste arquivo agora.

Histórico das Fases 0 a 7: `docs/PLANO.md`.

Escrito para ser executado tarefa a tarefa, uma por subagente — ver `/executar-plano`.
Para acrescentar fases aqui, ver `/criar-plano`.

---

## Painel de progresso

| Tarefa | O quê | Modelo | Status |
|---|---|---|---|
| TR1.1 | Schema: `user_role` e tabela `users` | sonnet | [x] |
| TR1.2 | Sessão carrega usuário real (id + role) | sonnet | [x] |
| TR1.3 | Atualizar os 2 call sites de `requireAdmin` | sonnet | [x] |
| TR1.4 | Login por usuário (username + senha) | sonnet | [x] |
| TR1.5 | Script de bootstrap do primeiro usuário | sonnet | [x] |
| TR1.6 | Rodar o bootstrap e criar o admin real | não delegar | [ ] ⚠ |
| TR1.7 | Admin UI: gerenciar usuários | sonnet | [x] |
| TR1.8 | Atualizar CLAUDE.md (auth por usuário) | sonnet | [x] |
| TR2.1 | Schema: `pastorals`, `pastoral_members`, `users.pastoral_id` | sonnet | [x] |
| TR2.2 | Server actions de membros da pastoral (escopadas) | sonnet | [x] |
| TR2.3 | Tela `/admin/pastorals` (coordenador de pastoral) | sonnet | [x] |
| TR2.4 | Tela `/admin/pastorals/manage` (admin: lista de pastorais) | sonnet | [x] |
| TR3.1 | Schema: turmas, catequizandos, presença | sonnet | [x] |
| TR3.2 | Server actions: turmas e catequistas | sonnet | [x] |
| TR3.3 | Server actions: catequizandos | sonnet | [x] |
| TR3.4 | Tela `/admin/catechesis` (coordenador de catequese) | sonnet | [x] |
| TR3.5 | Server action: marcar presença/falta | sonnet | [x] |
| TR3.6 | Tela `/admin/my-classes` (catequista) | sonnet | [x] |
| TR4.1 | Navegação do admin por papel | sonnet | [x] |
| TR4.2 | Auditoria final de `requireRole` | não delegar | [x] |
| TUI.1 | Instalar dependências da fase e utilitário `cn()` | sonnet | [x] |
| TUI.2 | `Typography` | haiku | [x] |
| TUI.3 | `Button` e `IconButton` | haiku | [x] |
| TUI.4 | `Input` | haiku | [x] |
| TUI.5 | `Checkbox` (Radix) | sonnet | [x] |
| TUI.6 | `Select` (Radix) | sonnet | [x] |
| TUI.7 | `Popover` (Radix) | sonnet | [x] |
| TUI.8 | `DatePicker` (react-day-picker) | sonnet | [x] |
| TUI.9 | `Table` (primitivos) | haiku | [x] |
| TUI.10 | `DataTable` (TanStack Table) | sonnet | [x] |
| TUI.11 | Barrel export (`src/components/ui/index.ts`) | haiku | [x] |
| TUI.12 | Documentar no CLAUDE.md | haiku | [x] |

`⚠` = precisa de uma ação do Cleberton antes de rodar (não é decisão — é ele digitar a própria senha).

**Para executar**: `/executar-plano Fase R1` (ou `TR1.3`, ou `tudo`).

---

## Como ler uma tarefa

| Campo | Para que serve |
|---|---|
| **Arquivos** | Todo path que a tarefa pode tocar. Fora dessa lista, não mexe. |
| **Modelo** | `haiku` (mecânico) ou `sonnet` (banco, auth, Zod, dinheiro — quase tudo aqui é `sonnet`, porque é tudo perto de autenticação). `não delegar` = o orquestrador ou o Cleberton fazem. |
| **Depende de** | Tarefas que precisam estar `[x]` antes desta começar. |
| **Fazer** | O passo a passo concreto. |
| **Aceite** | Como saber que terminou. |
| **Não fazer** | O limite. |

Duas tarefas que tocam o **mesmo arquivo** nunca rodam em paralelo, mesmo sem dependência declarada.

---

## Por que este plano existe

Hoje o admin tem **uma senha única**, compartilhada, guardada como hash Argon2id numa env var
(`ADMIN_PASSWORD_HASH_BASE64`) — documentado assim no `CLAUDE.md`. Quem loga vira "admin" para tudo;
não existe conceito de identidade nem de permissão por seção. O `docs/PLANO.md` já registrava isso
como decisão em aberto: *"Quem vai ter a senha do admin? Se for mais de uma pessoa, em algum
momento vale trocar a senha única por usuários de verdade."*

O pedido do Cleberton — coordenador de pastoral cadastra gente da própria pastoral, catequista vê
só as próprias turmas — só funciona se o sistema souber **quem** está logado. Isso não dá para fazer
com uma senha compartilhada: é preciso conta por pessoa. Confirmado com o Cleberton (ver decisão
tomada nesta sessão): contas individuais, login por **nome de usuário** (não e-mail, porque
coordenador de pastoral e catequista costumam ser leigos sem hábito de checar e-mail), senha com
hash Argon2id por pessoa — mesma biblioteca já usada hoje (`@node-rs/argon2`, já é dependência).

Os 5 papéis pedidos, em inglês (convenção do projeto) e o que cada um faz **nesta primeira leva**:

| Role (enum) | Rótulo em português | Acesso |
|---|---|---|
| `admin` | Administrador | Tudo — incluindo gerenciar outros usuários. |
| `chapel_coordinator` | Coordenador de Capela | Tudo que hoje é "admin" no conteúdo da capela (celebrantes, eventos, pedidos) — hoje é uma capela só, então na prática é quase igual a `admin` menos gerenciar usuários. É o papel que vira "coordenador de uma capela específica" quando o projeto virar multi-capela (fora de escopo agora — só a distinção de papel já existe, pronta para isso). |
| `pastoral_coordinator` | Coordenador de Pastoral | Cadastra pessoas só na própria pastoral (`users.pastoral_id`). |
| `catechesis_coordinator` | Coordenador de Catequese | Cadastra catequistas (usuários com role `catechist`), turmas, catequizandos e horários. |
| `catechist` | Catequista | Vê só as próprias turmas (`catechism_classes.catechist_id = session.userId`); marca presença/falta. |

**Decisão já tomada com o Cleberton nesta sessão** (não reabrir sem confirmar de novo):
autenticação individual por usuário, login por nome de usuário simples. Isso significa atualizar o
`CLAUDE.md` (TR1.8) — a regra "senha única de admin" muda para "cada pessoa tem sua própria conta".

---

## Fase R1 — Fundação: usuários e papéis

Sem isso, nada das fases seguintes tem onde se apoiar — é o pré-requisito de tudo. Troca a sessão
JWT de "só sabe que alguém logou como admin" para "sabe quem logou e com que papel", sem quebrar o
que já funciona (só 2 arquivos chamam `requireAdmin()` hoje: `celebrants/page.tsx` e
`events/actions.ts` — conferido com `grep -rn "requireAdmin" src`).

### TR1.1 — Schema: enum `user_role` e tabela `users`

- **Arquivos**: `src/db/schema.ts`, `drizzle/` (migration gerada)
- **Modelo**: sonnet
- **Depende de**: —
- **Fazer**:
  1. Em `src/db/schema.ts`, acrescentar (não mexer no que já existe — `activityType`,
     `fixedSchedules`, `celebrations`, `events`, `cardOrders` ficam intocados):
     ```ts
     export const userRole = pgEnum("user_role", [
       "admin",
       "chapel_coordinator",
       "pastoral_coordinator",
       "catechesis_coordinator",
       "catechist",
     ]);

     export const users = pgTable("users", {
       id: serial("id").primaryKey(),
       username: text("username").notNull().unique(),
       name: text("name").notNull(),
       passwordHash: text("password_hash").notNull(),
       role: userRole("role").notNull(),
       active: boolean("active").notNull().default(true),
       createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
     });
     ```
  2. `npx drizzle-kit generate` — revisar o SQL gerado **antes** de aplicar: só pode ter
     `CREATE TYPE "user_role"` e `CREATE TABLE "users"`, nunca `DROP`/`ALTER` em tabela existente.
  3. `npx drizzle-kit migrate`.
- **Aceite**: a migration nova aparece em `drizzle/`; `select * from users;` no Neon devolve tabela
  vazia com as colunas certas; `npm run build` passa.
- **Não fazer**: não adicionar coluna de pastoral/turma na tabela `users` ainda — isso é da Fase R2
  (`pastoral_id`). Não tocar em nenhuma tabela existente.

### TR1.2 — Sessão carrega usuário real (id + role)

- **Arquivos**: `src/lib/session-token.ts`, `src/lib/auth.ts`, `src/proxy.ts`
- **Modelo**: sonnet
- **Depende de**: TR1.1
- **Fazer**:
  1. `session-token.ts`: `signSessionToken()` passa a receber `{ userId, role }` como parâmetro e
     assinar isso no payload JWT, em vez do `{ role: "admin" }` fixo de hoje. Exportar um tipo
     `SessionPayload = { userId: number; role: (typeof userRole.enumValues)[number] }`.
  2. `verifySessionToken` (hoje devolve `boolean`) passa a se chamar `getSessionPayload(token):
     Promise<SessionPayload | null>` — decodifica e devolve o payload tipado, ou `null` se inválido/
     expirado. Isso é usado pelo Edge runtime (`proxy.ts`) e pelo resto do app.
  3. `auth.ts`: `createSession()` passa a receber `{ userId, role }` e chamar
     `signSessionToken({ userId, role })`. `readSession()` vira `getSession(): Promise<SessionPayload
     | null>`, lendo o cookie e chamando `getSessionPayload`. `requireAdmin()` vira `requireRole(allowed:
     SessionPayload["role"][]): Promise<SessionPayload>` — lança `new Response("Não autorizado", {
     status: 401 })` se não houver sessão ou o role não estiver em `allowed`; devolve o payload se
     passar (quem chamar usa `userId`/`role` na sequência).
  4. `proxy.ts`: trocar `verifySessionToken` por `getSessionPayload`, ajustando o `if` para
     `if (token && (await getSessionPayload(token)))`. Continua só verificando "existe sessão válida"
     — não é o lugar de checar role (mesma razão do `CLAUDE.md`: proxy protege navegação, a
     autorização de verdade é em cada Server Action/Component, feita na Fase R1.3 em diante).
- **Aceite**: `npm run build` passa. **Esta tarefa por si só vai quebrar `celebrants/page.tsx` e
  `events/actions.ts`** (ainda chamam `requireAdmin`, que não existe mais) — isso é esperado e
  corrigido na TR1.3, que já está na fila logo depois. Não faz sentido rodar TR1.2 sem TR1.3 em
  seguida.
- **Não fazer**: não mudar `SESSION_COOKIE_NAME` nem `SESSION_MAX_AGE_SECONDS`. Não mudar o
  algoritmo (`HS256`) nem a fonte do segredo (`JWT_SECRET`).

### TR1.3 — Atualizar os 2 call sites existentes de `requireAdmin`

- **Arquivos**: `src/app/admin/(dashboard)/celebrants/page.tsx`, `src/app/admin/(dashboard)/events/actions.ts`
- **Modelo**: sonnet
- **Depende de**: TR1.2
- **Fazer**: trocar `await requireAdmin();` por `await requireRole(["admin", "chapel_coordinator"]);`
  nos 2 arquivos (import também muda: `requireAdmin` → `requireRole`, de `@/lib/auth`). Celebrantes e
  eventos são conteúdo "de capela" — os dois papéis com acesso pleno à capela (admin e
  chapel_coordinator) continuam vendo/editando, os outros 3 papéis (pastoral/catequese/catequista)
  não.
- **Aceite**: `npm run build` passa; logar com um usuário `admin` continua acessando
  `/admin/celebrants` e criando/editando evento normalmente (teste manual depois que TR1.6 criar o
  admin real).
- **Não fazer**: não mudar mais nada nesses dois arquivos — só a chamada de autorização.

### TR1.4 — Login por usuário (username + senha)

- **Arquivos**: `src/app/api/login/route.ts`, `src/app/admin/login/page.tsx`
- **Modelo**: sonnet
- **Depende de**: TR1.2
- **Fazer**:
  1. `route.ts`: `bodySchema` ganha `username: z.string().trim().min(1)` além de `password`. Em vez
     de ler `ADMIN_PASSWORD_HASH_BASE64` da env var, buscar o usuário por `eq(users.username,
     parsed.data.username)` (usar Drizzle, nunca SQL cru) — se não existir ou `active` for `false`,
     `genericError()`. Verificar a senha com `verify(user.passwordHash, parsed.data.password)`
     (mesma função `@node-rs/argon2` já usada). Em caso de sucesso, `createSession({ userId: user.id,
     role: user.role })`. Trocar o texto do erro genérico de `"Senha incorreta."` para `"Usuário ou
     senha incorretos."` (mais preciso, ainda sem revelar qual campo errou).
  2. `login/page.tsx`: acrescentar campo "Usuário" (`<label htmlFor="username">Usuário</label>` +
     `<input id="username" name="username" required autoFocus className="field mt-1" />`) antes do
     campo de senha existente; tirar o `autoFocus` do campo de senha (o foco inicial passa a ser o
     usuário). Ajustar `handleSubmit` para mandar `{ username, password }` no corpo do `fetch`.
- **Aceite**: `npm run build` passa; sem usuário no banco ainda, tentar logar devolve "Usuário ou
  senha incorretos." (não quebra); depois que TR1.6 criar o admin real, logar com usuário+senha
  funciona e a sessão carrega o `role` certo.
- **Não fazer**: não mexer no rate limit (`tooManyAttempts`, chave por IP) — continua igual. Não
  remover `ADMIN_PASSWORD_HASH_BASE64` do `.env.example` ainda — isso é da TR1.8, junto com o resto
  da atualização de documentação.

### TR1.5 — Script de bootstrap do primeiro usuário

- **Arquivos**: cria `scripts/create-admin-user.mjs`; edita `.env.example`
- **Modelo**: sonnet
- **Depende de**: TR1.1
- **Contexto**: problema do ovo e da galinha — precisa de um usuário `admin` para criar outros
  usuários pela UI (TR1.7), mas ainda não existe nenhum. O projeto já resolve um problema parecido
  hoje (gerar `ADMIN_PASSWORD_HASH_BASE64`) com um comando `node -e` de uma linha, documentado no
  `.env.example` — mas criar um **usuário** (não só um hash) precisa inserir no Postgres, então vira
  um arquivinho em vez de uma linha só.
- **Fazer**:
  1. Criar `scripts/create-admin-user.mjs` — JavaScript puro (`.mjs`, sem TypeScript, sem
     dependência nova: roda com `node scripts/create-admin-user.mjs` direto, sem precisar de
     `tsx`/`ts-node`). O script:
     - Lê `DATABASE_URL` de `process.env` (o Cleberton exporta antes de rodar, ou usa
       `node --env-file=.env.local scripts/create-admin-user.mjs`, suportado nativamente pelo Node
       20+).
     - Lê `username`, `name` e `password` dos argumentos de linha de comando
       (`process.argv[2]`, `[3]`, `[4]`) — nunca hardcoded no arquivo.
     - Usa `@node-rs/argon2` (`hash`) para gerar o hash da senha.
     - Usa `@neondatabase/serverless` (`neon`) para conectar e inserir, com o `sql` template tag
       parametrizado (`` sql`insert into users (username, name, password_hash, role) values (${username}, ${name}, ${hash}, 'admin') on conflict (username) do nothing` ``)
       — nunca concatenar string. Isso já é como o resto do projeto usa o driver Neon quando não é
       via Drizzle.
     - Loga no console se criou ou se o username já existia (idempotente — pode rodar de novo sem
       duplicar).
  2. `.env.example`: acrescentar um comentário acima de `ADMIN_PASSWORD_HASH_BASE64` avisando que
     essa variável está sendo substituída pela tabela `users` (TR1.8 remove de vez; aqui só
     sinaliza) e um exemplo de uso do script novo:
     ```
     # Criar o primeiro usuário admin (rodar uma vez, localmente, contra o banco real):
     # node --env-file=.env.local scripts/create-admin-user.mjs meu.usuario "Meu Nome" "minha senha forte"
     ```
- **Aceite**: `node scripts/create-admin-user.mjs teste teste teste123` contra um banco de
  desenvolvimento cria a linha em `users` com `role = 'admin'`; rodar de novo com o mesmo username
  não duplica (idempotente) e avisa no console.
- **Não fazer**: não rodar o script contra o banco de produção — isso é a TR1.6, do Cleberton. Não
  usar `db.execute()` nem `sql.unsafe()` — só o template tag parametrizado do driver Neon.

### TR1.6 — Rodar o bootstrap e criar o admin real ⚠ ação do Cleberton

- **Modelo**: não delegar
- **Depende de**: TR1.4, TR1.5
- **Fazer**: o Cleberton roda, na própria máquina, contra o `DATABASE_URL` de produção (ou de dev,
  para testar primeiro):
  ```
  node --env-file=.env.local scripts/create-admin-user.mjs <usuario> "<nome>" "<senha forte>"
  ```
  escolhendo o próprio usuário e senha — **não é algo que um agente deve inventar por ele.**
- **Aceite**: login em `/admin/login` com o usuário e senha escolhidos funciona e leva ao painel.
- **Não fazer**: não commitar a senha em lugar nenhum. Depois de confirmar que o login funciona,
  remover `ADMIN_PASSWORD_HASH_BASE64` das env vars da Vercel (produção e preview) — a rota de login
  não usa mais essa variável a partir da TR1.4.

### TR1.7 — Admin UI: gerenciar usuários

- **Arquivos**: cria `src/app/admin/(dashboard)/users/page.tsx`, `src/app/admin/(dashboard)/users/actions.ts`; edita `src/app/admin/(dashboard)/layout.tsx` (link novo no menu)
- **Modelo**: sonnet
- **Depende de**: TR1.3
- **Fazer**:
  1. `users/actions.ts`: `createUser(formData)` com `requireRole(["admin"])` (só admin cria usuário —
     os outros papéis não gerenciam gente), Zod validando `username` (trim, min 1, único — capturar
     erro de constraint única do Postgres e devolver mensagem amigável, não deixar vazar erro cru),
     `name`, `password` (min 8 — regra mínima de força, sem exagero), `role` (enum dos 5 valores).
     Hash com `@node-rs/argon2` antes de inserir. `toggleUserActive(formData)` também com
     `requireRole(["admin"])`, alterna `active`. `revalidatePath("/admin/users")` nas duas.
  2. `users/page.tsx`: `requireRole(["admin"])` na primeira linha; lista todos os usuários
     (`select` sem trazer `passwordHash` para o componente — só os campos que a tela usa) com
     username, nome, papel (rótulo em português — mapear o enum, igual ao `ACTIVITY_TYPE_LABELS` que
     já existe em `schedules.ts` para outro enum) e um botão "Desativar"/"Ativar"
     (`toggleUserActive`); formulário de criação com `field` nos inputs, `<select className="field">`
     para o papel, botão `btn btn-confirm`.
  3. `layout.tsx`: acrescentar `<Link href="/admin/users">Usuários</Link>` na `<nav>` do painel
     (mesmo padrão dos links existentes) — visível para todo mundo por enquanto (a Fase R4 filtra por
     papel; nada quebra em deixar assim até lá, porque a proteção real é o `requireRole` da própria
     página, não o link aparecer ou não).
- **Aceite**: `npm run build` passa; logado como admin, `/admin/users` lista o próprio usuário criado
  na TR1.6, cria um segundo usuário de outro papel, consegue desativá-lo; `curl -X POST` em
  `/admin/users` (a Server Action, via id da action) sem cookie de admin não teria como ser chamado
  fora do fluxo do Next (Server Actions não são endpoint HTTP direto) — mas confirme que a página
  `/admin/users` sem sessão redireciona para login (comportamento do `proxy.ts`) e que, com sessão de
  outro papel (ex. `catechist`, depois de criado), acessar `/admin/users` é bloqueado pelo
  `requireRole(["admin"])` da própria página.
- **Não fazer**: não implementar troca de senha própria nem "esqueci minha senha" — fora de escopo
  desta fase (se algum dia precisar, o admin recria a pessoa ou zera a senha manualmente pelo banco).
  Não expor `passwordHash` em nenhum lugar do client.

### TR1.8 — Atualizar CLAUDE.md (autenticação por usuário)

- **Arquivos**: `CLAUDE.md`
- **Modelo**: sonnet
- **Depende de**: TR1.1, TR1.2, TR1.3, TR1.4
- **Fazer**: na seção "Regras de segurança" → "Autenticação", reescrever para refletir o que passou
  a existir: contas individuais (`users`, `username` + `password_hash` Argon2id por pessoa, não mais
  uma senha única em env var); o payload do JWT carrega `{ userId, role }`; `requireRole(allowed)`
  substitui `requireAdmin()` — toda Server Action/Route Handler administrativa continua chamando isso
  na primeira linha, agora passando a lista de papéis permitidos. Documentar os 5 valores do enum
  `user_role` e o que cada um acessa (a tabela que já está na seção "Por que este plano existe" deste
  arquivo serve de base). Remover a menção a `ADMIN_PASSWORD_HASH_BASE64` como segredo de auth
  (continua existindo só até a TR1.6 confirmar a migração, depois pode sumir de vez do
  `.env.example` nesta mesma tarefa).
- **Aceite**: `CLAUDE.md` não menciona mais "senha única" como o modelo de autenticação; a tabela de
  papéis está documentada.
- **Não fazer**: não reescrever o resto do `CLAUDE.md` — só a seção de autenticação.

---

## Fase R2 — Pastorais (cadastro de pessoas)

"Coordenador de pastoral cadastra pessoas na própria pastoral" — hoje não existe conceito de
"pastoral" nenhum no schema (as pastorais que já aparecem na home, Grupo de Oração e Grupo de
Jovens, são só `fixed_schedules` + texto solto em `page.tsx`, sem entidade própria). Esta fase cria
essa entidade e o cadastro simples de membros, escopado por pessoa via `users.pastoral_id`.

### TR2.1 — Schema: `pastorals`, `pastoral_members`, `users.pastoral_id`

- **Arquivos**: `src/db/schema.ts`, `drizzle/` (migration)
- **Modelo**: sonnet
- **Depende de**: TR1.1
- **Fazer**:
  1. `pastorals`: `id` (serial pk), `name` (text, not null — ex. "Grupo de Oração Porta do Céu").
  2. `pastoralMembers`: `id` (serial pk), `pastoralId` (integer, references `pastorals.id`), `name`
     (text, not null), `phone` (text, nullable — formato canônico do `CLAUDE.md` se preenchido, só
     dígitos com DDI), `notes` (text, nullable), `active` (boolean, default `true`).
  3. Em `users`, acrescentar coluna `pastoralId: integer("pastoral_id").references(() =>
     pastorals.id)` — nullable (só faz sentido para quem tem `role = "pastoral_coordinator"`, os
     outros papéis ficam com `null`).
  4. `npx drizzle-kit generate` (revisar: só `CREATE TABLE` × 2 e `ALTER TABLE users ADD COLUMN`,
     nunca `DROP`), `npx drizzle-kit migrate`.
- **Aceite**: `npm run build` passa; as duas tabelas novas existem; `users` tem a coluna
  `pastoral_id` nula em todas as linhas existentes.
- **Não fazer**: não popular `pastorals` com dado nenhum ainda — isso é a TR2.4 (tela de admin) ou um
  seed futuro, fora desta tarefa.

### TR2.2 — Server actions de membros da pastoral (escopadas por usuário)

- **Arquivos**: cria `src/app/admin/(dashboard)/pastorals/actions.ts`
- **Modelo**: sonnet
- **Depende de**: TR2.1
- **Fazer**: `createPastoralMember`, `updatePastoralMember`, `toggleMemberActive` — cada uma chama
  `requireRole(["admin", "pastoral_coordinator"])` na primeira linha e recebe `{ userId, role }` de
  volta. Se `role === "pastoral_coordinator"`, o `pastoralId` usado na query **vem do usuário
  logado** (`users.pastoralId` — buscar antes de inserir/atualizar), nunca de um campo escondido do
  formulário — é o que impede um coordenador de uma pastoral editar gente de outra só forjando o
  `pastoralId` no POST. Se `role === "admin"`, pode operar em qualquer pastoral (passar `pastoralId`
  explícito, vindo de um `<select>` na tela — ver TR2.3). Zod valida `name` (min 1), `phone`
  (opcional — se vier, `normalizePhone` + `isValidPhone` do `@/lib/phone` já existente), `notes`
  (opcional). `revalidatePath("/admin/pastorals")` em todas.
- **Aceite**: `npm run build` passa. Teste manual depois da TR2.3: coordenador de uma pastoral não
  consegue, nem manipulando o formulário, alterar membro de outra pastoral (a query já filtra pelo
  `pastoralId` do próprio usuário, ignorando qualquer valor que venha do client para esse papel).
- **Não fazer**: não confiar em `pastoralId` vindo do `formData` para o papel
  `pastoral_coordinator` — é exatamente o furo que esta tarefa existe para evitar.

### TR2.3 — Tela `/admin/pastorals` (coordenador de pastoral)

- **Arquivos**: cria `src/app/admin/(dashboard)/pastorals/page.tsx`
- **Modelo**: sonnet
- **Depende de**: TR2.2
- **Fazer**: `requireRole(["admin", "pastoral_coordinator"])` na primeira linha. Se
  `pastoral_coordinator`: busca a própria pastoral (`users.pastoralId` do `userId` da sessão) e lista
  só os membros dela — se o usuário não tiver `pastoralId` definido (admin esqueceu de vincular ao
  criar o usuário na TR1.7), mostrar mensagem clara ("Sua conta não está vinculada a nenhuma
  pastoral — peça para o administrador vincular.") em vez de erro cru ou lista vazia sem contexto. Se
  `admin`: mostra um seletor de pastoral no topo (todas as pastorais cadastradas) e a lista de
  membros da selecionada. Formulário de novo membro com `field`/`btn btn-confirm`, lista de membros
  em cards (padrão já usado em `celebrants/page.tsx` — `border-l-4 border-primary-light pl-3` por
  item, ou o padrão mais novo de card com `rounded-2xl border border-border bg-surface shadow-card`,
  o que estiver mais consistente com o resto do admin no momento de executar).
- **Aceite**: `npm run build` passa; logado como `pastoral_coordinator` vinculado a uma pastoral,
  cadastra e edita membro dela; logado como `admin`, troca entre pastorais pelo seletor.
- **Não fazer**: não deixar `pastoral_coordinator` ver ou trocar o seletor de pastoral — esse
  controle só aparece para `admin`.

### TR2.4 — Tela `/admin/pastorals/manage` (admin: lista de pastorais)

- **Arquivos**: cria `src/app/admin/(dashboard)/pastorals/manage/page.tsx`, `src/app/admin/(dashboard)/pastorals/manage/actions.ts`
- **Modelo**: sonnet
- **Depende de**: TR2.1
- **Fazer**: `requireRole(["admin"])` (só admin cria/edita a lista de pastorais em si — não é algo
  que um coordenador de pastoral faz). `createPastoral`/`renamePastoral` (nome apenas, Zod min 1),
  listagem simples com link para cada uma. É aqui que o admin cria "Grupo de Oração Porta do Céu" e
  "Grupo de Jovens Aos Pés da Cruz" como as duas primeiras linhas (cadastro manual pela tela, não
  precisa de seed) antes de vincular um `pastoral_coordinator` a cada uma pela tela de usuários
  (TR1.7 — lembrar de, quando `role = pastoral_coordinator` for escolhido no formulário de usuário,
  também mostrar um `<select>` de pastoral; se TR1.7 já tiver sido feita antes desta tarefa, volte lá
  e acrescente esse campo condicional em vez de duplicar lógica de criação de usuário aqui).
- **Aceite**: `npm run build` passa; admin cria uma pastoral nova pela tela e ela aparece no seletor
  da TR2.3.
- **Não fazer**: não excluir pastoral (com membros vinculados, é uma exclusão destrutiva demais para
  esta fase) — só criar/renomear.

---

## Fase R3 — Catequese (turmas, catequizandos, horários, presença)

O módulo mais específico do pedido. Coordenador de catequese cadastra catequistas (que são só
usuários com `role = "catechist"`, criados pela tela da TR1.7 — não precisa de tabela própria para
"catequista"), turmas e catequizandos; catequista vê só as próprias turmas e marca presença.

### TR3.1 — Schema: turmas, catequizandos, presença

- **Arquivos**: `src/db/schema.ts`, `drizzle/` (migration)
- **Modelo**: sonnet
- **Depende de**: TR1.1
- **Fazer**:
  1. `catechismClasses`: `id` (serial pk), `name` (text, not null — ex. "Turma A — Crisma"),
     `catechistId` (integer, references `users.id`, nullable — pode existir turma sem catequista
     ainda atribuído), `weekday` (integer, not null, 0-6 mesmo padrão de `fixedSchedules.weekday`),
     `time` (time, not null), `active` (boolean, default `true`).
  2. `catechumens` (catequizandos): `id` (serial pk), `classId` (integer, references
     `catechismClasses.id`, not null), `name` (text, not null), `guardianName` (text, nullable),
     `guardianPhone` (text, nullable — formato canônico do `CLAUDE.md` se preenchido), `active`
     (boolean, default `true`).
  3. `catechismAttendance` (presença/falta): `id` (serial pk), `classId` (integer, references
     `catechismClasses.id`, not null), `catechumenId` (integer, references `catechumens.id`, not
     null), `date` (date, not null), `present` (boolean, not null), com `unique().on(table.classId,
     table.catechumenId, table.date)` (mesmo padrão de `celebrations` — uma linha por
     turma+catequizando+data, permite upsert).
  4. `npx drizzle-kit generate` (revisar: só `CREATE TABLE` × 3, sem `DROP`), `npx drizzle-kit
     migrate`.
- **Aceite**: `npm run build` passa; as 3 tabelas existem com as FKs certas.
- **Não fazer**: não adicionar campo de data de nascimento nem outros dados sensíveis de menor de
  idade além do pedido (nome do catequizando, responsável e telefone do responsável) — não foi
  pedido e é dado sensível demais para guardar sem necessidade clara.

### TR3.2 — Server actions: turmas e catequistas

- **Arquivos**: cria `src/app/admin/(dashboard)/catechesis/classes-actions.ts`
- **Modelo**: sonnet
- **Depende de**: TR3.1
- **Fazer**: `createClass`, `updateClass`, `assignCatechist` (define/troca o `catechistId` de uma
  turma — validar que o usuário escolhido tem `role = "catechist"` antes de salvar, senão erro
  amigável), `toggleClassActive` — todas com `requireRole(["admin", "catechesis_coordinator"])`. Zod
  em tudo (`name` min 1, `weekday` 0-6, `time` formato `HH:MM`). `revalidatePath("/admin/catechesis")`
  e `revalidatePath("/admin/my-classes")` (a atribuição de catequista afeta o que ele vê na TR3.6).
- **Aceite**: `npm run build` passa.
- **Não fazer**: não permitir atribuir como catequista um usuário que não tenha `role = "catechist"`
  — validar isso na Server Action, não só confiar na tela.

### TR3.3 — Server actions: catequizandos

- **Arquivos**: cria `src/app/admin/(dashboard)/catechesis/catechumens-actions.ts`
- **Modelo**: sonnet
- **Depende de**: TR3.1
- **Fazer**: `createCatechumen`, `updateCatechumen`, `toggleCatechumenActive` — `requireRole(["admin",
  "catechesis_coordinator"])`. Zod (`name` min 1, `classId` precisa existir — validar com uma query
  antes de inserir, `guardianPhone` opcional normalizado como telefone). `revalidatePath("/admin/catechesis")`.
- **Aceite**: `npm run build` passa.
- **Não fazer**: catequista não tem acesso a estas actions (não estão na lista de `requireRole`) —
  cadastro de catequizando é só do coordenador/admin, coerente com o pedido original.

### TR3.4 — Tela `/admin/catechesis` (coordenador de catequese)

- **Arquivos**: cria `src/app/admin/(dashboard)/catechesis/page.tsx`
- **Modelo**: sonnet
- **Depende de**: TR3.2, TR3.3
- **Fazer**: `requireRole(["admin", "catechesis_coordinator"])`. Lista turmas (nome, dia/horário via
  `WEEKDAY_LABELS`/`formatTime` já existentes em `@/lib/schedules` e `@/lib/format`, catequista
  atribuído ou "sem catequista"), formulário de nova turma, e dentro de cada turma (ou em página
  própria `catechesis/classes/[id]`, decisão livre de quem executar, mas mantendo 1 responsabilidade
  por tela) a lista de catequizandos daquela turma com formulário de cadastro. Selecionar catequista
  via `<select>` alimentado pelos usuários com `role = "catechist"` (`db.select().from(users).where(eq(users.role,
  "catechist"))`).
- **Aceite**: `npm run build` passa; coordenador cria turma, atribui catequista (só aparecem usuários
  com esse papel no seletor), cadastra catequizando na turma.
- **Não fazer**: não deixar cadastrar catequizando "solto" sem turma — `classId` é obrigatório.

### TR3.5 — Server action: marcar presença/falta

- **Arquivos**: cria `src/app/admin/(dashboard)/my-classes/attendance-actions.ts`
- **Modelo**: sonnet
- **Depende de**: TR3.1
- **Fazer**: `saveAttendance(formData)` com `requireRole(["admin", "catechesis_coordinator",
  "catechist"])`. Se `role === "catechist"`, antes de gravar, confirmar que a turma
  (`classId` do formulário) pertence mesmo a esse catequista (`catechismClasses.catechistId ===
  userId` — buscar a turma e comparar; se não bater, 401, mesmo padrão de "nunca confiar em id vindo
  do client sem checar posse" da TR2.2). Admin/coordenador podem gravar presença em qualquer turma
  sem essa checagem. Upsert por `classId+catechumenId+date` (`onConflictDoUpdate`, mesmo padrão de
  `saveCelebrants` em `celebrants/page.tsx`). `revalidatePath("/admin/my-classes")`.
- **Aceite**: `npm run build` passa. Teste manual depois da TR3.6: catequista não consegue gravar
  presença numa turma que não é dele forjando o `classId` no formulário.
- **Não fazer**: não deixar catequista gravar presença em turma de outro catequista — é a checagem
  central desta tarefa.

### TR3.6 — Tela `/admin/my-classes` (catequista)

- **Arquivos**: cria `src/app/admin/(dashboard)/my-classes/page.tsx`
- **Modelo**: sonnet
- **Depende de**: TR3.5
- **Fazer**: `requireRole(["admin", "catechesis_coordinator", "catechist"])`. Se `role ===
  "catechist"`, filtra `catechismClasses` por `catechistId === userId` da sessão — só as próprias
  turmas, nunca uma lista completa com filtro visual (o filtro é na query, não é esconder linha no
  client). Admin/coordenador veem todas (útil para conferência, mesmo não sendo o público principal
  desta tela). Para cada turma, lista de catequizandos ativos com checkbox de presença por data (a
  data pode ser um `<input type="date">` simples no topo da tela, default hoje) e botão "Salvar"
  chamando `saveAttendance`.
- **Aceite**: `npm run build` passa; logado como catequista vinculado a uma turma (via TR3.2), vê só
  essa turma em `/admin/my-classes`, marca presença de um catequizando e salva; outro catequista sem
  turma atribuída vê a tela vazia com mensagem clara, não erro.
- **Não fazer**: não implementar histórico/relatório de faltas nesta tarefa — só marcar e salvar o
  dia. Relatório é candidato a fase futura, se pedido.

---

## Fase R4 — Navegação e fechamento

Depois que cada papel tem suas próprias telas funcionando, falta a navegação do admin parar de
mostrar link para seção que a pessoa não pode usar, e uma conferência final de que todo Server
Action/Component novo desta leva inteira realmente chama `requireRole` — é fácil esquecer um em
meio a tantas telas novas.

### TR4.1 — Navegação do admin por papel

- **Arquivos**: `src/app/admin/(dashboard)/layout.tsx`, `src/app/admin/(dashboard)/page.tsx`
- **Modelo**: sonnet
- **Depende de**: TR1.7, TR2.3, TR2.4, TR3.4, TR3.6
- **Fazer**: em `layout.tsx`, chamar `getSession()` (de `@/lib/auth`) e filtrar os links da `<nav>`
  pelo `role` retornado — mapa fixo tipo `NAV_BY_ROLE: Record<Role, {href,label}[]>` ou uma função
  `linksForRole(role)`, cada papel só vê o que pode acessar (admin: tudo; chapel_coordinator:
  Celebrantes/Eventos/Pedidos; pastoral_coordinator: Pastorais; catechesis_coordinator: Catequese;
  catechist: Minhas Turmas). Mesmo filtro nos cards de `page.tsx` (índice do admin). Isso é só UX —
  a proteção de verdade já está em cada `requireRole` das páginas/actions, feito fase a fase.
- **Aceite**: `npm run build` passa; logado como `catechist`, o menu mostra só "Minhas Turmas" (e
  "Sair"); logado como `admin`, mostra tudo.
- **Não fazer**: não remover nenhum `requireRole` das páginas achando que o menu escondido já
  basta — o `CLAUDE.md` é explícito sobre isso não ser suficiente.

### TR4.2 — Auditoria final de `requireRole` ⚠ não delegar

- **Modelo**: não delegar
- **Depende de**: Fases R1, R2, R3 e TR4.1 inteiras
- **Fazer**: `grep -rn "requireRole\|requireAdmin" src` e conferir, um por um, que **toda** Server
  Action e todo Server Component administrativo novo desta leva (`users`, `pastorals`, `catechesis`,
  `my-classes` — todos os arquivos criados nas Fases R1 a R3) chama `requireRole` na primeira linha,
  com a lista de papéis certa para o que a tela faz. Conferir também que nenhuma delas confia em
  `pastoralId`/`classId`/`catechistId` vindo do `formData` sem checar posse contra a sessão, nos
  papéis escopados (`pastoral_coordinator`, `catechist`) — são os dois pontos que a TR2.2 e a TR3.5
  já resolveram, esta tarefa é a conferência de que ninguém pulou essa parte ao copiar o padrão numa
  tela nova.
- **Aceite**: relatório curto (pode ser só na resposta do chat, não precisa virar arquivo) — lista de
  arquivo + role exigido, ou "achado" com arquivo+linha se algo escapou, e o que foi corrigido.

**Feita pelo orquestrador em 2026-09-15.** `grep -rn "requireAdmin" src` só retorna um comentário em
`api/orders/route.ts` explicando por que aquela rota é pública de propósito (pré-existente, fora do
escopo desta leva) — nenhum call site esquecido. `grep -rn "requireRole" src` mostra 31 ocorrências,
uma em cada Server Action/Component novo desta leva (`pastorals`, `pastorals/manage`, `catechesis`,
`my-classes`, `users`), sempre logo após os imports, sempre com a lista de papéis certa para o que a
tela faz. Checagem de posse confirmada nos dois pontos que precisavam: `pastorals/actions.ts`
(`resolvePastoralId`/`assertOwnership`, nunca confia em `pastoralId` do formulário para
`pastoral_coordinator`) e `my-classes/attendance-actions.ts` (confere `catechistId` da turma contra
`session.userId` antes de gravar presença). Varredura de cor solta (`grep -rn '#[0-9a-fA-F]\{6\}'
src/app/admin src/lib/admin-nav.ts`) e de `"use client"` desnecessário nos módulos novos: ambas
vazias. Nenhum achado.

---

## Fase UI — Biblioteca de componentes (adapter sobre Radix UI)

Hoje cada tela monta seu próprio botão, input, checkbox e select colando classes Tailwind na mão —
o sistema de tokens existe (`globals.css`, seção "Sistema de UI" desde a Fase D: `btn`,
`btn-confirm`/`btn-delete`/`btn-secondary`/`btn-icon`, `field`, `text-display`…`text-caption`), mas
nada disso está encapsulado em componente React reutilizável. É por isso que apesar da paleta ser
uma só, cada tela do admin "sente" um pouco diferente — um checkbox usa `h-5 w-5` solto
(`celebrants/page.tsx:157`), outro também (`EventForm.tsx:152`), sem nenhum componente em comum, e
nenhum dos dois é acessível por teclado além do que o `<input>` nativo já dá de graça.

O pedido do Cleberton: criar `src/components/ui/`, uma pasta de componentes agrupando o que várias
telas vão usar, com `Button` (variantes `default`/`cancel`/`secondary`), `IconButton`, `Select`,
`Checkbox`, `Popover`, `Input`, `DatePicker`, `Table`/`DataTable` e `Typography` — usando **Radix
UI** como base para os primitivos que precisam de acessibilidade composta de verdade (`Select`,
`Checkbox`, `Popover` são compostos de várias partes com navegação por teclado, foco preso, ARIA
correto — reescrever isso do zero é caro e propenso a erro). Radix não tem primitivo de calendário
nem de tabela — para esses dois, decisão tomada nesta sessão com o Cleberton: **com biblioteca**.
`DatePicker` usa `react-day-picker` (calendário visual) dentro do `Popover` desta mesma biblioteca
(mesmo padrão que o shadcn/ui usa, com `date-fns/locale/pt-BR` para os meses/dias saírem em
português — regra do `CLAUDE.md` de texto de UI em português). `DataTable` usa `@tanstack/react-table`
(headless — só a lógica de ordenação/paginação, o HTML/estilo continua sendo os componentes `Table`
desta mesma fase).

**Dependências já aprovadas pelo Cleberton nesta sessão** (pediu explicitamente "pode instalar e
usar" no `/criar-plano`, e depois confirmou "DatePicker e DataTable com lib nova" quando perguntado):
o pacote unificado `radix-ui`, `react-day-picker`, `date-fns` (só para o locale `pt-BR` do calendário)
e `@tanstack/react-table`. Nenhuma dessas quatro tarefas de instalação precisa de confirmação extra —
a aprovação já está registrada aqui.

Esta fase só **cria** a biblioteca. Migrar as telas existentes (`EventForm.tsx`, `celebrants/page.tsx`,
`orders/page.tsx`, os `<select>` de `users/page.tsx`/`catechesis/page.tsx` etc.) para usar os
componentes novos é decisão em aberto, registrada no fim deste arquivo — misturar "criar a
biblioteca" com "trocar 15 arquivos pra usar ela" no mesmo plano deixaria o `git diff` irrevisável,
e é exatamente o tipo de mistura que este processo de plano existe para evitar.

### TUI.1 — Instalar as dependências da fase e o utilitário de classes

- **Arquivos**: edita `package.json` (e `package-lock.json`, gerado); cria `src/lib/cn.ts`
- **Modelo**: sonnet
- **Depende de**: —
- **Fazer**:
  1. `npm install radix-ui react-day-picker date-fns @tanstack/react-table` — quatro pacotes:
     - `radix-ui`: pacote único que reexporta todos os primitivos (`Select`, `Checkbox`, `Popover`
       etc.), não os pacotes antigos `@radix-ui/react-select` e afins.
     - `react-day-picker`: o calendário do `DatePicker` (TUI.8).
     - `date-fns`: só usado pelo locale `pt-BR` do `react-day-picker` (`date-fns/locale/pt-BR`) —
       confira a versão que o `react-day-picker` instalado espera como peer dependency antes de
       fixar a versão do `date-fns` (`npm ls react-day-picker` depois de instalar mostra isso).
     - `@tanstack/react-table`: a lógica headless (sem estilo) de ordenação/paginação do
       `DataTable` (TUI.10).
  2. Criar `src/lib/cn.ts`:
     ```ts
     export function cn(...classes: Array<string | false | null | undefined>): string {
       return classes.filter(Boolean).join(" ");
     }
     ```
     Helper mínimo pra combinar classes condicionais nos componentes desta fase — sem instalar
     `clsx`/`tailwind-merge`, mantém o projeto leve nesse ponto específico.
- **Aceite**: `npm run build` passa; `package.json` lista as quatro dependências novas.
- **Não fazer**: não instalar `@radix-ui/react-*` avulsos (só o pacote unificado). Não instalar
  `clsx` nem `tailwind-merge`.

### TUI.2 — `Typography`

- **Arquivos**: cria `src/components/ui/Typography.tsx`
- **Modelo**: haiku
- **Depende de**: TUI.1
- **Fazer**: componente `Typography({ as, variant, className, children, ...props })`.
  `variant: "display" | "title" | "subtitle" | "body" | "caption"` mapeia direto para as classes já
  existentes em `globals.css` (`text-display`, `text-title`, `text-subtitle`, `text-body`,
  `text-caption` — **sem cor embutida**, exatamente como o `CLAUDE.md` já documenta pra essas
  utilities; cor continua vindo do `className` de quem usa, ex. `text-primary`). `as` escolhe a tag
  renderizada; sem `as` explícito, cada `variant` tem uma tag default sensata: `display` → `h1`,
  `title` → `h2`, `subtitle` → `h3`, `body` → `p`, `caption` → `span`. Usa `cn()` de `@/lib/cn` pra
  combinar a classe do `variant` com o `className` recebido.
- **Aceite**: `npm run build`; `<Typography variant="title" className="text-primary">Teste</Typography>`
  renderiza `<h2 class="text-title text-primary">Teste</h2>`.
- **Não fazer**: não adicionar cor default nem tamanho fora das 5 variantes que já existem em
  `globals.css` — não é desta tarefa inventar escala tipográfica nova.

### TUI.3 — `Button` e `IconButton`

- **Arquivos**: cria `src/components/ui/Button.tsx`, `src/components/ui/IconButton.tsx`
- **Modelo**: haiku
- **Depende de**: TUI.1
- **Fazer**:
  1. `Button({ variant, className, type, ...props }: { variant?: "default" | "cancel" | "secondary"
     } & ComponentPropsWithoutRef<"button">)` — `variant` (default: `"default"`) mapeia pra
     `btn btn-confirm` (`default`), `btn btn-delete` (`cancel`), `btn btn-secondary` (`secondary`) —
     as classes já existem em `globals.css`, esta tarefa só as encapsula. `type` continua vindo de
     quem usa (sem forçar default — `EventForm.tsx:185` já usa `type="submit"` no botão de salvar
     dentro de um `<form action={...}>`, e isso precisa continuar funcionando por quem migrar depois).
     Repassa o resto das props nativas via spread, `className` extra combinado com `cn()`.
  2. `IconButton({ "aria-label": ariaLabel, className, children, ...props })` — usa a classe
     `btn-icon` já existente; `aria-label` é **obrigatório** no tipo (ícone sem texto precisa de
     rótulo acessível — TypeScript deve recusar compilar sem ele).
- **Aceite**: `npm run build`; `<Button variant="cancel">Excluir</Button>` renderiza com a classe
  `btn btn-delete`; tentar usar `<IconButton>` sem `aria-label` dá erro de tipo.
- **Não fazer**: não recriar as classes CSS de botão — só mapear pras que já existem. Não tocar em
  `DeleteEventButton.tsx` nem em nenhum outro botão já existente no projeto.

### TUI.4 — `Input`

- **Arquivos**: cria `src/components/ui/Input.tsx`
- **Modelo**: haiku
- **Depende de**: TUI.1
- **Fazer**: wrapper de `<input>` nativo com a classe `field` já existente. Props: `label?: string`
  (renderiza um `<label>` associado via `useId()` do React quando não vier `id` explícito nas
  props), `error?: string` (mostra abaixo do campo, mesmo padrão visual de erro já usado em
  `BuyCards.tsx`/`EventForm.tsx`: `text-caption text-danger`). Repassa o resto das props nativas de
  `<input>` via spread; `className` extra combinado com `cn()`.
- **Aceite**: `npm run build`; `<Input label="Nome" />` renderiza `<label>` + `<input class="field">`
  com os `id`/`htmlFor` ligados.
- **Não fazer**: não implementar máscara de telefone ou de moeda aqui — isso continua em
  `@/lib/phone`/`@/lib/format`, aplicado por quem chama o `Input`, não dentro dele.

### TUI.5 — `Checkbox` (Radix)

- **Arquivos**: cria `src/components/ui/Checkbox.tsx`
- **Modelo**: sonnet
- **Depende de**: TUI.1
- **Contexto**: primeiro componente desta fase que usa um primitivo Radix de verdade — vale o
  cuidado extra de conferir a acessibilidade (é exatamente o motivo de usar Radix em vez de um
  `<input type="checkbox">` estilizado na mão).
- **Fazer**: adapter sobre o `Checkbox` exportado pelo pacote `radix-ui` (confira o caminho de
  import certo pela versão instalada na TUI.1 — normalmente `import { Checkbox as RadixCheckbox }
  from "radix-ui"`, mas confirme nos tipos/documentação do pacote instalado antes de assumir).
  Props: `label?: string`, `checked`, `onCheckedChange`, `name`, `disabled` — repassadas pro
  primitivo Radix (`Root` + `Indicator`). Estiliza o `Root` com borda `border-2 border-primary-light`
  e cantos arredondados, o estado marcado com fundo `bg-primary` e o ícone de check (pode usar um
  SVG simples inline no próprio arquivo, `viewBox 0 0 24 24`, `stroke="currentColor"`, mesmo padrão
  dos ícones em `src/components/icons/`) em branco por cima. O wrapper (label + caixa) precisa de
  `min-h-11` pro alvo de toque mínimo do `CLAUDE.md`.
- **Aceite**: `npm run build`; o checkbox alterna por teclado (Tab pra focar, Espaço pra marcar) e
  mostra o outline dourado de `:focus-visible` já global em `globals.css:92-95` (conferir que o
  Radix não sobrescreve isso com outline próprio — se sobrescrever, remover o outline do Radix pra
  deixar o global aparecer).
- **Não fazer**: não trocar os `<input type="checkbox">` já existentes em `celebrants/page.tsx:153`
  ou `EventForm.tsx:148,158` por este componente — migração de tela é decisão em aberto, fora desta
  fase.

### TUI.6 — `Select` (Radix)

- **Arquivos**: cria `src/components/ui/Select.tsx`
- **Modelo**: sonnet
- **Depende de**: TUI.1
- **Contexto**: os `<select>` nativos hoje (`users/page.tsx`, `catechesis/page.tsx`,
  `my-classes/page.tsx`) vivem dentro de `<form action={ServerAction}>` e dependem do atributo
  `name` nativo pra chegar no `FormData` do lado do servidor. O `Select` do Radix **não é** um
  `<select>` nativo — não tem `name`/`value` de formulário HTML sozinho. Pra este componente
  continuar utilizável dentro de Server Actions no futuro (quando/se alguma tela migrar), inclua um
  `<input type="hidden" name={name} value={value ?? ""} />` interno quando a prop `name` for
  passada — é a mesma técnica que o próprio Radix documenta pra uso em formulários nativos.
- **Fazer**: adapter sobre `Select` do pacote `radix-ui` (`Root`, `Trigger`, `Value`, `Portal`,
  `Content`, `Viewport`, `Item`, `ItemText`, `ItemIndicator` — confira os nomes exatos exportados
  pela versão instalada). Props: `label?`, `value`, `onValueChange`, `name?`, `options: { value:
  string; label: string }[]`, `placeholder?`. O ícone da seta do `Trigger` pode ser um SVG simples
  inline no próprio arquivo (não precisa criar arquivo novo em `src/components/icons/` pra isso).
  Estiliza o `Trigger` com a classe `field` (mesmo campo visual dos outros inputs), o `Content` com
  `bg-surface shadow-lifted rounded-xl border border-border`, o `Item` selecionado com
  `bg-primary-light/15`.
- **Aceite**: `npm run build`; navega pelas opções com as setas do teclado, seleciona com Enter,
  fecha com Escape; o `focus-visible` do `Trigger` mostra o outline dourado padrão.
- **Não fazer**: não trocar nenhum `<select>` nativo já existente no projeto por este componente —
  migração de tela é decisão em aberto, fora desta fase.

### TUI.7 — `Popover` (Radix)

- **Arquivos**: cria `src/components/ui/Popover.tsx`
- **Modelo**: sonnet
- **Depende de**: TUI.1
- **Fazer**: adapter fino sobre `Popover` do pacote `radix-ui` (`Root`, `Trigger`, `Portal`,
  `Content`, `Arrow`). Props: `trigger: ReactNode`, `children` (conteúdo do popover), `align?`,
  `side?` repassados direto pro `Content` do Radix. Estiliza `Content` com `bg-surface shadow-lifted
  rounded-xl border border-border p-4`, `Arrow` com `fill-surface`.
- **Aceite**: `npm run build`; abre ao clicar no trigger, fecha ao clicar fora ou apertar Escape,
  foco visível no trigger.
- **Não fazer**: não implementar lógica de posicionamento própria — usa a que o Radix já resolve.

### TUI.8 — `DatePicker`

- **Arquivos**: cria `src/components/ui/DatePicker.tsx`
- **Modelo**: sonnet
- **Depende de**: TUI.4 (padrão de `label`/`error`), TUI.7 (`Popover`)
- **Contexto**: decisão tomada nesta sessão — com biblioteca. `react-day-picker` trabalha com
  objeto `Date` nativo do JS, não com a string `"YYYY-MM-DDTHH:mm"` que `<input type="datetime-local">`
  usa — e o projeto já resolve fuso horário em `@/lib/format` (`parseSaoPauloDateTime`,
  `toSaoPauloDateTimeLocal`, usados em `EventForm.tsx:92,104` para início/fim de evento) em cima
  dessa string. Este componente não reimplementa esse parsing: ele expõe `value`/`onChange` como
  `Date | undefined`, e quem usar (ex. uma futura migração do `EventForm.tsx`) converte pra/da string
  de fuso horário nas bordas, do mesmo jeito que já faz hoje com o input nativo.
- **Fazer**:
  1. Trigger: um `Button` (TUI.3, `variant="secondary"`) ou um campo no estilo `field` mostrando a
     data formatada (`Intl.DateTimeFormat("pt-BR", { dateStyle: includeTime ? undefined : "short",
     ... })` ou similar — formato `dd/mm/aaaa`) dentro do `Popover` (TUI.7) como `trigger`.
  2. Conteúdo do popover: `<DayPicker mode="single" selected={value} onSelect={onChange} locale={ptBR}
     />` (import `{ ptBR }` de `date-fns/locale`), estilizado com as classes de tema do
     `react-day-picker` (`classNames` prop) usando os tokens do projeto — dia selecionado
     `bg-primary text-white`, hoje com contorno `border border-accent`, hover
     `bg-primary-light/15`.
  3. `includeTime?: boolean` (default `false`): quando `true`, acrescenta um `<input type="time">`
     (classe `field`) abaixo do calendário dentro do popover, combinando a hora escolhida com a data
     do calendário num único `Date` antes de chamar `onChange`.
  4. Props: `label?`, `error?` (mesmo contrato do `Input`, TUI.4), `value: Date | undefined`,
     `onChange: (date: Date | undefined) => void`, `includeTime?`.
- **Aceite**: `npm run build`; o calendário abre no clique do trigger, mostra nomes de mês/dia em
  português (`locale={ptBR}`), fecha ao selecionar uma data (quando `includeTime` for `false`) ou ao
  clicar fora, navega por teclado (setas, Enter, Escape — o próprio `react-day-picker` já dá isso).
- **Não fazer**: não reimplementar nem importar `parseSaoPauloDateTime`/`toSaoPauloDateTimeLocal`
  dentro deste componente — a conversão de/para a string de fuso horário do banco fica com quem usa.

### TUI.9 — `Table` (primitivos de apresentação)

- **Arquivos**: cria `src/components/ui/Table.tsx`
- **Modelo**: haiku
- **Depende de**: TUI.1
- **Fazer**: componentes de apresentação pura, espelhando a estrutura que `orders/page.tsx:52-64`
  já usa hoje: `Table` (`<table class="w-full min-w-[560px] border-collapse text-left text-base">`),
  `TableHeader` (`<thead>`), `TableRow` (`<tr>` — no header usa `border-b-2 border-border`, no corpo
  `border-b border-border`, então aceite uma prop `header?: boolean` pra escolher a borda certa),
  `TableHead` (`<th class="py-2 pr-3">`), `TableBody` (`<tbody>`), `TableCell` (`<td class="py-2
  pr-3">`). Cada um só repassa `className` (combinado com `cn()`) e `children` — sem ordenação,
  paginação ou filtro embutido; essa lógica é da TUI.10 (`DataTable`), que usa estes componentes por
  baixo pra renderizar.
- **Aceite**: `npm run build`; compor `<Table><TableHeader><TableRow header>...</TableRow></TableHeader>
  <TableBody>...</TableBody></Table>` reproduz visualmente a tabela de `orders/page.tsx`.
- **Não fazer**: não adicionar lógica de ordenação/paginação/filtro aqui — isso é a TUI.10. Não
  migrar `orders/page.tsx` para usar este componente — fica pra decisão futura (item 5 das "Decisões
  em aberto").

### TUI.10 — `DataTable` (TanStack Table)

- **Arquivos**: cria `src/components/ui/DataTable.tsx`
- **Modelo**: sonnet
- **Depende de**: TUI.9
- **Contexto**: decisão tomada nesta sessão — com biblioteca. `@tanstack/react-table` é headless
  (só lógica: ordenação, paginação, seleção de linha — zero HTML/CSS próprio), então este componente
  usa o hook `useReactTable` pra gerenciar o estado e renderiza o resultado com os componentes
  `Table`/`TableHeader`/`TableRow`/`TableHead`/`TableBody`/`TableCell` da TUI.9, mantendo o mesmo
  visual do resto do projeto.
- **Fazer**:
  1. `DataTable<TData, TValue>({ columns, data }: { columns: ColumnDef<TData, TValue>[]; data:
     TData[] })` — genérico, tipado com `ColumnDef` do `@tanstack/react-table`.
  2. `useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getSortedRowModel:
     getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() })` — habilita ordenação e
     paginação (estado interno do hook, sem prop extra pra controlar de fora nesta primeira versão).
  3. Renderiza o header com `flexRender(header.column.columnDef.header, header.getContext())`
     dentro de `TableHead`, com um botão/ícone de ordenar quando a coluna define `enableSorting`
     (usar `IconButton`, TUI.3, com um SVG de seta simples inline — chama
     `header.column.toggleSorting()` no clique).
  4. Renderiza as linhas via `table.getRowModel().rows`, cada célula com
     `flexRender(cell.column.columnDef.cell, cell.getContext())` dentro de `TableCell`.
  5. Paginação simples no rodapé: dois `Button` (`variant="secondary"`) "Anterior"/"Próxima"
     chamando `table.previousPage()`/`table.nextPage()`, desabilitados via
     `table.getCanPreviousPage()`/`table.getCanNextPage()` — só aparece quando
     `table.getPageCount() > 1`.
  6. Quando `data.length === 0`, mostrar uma linha única "Nenhum registro encontrado." (`text-body
     text-foreground/70`) em vez da tabela vazia — mesmo espírito das mensagens de lista vazia já
     usadas em `orders/page.tsx`/`celebrants/page.tsx`.
- **Aceite**: `npm run build`; com uma lista de dados de teste (>10 itens) e uma coluna com
  `enableSorting: true`, clicar no cabeçalho ordena, e os botões de paginação navegam entre páginas.
- **Não fazer**: não migrar `orders/page.tsx` para usar este componente — fica pra decisão futura
  (item 5 das "Decisões em aberto"). Não implementar filtro de texto nem seleção de linha nesta
  tarefa — só ordenação e paginação, que é o que foi pedido.

**Nota da execução**: `npm install @tanstack/react-table` (sem versão fixada) puxou a v9, que é uma
reescrita completa (API `useTable`/`createTableHook`, sem `useReactTable`/`getCoreRowModel`/
`flexRender` no formato clássico) — incompatível com o resto do ecossistema/documentação, que ainda
é todo v8. Corrigido fixando `@tanstack/react-table` em `^8` (`npm install @tanstack/react-table@^8`)
— o componente já escrito na API v8 passou a compilar sem precisar reescrever nada.

### TUI.11 — Barrel export

- **Arquivos**: cria `src/components/ui/index.ts`
- **Modelo**: haiku
- **Depende de**: TUI.2, TUI.3, TUI.4, TUI.5, TUI.6, TUI.7, TUI.8, TUI.9, TUI.10
- **Fazer**: reexportar tudo dos arquivos criados nesta fase, um `export * from "./NomeDoArquivo";`
  por componente (`Typography`, `Button`, `IconButton`, `Input`, `Checkbox`, `Select`, `Popover`,
  `DatePicker`, `Table`, `DataTable`).
- **Aceite**: `npm run build`; `import { Button, Input, Select, DataTable } from "@/components/ui"`
  resolve sem erro de tipo.
- **Não fazer**: não reexportar `cn` de `@/lib/cn` por aqui — esse helper é de `@/lib`, não faz
  parte da biblioteca de componentes de UI.

### TUI.12 — Documentar no CLAUDE.md

- **Arquivos**: `CLAUDE.md`
- **Modelo**: haiku
- **Depende de**: TUI.1 a TUI.11
- **Fazer**: na seção "Sistema de UI" (dentro de "Design", já existe desde a Fase D), acrescentar um
  parágrafo curto sobre `src/components/ui/`: pasta de componentes React reutilizáveis, adapter
  sobre o pacote `radix-ui` para os primitivos compostos (`Select`, `Checkbox`, `Popover`);
  `DatePicker` usa `react-day-picker` + `date-fns/locale/pt-BR`; `DataTable` usa
  `@tanstack/react-table` (headless, estilo próprio via `Table`). Listar os 10 componentes com um
  exemplo de import (`import { Button, Input, DataTable } from "@/components/ui";`).
- **Aceite**: `CLAUDE.md` tem a seção nova, sem duplicar a tabela de paleta ou o restante do
  "Sistema de UI" já existente.
- **Não fazer**: não reescrever o resto do `CLAUDE.md`.

---

## Decisões em aberto

| # | Decisão | Bloqueia |
|---|---|---|
| 1 | Multi-capela (mencionado pelo Cleberton como destino futuro) — `chapel_coordinator` já existe como papel distinto de `admin`, mas sem tabela `chapels` ainda não há o que vincular a ele além de "tudo". Quando o projeto virar "paróquia com capelas filhas", volta aqui para adicionar `chapels` + `users.chapel_id`. | Fora de escopo agora — só registrado para não esquecer o porquê do papel já existir separado. |
| 2 | Troca de senha pelo próprio usuário / "esqueci minha senha" | Não implementado nesta leva (TR1.7 nota isso) — hoje só o admin recria/reresetaria manualmente. Perguntar ao Cleberton se vale a pena numa fase futura. |
| 3 | Relatório/histórico de faltas na catequese | Não implementado (TR3.6 só marca o dia). Perguntar se é necessário. |
| 4 | Pendências do plano anterior (Fase 9 WebP, Fase 10 recorrência mensal, T11.1/T11.6/T11.7, Fase 12) | Continuam fora deste arquivo — ver nota no topo. |
| 5 | Migrar as telas existentes (`EventForm.tsx`, `celebrants/page.tsx`, `orders/page.tsx`, os `<select>` de `users/page.tsx`/`catechesis/page.tsx`/`my-classes/page.tsx`) para os componentes de `src/components/ui/` | Fora do escopo da Fase UI de propósito — recomendo uma fase futura "Fase UI-migração", tela por tela, depois que a biblioteca estiver no ar e revisada. Misturar criação de componente com troca de 6+ telas no mesmo plano deixaria o `git diff` irrevisável. |
| 6 | `Select` do Radix dentro de Server Action (`<form action={...}>`) | TUI.6 já resolve com um `<input type="hidden">` interno — só falta confirmar na prática, quando alguma tela migrar (item 5), que o valor chega certo no `FormData` do lado do servidor. |

---

## Ordem sugerida de execução

```
Fase R1 →  TR1.1 → TR1.2 → TR1.3
                 → (TR1.4 ∥ TR1.5, ambas dependem só de TR1.2/TR1.1) → TR1.6 (Cleberton)
           TR1.7 (depende de TR1.3) → TR1.8 por último (depende de TR1.1-TR1.4)

Fase R2 →  TR2.1 (depende de TR1.1) → (TR2.2 ∥ TR2.4, arquivos diferentes) → TR2.3 (depende de TR2.2)

Fase R3 →  TR3.1 (depende de TR1.1) → (TR3.2 ∥ TR3.3, arquivos diferentes) → TR3.4
                 TR3.5 (depende só de TR3.1) → TR3.6 (depende de TR3.5)

Fase R4 →  TR4.1 (depende de TR1.7, TR2.3, TR2.4, TR3.4, TR3.6 — ou seja, do resto quase todo)
           TR4.2 por último, auditoria com o Cleberton

Fase UI →  TUI.1 sozinha primeiro (instala as 4 dependências)
           (TUI.2 ∥ TUI.3 ∥ TUI.9) — arquivos diferentes, só dependem de TUI.1
           (TUI.4 ∥ TUI.5 ∥ TUI.6 ∥ TUI.7) — arquivos diferentes, só dependem de TUI.1 (rodar em
             no máximo 3 por vez, ver regra do /executar-plano)
           TUI.8 (depende de TUI.4 e TUI.7) → TUI.10 (depende de TUI.9)
           TUI.11 por último entre os componentes (depende de TUI.2 a TUI.10)
           TUI.12 fecha a fase (depende de tudo)
```

`∥` marca o que pode rodar em paralelo, porque não compartilha arquivo. R2 e R3 só dependem de R1
(TR1.1 especificamente) — podem, em tese, rodar em paralelo entre si depois que R1 terminar, mas
como são muitas tarefas cada uma, recomendo terminar R2 (mais simples) antes de começar R3, para
validar o padrão de "escopar por usuário" (`pastoralId`) numa fase menor antes de repetir a mesma
ideia na maior (`catechistId`).
