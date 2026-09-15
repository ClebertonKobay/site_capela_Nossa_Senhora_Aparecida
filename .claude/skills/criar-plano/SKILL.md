---
name: criar-plano
description: Monta um plano de implementação detalhado para o site da capela — investiga o código primeiro, quebra o objetivo em tarefas pequenas com paths, passo a passo, critério de aceite e modelo sugerido, e grava em .claude/PLANO-DETALHADO.md. Use quando o Cleberton pedir um plano, um roadmap, "vamos planejar X" ou "o que falta fazer".
argument-hint: <objetivo, ex "galeria de fotos" | "continuar de onde paramos" | --novo <slug>>
allowed-tools: Read, Glob, Grep, Bash, Write, Edit, AskUserQuestion, WebFetch
effort: high
---

## Estado do repositório agora

!`git log --oneline -5`

!`git status --short`

## O que este comando faz

Produz um plano que um agente barato consegue executar sem pensar. Isso significa: nada de
"melhorar a página do evento". Significa arquivo, linha, classe, comando de verificação.

O plano **ativo** é `.claude/PLANO-DETALHADO.md`. Por padrão, novas fases são **acrescentadas** a
ele. Com `--novo <slug>`, escreva um arquivo separado em `.claude/planos/<AAAA-MM-DD>-<slug>.md`
seguindo o mesmo formato, e deixe uma linha de ponteiro no fim do plano ativo.

## Passo 1 — Ler antes de escrever

Obrigatório, nesta ordem:

1. `CLAUDE.md` — as regras que o plano não pode contrariar (segurança, paleta, telefone, convenções).
2. `.claude/PLANO-DETALHADO.md` — o que já está planejado, para não duplicar nem contradizer.
3. `docs/PLANO.md` — histórico das Fases 0 a 7 e as decisões em aberto de lá.

## Passo 2 — Investigar o código de verdade

Um plano escrito de memória gera tarefas que citam arquivo que não existe, e aí o agente barato
inventa. Antes de escrever qualquer tarefa, levante o terreno do objetivo em questão:

```bash
find src -type f | sort                # o mapa
wc -l src/**/*.tsx src/**/*.ts         # onde está o peso
git log --oneline -15                  # o que mudou por último e por quê
```

Depois, leia os arquivos que a mudança vai tocar — de verdade, não só o nome. Toda tarefa que você
escrever precisa citar um path que existe e uma linha que você viu. Se a tarefa cria arquivo novo,
diga qual componente ou função existente ele vai espelhar.

Aproveite para anotar o que **já está resolvido** e não deve virar tarefa. É o erro mais comum:
planejar de novo algo que já foi feito numa fase anterior.

## Passo 3 — Perguntar o mínimo

Use `AskUserQuestion` no máximo uma vez, com no máximo duas perguntas, e só para decisão que muda
o conteúdo do plano (escopo, ou uma escolha técnica sem padrão óbvio). Não pergunte o que dá para
descobrir lendo o código, e não pergunte "posso seguir?".

Tudo que for dúvida menor vai para a tabela **Decisões em aberto** no fim do plano, com uma
recomendação sua. Plano não trava esperando resposta.

## Passo 4 — Quebrar em tarefas

Granularidade: **uma tarefa é o que um agente pequeno faz sem tomar decisão de arquitetura.**

- Um a três arquivos. Se passar disso, quebre.
- Um resultado verificável por um comando. Se você não consegue escrever o **Aceite**, a tarefa
  ainda está vaga.
- Refatoração pura (mover markup, extrair componente) vira tarefa separada da mudança de
  comportamento. Misturar as duas é o que faz o `git diff` ficar irrevisável.
- Duas tarefas que editam o mesmo arquivo não podem rodar em paralelo — declare a dependência mesmo
  quando ela for só de arquivo, e diga isso no campo **Depende de**.

**Qual modelo marcar:**

| Marque | Quando |
|---|---|
| `haiku` | Markup, classe Tailwind, mover código, página estática, teste de função pura, texto de interface, workflow de CI. |
| `sonnet` | Banco, migration, data/fuso horário, Server Action, Zod, telefone, dinheiro, qualquer coisa a menos de um arquivo de distância da autenticação. |
| `não delegar` | Revisão de segurança, medição de performance no navegador, decisão que depende do Cleberton, qualquer coisa irreversível. |

Na dúvida entre `haiku` e `sonnet`, marque `sonnet`. Um bug de fuso horário custa mais caro que a
diferença de modelo.

## Passo 5 — Escrever no formato canônico

Cada fase abre com dois ou três parágrafos dizendo **por que ela existe** — o problema real, não a
lista de tarefas em prosa. Cada tarefa segue exatamente este molde:

```markdown
### T<fase>.<n> — <título curto, verbo no infinitivo>

- **Arquivos**: cria `path/novo.tsx`; edita `path/existente.tsx`
- **Modelo**: haiku | sonnet | não delegar
- **Depende de**: T8.1, T8.2  (ou —)
- **Fazer**:
  1. Passo concreto, com path e, quando útil, número de linha.
  2. Outro passo.
- **Aceite**: comando que prova que funcionou + o que observar na tela
- **Não fazer**: o limite explícito desta tarefa
```

Campos opcionais quando fizerem falta: **Contexto** (por que a tarefa existe, quando não for
óbvio), **Decisão pendente** (quando a tarefa depende de uma escolha), **Alternativa**.

Marque com `⚠ confirmar antes` toda tarefa que dependa de aprovação — nova dependência, custo,
mudança destrutiva no banco, feature ainda não escolhida.

## Passo 6 — Fechar o plano

O plano termina sempre com:

1. **Decisões em aberto** — tabela com a decisão, o que ela bloqueia e a sua recomendação.
2. **Ordem sugerida de execução** — um bloco de código mostrando a sequência, com `∥` marcando o
   que pode ir em paralelo por não compartilhar arquivo.

Grave o arquivo. Depois, no chat, responda com: quantas tarefas entraram, quantas são `haiku`,
quantas são `sonnet`, o que está bloqueado por decisão, e por onde começar. Não cole o plano
inteiro na resposta — ele está no arquivo.

## O que nunca fazer neste comando

- Não implemente nada. Este comando só escreve plano. Se der vontade de já consertar uma linha,
  a vontade vira tarefa no plano.
- Não planeje contra o `CLAUDE.md` (dependência nova sem perguntar, cor fora dos tokens, lógica de
  auth no client, SQL montado com string).
- Não escreva tarefa que comece com "revisar", "melhorar" ou "avaliar" sem dizer o que é o
  resultado escrito dessa revisão e onde ele fica.
