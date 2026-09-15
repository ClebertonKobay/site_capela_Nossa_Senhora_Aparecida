---
name: executar-plano
description: Executa as tarefas do plano em .claude/PLANO-DETALHADO.md despachando um subagente por tarefa (executor-tarefa/haiku para o mecânico, executor-tarefa-complexa/sonnet para banco, data e segurança), respeitando dependências, rodando npm run build ao fim de cada grupo, revisando o diff e marcando o painel de progresso. Use quando o Cleberton pedir para executar o plano, tocar uma fase ou uma tarefa específica.
argument-hint: <alvo, ex "Fase 8" | "T8.3" | "T8.1 T8.2" | "tudo">
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Agent, TaskOutput, AskUserQuestion
effort: high
---

## Estado do repositório agora

!`git status --short`

## O seu papel

Você é o orquestrador. **Você não implementa** — despacha, verifica, revisa e registra. Quem escreve
o código são os subagentes, um por tarefa. O que você faz de mão própria: conferir o build, ler o
diff com olhos de revisor, consertar o que voltar quebrado depois de duas idas e vindas, e atualizar
o plano.

## Passo 1 — Carregar o plano e escolher o alvo

1. Leia `.claude/PLANO-DETALHADO.md` inteiro (se o argumento apontar outro arquivo de
   `.claude/planos/`, use aquele).
2. Resolva o argumento: `"Fase 8"` = todas as tarefas pendentes da fase; `"T8.3"` = só ela;
   `"tudo"` = tudo que estiver pendente, fase a fase, na ordem sugerida; sem argumento, pergunte.
3. Filtre pelo **Painel de progresso** no topo do plano: tarefa já marcada `[x]` não roda de novo.
4. Descarte deste comando tudo que estiver marcado `não delegar` ou `⚠ confirmar antes` — liste
   essas separadamente na sua resposta como "precisa de você", e siga com o resto.
5. Se uma tarefa alvo depender de outra ainda pendente e fora do alvo, inclua a dependência ou
   avise que vai ficar de fora. Nunca rode uma tarefa com dependência não satisfeita.

## Passo 2 — Montar os grupos

Agrupe as tarefas selecionadas em ondas:

- Uma onda só contém tarefas cujas dependências já estão concluídas.
- **Duas tarefas que listam o mesmo arquivo nunca vão na mesma onda**, mesmo sem dependência
  declarada entre elas. Dois agentes editando o mesmo arquivo sobrescrevem um ao outro.
- No máximo 3 agentes por onda.

Antes de despachar a primeira onda, diga ao Cleberton, em duas linhas, o que vai rodar e em que
ordem. Não peça permissão; só deixe visível.

## Passo 3 — Despachar

Um agente por tarefa, sempre com a ferramenta `Agent`:

- **Modelo `haiku`** no plano → `subagent_type: "executor-tarefa"`
- **Modelo `sonnet`** no plano → `subagent_type: "executor-tarefa-complexa"`

Não passe `model` na chamada — a definição do agente já fixa o modelo e o esforço. Tarefas da mesma
onda vão em **chamadas paralelas, no mesmo bloco**.

O briefing precisa ser autossuficiente: o agente começa do zero, sem o seu contexto e sem ter lido
o plano. Copie os campos da tarefa em vez de mandar ele "ler a tarefa T8.3 no plano".

```
Tarefa T8.3 — Página do evento dentro do shell

Projeto: site da Capela Nossa Senhora Aparecida (Next.js App Router + TypeScript + Tailwind v4 +
Drizzle/Neon). Interface em português, código em inglês. As regras completas estão em CLAUDE.md,
na raiz — leia antes de editar.

Arquivos que você pode tocar: src/app/events/[id]/page.tsx

Contexto que você precisa: <o que o agente não descobriria sozinho — por exemplo, que o
PageShell foi criado na T8.1 e qual é a assinatura dele>

Fazer:
1. <passo>
2. <passo>

Aceite: <comando + o que observar>

Não fazer: <o limite da tarefa>
```

Quando a tarefa depender de algo criado numa onda anterior (um componente novo, uma função
exportada), inclua a **assinatura exata** dele no briefing. É o que evita o agente barato adivinhar
os props errados.

## Passo 4 — Verificar cada onda

Depois que todos os agentes da onda responderem:

1. `npm run build` — sempre, sem exceção. É a regra do `CLAUDE.md`.
2. `git diff --stat` e depois `git diff` nos arquivos tocados. Leia procurando:
   - arquivo mexido fora da lista da tarefa;
   - cor em hex solta no JSX em vez de token (`grep -rn '#[0-9a-fA-F]\{6\}' src --include=*.tsx`);
   - texto de interface em inglês, ou nome de variável em português;
   - alvo de toque abaixo de 44px, texto de corpo abaixo de 16px;
   - `"use client"` aparecendo onde não há estado nem evento;
   - qualquer coisa perto de auth, SQL ou Zod que um agente barato não deveria ter tocado —
     se encontrar, reverta o arquivo e refaça a tarefa com `executor-tarefa-complexa`.
3. Se o build quebrar: mande o erro de volta ao mesmo agente com `SendMessage` (ele mantém o
   contexto). Se na segunda ida ainda quebrar, conserte você mesmo e anote isso no relatório —
   não fique num vaivém caro.
4. Se um agente relatar que o briefing estava errado, **não insista**: corrija a tarefa no plano
   primeiro, depois redespache.

## Passo 5 — Registrar

Ao fim de cada onda, atualize `.claude/PLANO-DETALHADO.md`:

- marque `[x]` no **Painel de progresso**;
- se a execução revelou algo que o plano não previa (um arquivo a mais, uma decisão tomada, uma
  tarefa que virou desnecessária), escreva uma linha sobre isso logo abaixo da tarefa. O plano é
  documento vivo — o que você aprendeu executando vale mais que o que foi planejado antes.

Commit: **só quando o Cleberton pedir.** Quando pedir, um commit por fase, mensagem em português no
imperativo, corpo explicando o porquê, e o build rodado antes.

## Passo 6 — Fechar

Responda em português com:

- o que foi concluído, por tarefa, em uma linha cada;
- o que quebrou e como foi resolvido;
- o que ficou de fora e por quê (dependência, `⚠ confirmar antes`, `não delegar`);
- o que precisa do Cleberton agora — decisão, verificação no navegador, aprovação de dependência;
- qual é a próxima onda.

Não cole diff nem código na resposta. O `git diff` está à mão de quem quiser ver.

## Nunca

- Nunca delegue tarefa marcada `não delegar` ou `⚠ confirmar antes`.
- Nunca deixe um agente rodar migration destrutiva. Migration só por `executor-tarefa-complexa`,
  com o SQL gerado lido antes de aplicar.
- Nunca marque `[x]` em tarefa cujo **Aceite** você não verificou.
- Nunca deixe o build quebrado no fim de uma onda.
- Nunca instale dependência para desbloquear uma tarefa — pare e pergunte (regra do `CLAUDE.md`).
