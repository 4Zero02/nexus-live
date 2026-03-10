# Nexus Elite — Task Agent

## Leitura obrigatória antes de começar
Leia estes arquivos na ordem:
1. `CLAUDE.md` — arquitetura, regras e o que NÃO fazer
2. `docs/CONTEXT.md` — estado atual e decisões tomadas
3. `docs/TASKS.md` — lista de tasks com status `[ ]` pendente e `[x]` concluído

## Sua missão nesta execução
Encontre o **primeiro item `[ ]` pendente** no TASKS.md (de cima para baixo) e implemente-o. Cada linha `- [ ]` é uma unidade de trabalho independente. Implemente apenas esse item, faça o commit e encerre.

## O que é "um item"
Cada linha `- [ ]` no TASKS.md é um item. Exemplos:

```
- [ ] Atualizar `state.js`: funções getState, setState...   ← UM item
- [ ] Adicionar evento `instance:create`...                  ← UM item
- [ ] Criar `LowerThirdPreview.jsx`                         ← UM item
```

Não agrupe múltiplos itens numa execução. Um item → implementa → commit → encerra.

## Regras inegociáveis (do CLAUDE.md)
- Use APENAS `pnpm` — nunca `npm` ou `yarn`
- Output nunca tem fundo ou dimensões fixas — `background: transparent`, componente define seu tamanho
- Estado é SEMPRE unificado em `state` — nunca separe em `config` + `state`
- Se asset faltar: logue no console, renderize vazio, nunca quebre o output
- CSS Modules para estilização, `@keyframes` nativos para animações
- Componentes React em arrow functions com `default export`
- Nomes de eventos Socket.io: `namespace:ação` (ex: `overlay:show`, `instance:create`)

## Referência rápida de arquitetura

### Estrutura de uma instância no state.json
```json
{
  "lower-third_abc123": {
    "type": "lower-third",
    "name": "Lower Third — Roxo Gotham",
    "state": {
      "visible": false,
      "primaryColor": "#7c3aed",
      "font": "Gotham",
      "icon": "instagram.png",
      "mainText": "Savyo",
      "secondText": "Host"
    }
  }
}
```

### Estrutura de um tipo no overlayRegistry.js
```js
{
  id: 'lower-third',
  label: 'Lower Third',
  description: 'Nome e cargo do apresentador ou entrevistado',
  preview: LowerThirdPreview,
  outputComponent: LowerThird,
  controlComponent: LowerThirdControl,
  defaultState: {
    visible: false,
    primaryColor: '#65b307',
    font: 'Inter',
    icon: null,
    mainText: '',
    secondText: '',
  },
}
```

### Eventos Socket.io
- `overlay:show` / `overlay:hide` — visibilidade
- `overlay:update` — atualiza qualquer campo do state
- `overlay:sync` — sincroniza estado ao conectar
- `instance:create` — `{ type, name }` → cria com `defaultState`
- `instance:delete` — `{ id }` → remove
- `instance:list` — `{ type? }` → retorna instâncias

### Rotas do painel
- `/dashboard` → cards por tipo
- `/overlay/:typeId` → lista de instâncias do tipo
- `/control/:id` → painel ao vivo
- `/assets` → gerenciador de assets
- `/output/:id` → output para OBS

## Processo de execução

### 1. Identifique o item
Leia o TASKS.md e localize a primeira linha `- [ ]`. Anote o texto exato do item e a qual seção pertence (ex: "seção 8.2 — evento instance:create").

### 2. Trate itens especiais
- **🧪 (teste manual)**: marque `[ ]` → `[x]` no TASKS.md sem implementar código. Faça commit com `chore(tasks): marcar teste manual X como concluído` e encerre.
- **⚠️ (atenção)**: avalie o estado atual dos arquivos antes de implementar. Migre dados existentes em vez de sobrescrever.

### 3. Implemente
Execute o item completamente conforme a spec do TASKS.md. Leia os arquivos existentes antes de criar novos — nunca duplique código.

### 4. Verifique o build
```bash
pnpm build 2>&1 | tail -30
```
Se houver erro, corrija antes de continuar.

### 5. Marque como concluído no TASKS.md
Mude a linha `- [ ]` para `- [x]`.

### 6. Faça commit imediatamente
```bash
git add -A
git commit -m "tipo(escopo): descrição em português"
```

Tipos: `feat`, `refactor`, `fix`, `chore`
Escopos: `state`, `socket`, `registry`, `output`, `dashboard`, `lower-third`, `social-bug`, `scoreboard`, `timer`, `ticker`, `lottie`, `nav`, `pages`, `tasks`

Exemplos:
- `feat(state): adicionar funções createInstance e deleteInstance`
- `feat(socket): adicionar evento instance:create com nanoid`
- `feat(registry): expandir overlayRegistry com defaultState e preview`
- `feat(lower-third): criar LowerThirdPreview para o dashboard`
- `chore(tasks): marcar teste manual 8.6 como concluído`

### 7. Registre um aprendizado (opcional)
Se descobriu algo relevante sobre o projeto, escreva ao final:
```
APRENDIZADO: [padrão, gotcha ou convenção descoberta]
```

## Condição de saída

Após o commit, verifique o TASKS.md:

- **Se ainda há `[ ]` pendentes**: output `<promise>TASK_DONE</promise>` e encerre.
- **Se todas estão `[x]`**: atualize `docs/CONTEXT.md` marcando todas as etapas como concluídas, faça commit `chore(docs): marcar projeto como concluído` e output `<promise>ALL_DONE</promise>`.