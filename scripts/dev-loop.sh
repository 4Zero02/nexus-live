#!/bin/bash
# =============================================================================
# dev-loop.sh — Nexus Elite Overlay Platform
# Roda claude -p em loop com contexto limpo a cada iteração.
# Cada chamada implementa UMA task do TASKS.md e faz commit.
# =============================================================================

set -e

MAX_ITERATIONS=${1:-60}
ITERATION=0
PROMPT_FILE="$(dirname "$0")/task-prompt.md"
LOG_FILE="$(dirname "$0")/dev-loop.log"
PROGRESS_FILE="$(dirname "$0")/progress.txt"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
  echo -e "$1" | tee -a "$LOG_FILE"
}

# Verifica dependências
if ! command -v claude &> /dev/null; then
  echo -e "${RED}Erro: claude CLI não encontrado. Instale com: npm install -g @anthropic-ai/claude-code${NC}"
  exit 1
fi



# Inicializa arquivos de suporte
touch "$PROGRESS_FILE"
touch "$LOG_FILE"

count_pending() {
  grep -c '^\- \[ \]' docs/TASKS.md 2>/dev/null || echo "0"
}

log "\n${BLUE}════════════════════════════════════════════${NC}"
log "${BLUE}  Nexus Elite — Dev Loop${NC}"
log "${BLUE}════════════════════════════════════════════${NC}"
log "Início: $(date)"
log "Tasks pendentes: $(count_pending)"
log "Max iterações: $MAX_ITERATIONS\n"

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  ITERATION=$((ITERATION + 1))
  PENDING=$(count_pending)

  if [ "$PENDING" -eq 0 ]; then
    log "\n${GREEN}✓ Todas as tasks concluídas!${NC}"
    log "Total de iterações: $ITERATION"
    log "Fim: $(date)"
    break
  fi

  log "\n${YELLOW}── Iteração $ITERATION / $MAX_ITERATIONS (${PENDING} tasks pendentes) ──${NC}"

  # Monta o contexto de progresso para esta iteração
  PROGRESS_CONTEXT=""
  if [ -s "$PROGRESS_FILE" ]; then
    PROGRESS_CONTEXT="
## Aprendizados das iterações anteriores
$(tail -50 "$PROGRESS_FILE")
"
  fi

  # Lê o prompt base e injeta o contexto de progresso
  FULL_PROMPT="$(cat "$PROMPT_FILE")

$PROGRESS_CONTEXT"

  # Executa claude -p com contexto limpo
  OUTPUT=$(claude -p "$FULL_PROMPT" --dangerously-skip-permissions 2>&1)
  EXIT_CODE=$?

  # Loga o output
  echo "$OUTPUT" >> "$LOG_FILE"

  # Verifica se concluiu com sucesso
  if echo "$OUTPUT" | grep -q "<promise>TASK_DONE</promise>"; then
    log "${GREEN}✓ Task concluída com sucesso${NC}"

    # Extrai aprendizado se o Claude escreveu um
    LEARNING=$(echo "$OUTPUT" | grep -A5 "APRENDIZADO:" | head -6 | tail -5)
    if [ -n "$LEARNING" ]; then
      echo "--- Iteração $ITERATION ($(date '+%Y-%m-%d %H:%M')) ---" >> "$PROGRESS_FILE"
      echo "$LEARNING" >> "$PROGRESS_FILE"
      echo "" >> "$PROGRESS_FILE"
    fi

  elif echo "$OUTPUT" | grep -q "<promise>ALL_DONE</promise>"; then
    log "\n${GREEN}✓ PROJETO COMPLETO! Todas as tasks implementadas.${NC}"
    log "Total de iterações: $ITERATION"
    log "Fim: $(date)"
    break

  elif [ $EXIT_CODE -ne 0 ]; then
    log "${RED}✗ Erro na iteração $ITERATION (exit code: $EXIT_CODE)${NC}"
    log "Tentando continuar na próxima iteração..."
    sleep 3
    continue
  fi

  # Pequena pausa entre iterações para não sobrecarregar a API
  sleep 2
done

log "\n${BLUE}════════════════════════════════════════════${NC}"
log "Dev loop encerrado. Veja dev-loop.log para detalhes."