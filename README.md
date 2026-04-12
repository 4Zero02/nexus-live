# Nexus Live — Overlay Platform

Plataforma de overlays animados para transmissões ao vivo de esports. Controle em tempo real via painel web, integração direta com OBS/Streamlabs/vMix como Browser Source.

## Como funciona

Cada overlay expõe duas URLs:

| URL                                 | Uso                                                       |
| ----------------------------------- | --------------------------------------------------------- |
| `http://localhost:5173/output/:id`  | Adicionar no OBS como Browser Source (fundo transparente) |
| `http://localhost:5173/control/:id` | Painel de controle do streamer                            |
| `http://localhost:5173/dashboard`   | Dashboard geral com todos os overlays                     |

A comunicação entre painel e output é via **WebSocket (Socket.io)** — latência zero, sem polling.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express + Socket.io
- **Animações:** CSS `@keyframes` nativos + Lottie Web (AE → Bodymovin → JSON)
- **Assets:** PNG/WebP (Photoshop) + Lottie JSON (After Effects)
- **Pacotes:** `pnpm` exclusivamente

## Requisitos

- Node.js 18+
- pnpm

## Instalação e uso

```bash
# Instalar dependências
pnpm install

# Rodar servidor (porta 8765) + cliente (porta 5173) simultaneamente
pnpm dev
```

## Estrutura

```
server/
  index.js          # Express + Socket.io
  socketHandler.js  # Eventos overlay:show/hide/update/sync
  state.js          # Persistência de estado em JSON

client/
  output/           # App React — saída transparente para o OBS
    overlays/       # Um componente por overlay
  control/          # App React — painel de controle
    pages/          # Dashboard, OverlayControl, Assets, Styleguide
  shared/           # Hooks, componentes UI e tokens CSS

assets/             # Não versionado — gerenciado pelo designer
  images/           # PNGs/WebPs
  lottie/           # JSONs exportados do After Effects
  fonts/            # Fontes locais
```

## Eventos Socket.io

| Evento           | Descrição                     |
| ---------------- | ----------------------------- |
| `overlay:show`   | Exibe o overlay               |
| `overlay:hide`   | Esconde o overlay             |
| `overlay:update` | Atualiza dados sem esconder   |
| `overlay:sync`   | Sincroniza estado ao conectar |

## Configuração OBS

1. Adicionar **Browser Source** no OBS
2. URL: `http://localhost:5173/output/<id-do-overlay>`
3. Resolução: 1920×1080
4. Marcar **"Allow transparency"**
