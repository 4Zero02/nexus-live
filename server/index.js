import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { setupSocketHandler } from './socketHandler.js'
import { listAssets } from './assets.js'
import { parse as parseCS2 } from './gsi/cs2Parser.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.resolve(__dirname, '../assets')

const PORT = 8765
const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// GET /assets/list — lista todos os assets por categoria
app.get('/assets/list', async (_req, res) => {
  try {
    const list = await listAssets(ASSETS_DIR)
    res.json(list)
  } catch (err) {
    console.error('[assets] Erro ao listar assets:', err)
    res.json({ images: [], lottie: [], fonts: [] })
  }
})

// GET /assets/file/:category/:filename — serve o arquivo estático (suporta subpastas)
app.get('/assets/file/:category/*', (req, res) => {
  const { category } = req.params
  const subPath = req.params[0] // wildcard após :category/

  const ALLOWED = ['images', 'lottie', 'fonts']
  if (!ALLOWED.includes(category)) {
    return res.status(400).json({ error: 'Categoria inválida' })
  }

  // Previne path traversal — resolve e verifica que está dentro de ASSETS_DIR/category
  const filePath = path.resolve(ASSETS_DIR, category, subPath)
  const allowedBase = path.resolve(ASSETS_DIR, category)
  if (!filePath.startsWith(allowedBase + path.sep) && filePath !== allowedBase) {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  res.sendFile(filePath, (err) => {
    if (err) {
      console.warn(`[assets] Arquivo não encontrado: ${filePath}`)
      res.status(404).json({ error: 'Arquivo não encontrado' })
    }
  })
})

// CS2 GSI — estado em memória
global.cs2State = null

// Captura one-shot do payload bruto para examples/cs2-payload.json
// Só captura quando a bomba está plantada (payload rico, meio de jogo)
const EXAMPLES_DIR = path.resolve(__dirname, '../examples')
const PAYLOAD_CAPTURE_PATH = path.join(EXAMPLES_DIR, 'cs2-payload.json')
let payloadCaptured = false

// POST /gsi/cs2 — recebe payload do CS2 GSI
app.post('/gsi/cs2', (req, res) => {
  const token = req.body?.auth?.token
  if (token !== 'nexus_gsi_token') {
    console.warn('[CS2 GSI] Token inválido')
    return res.status(401).json({ error: 'Token inválido' })
  }

  // Grava o primeiro payload com bomba plantada para análise
  if (!payloadCaptured && req.body?.bomb?.state === 'planted') {
    try {
      fs.mkdirSync(EXAMPLES_DIR, { recursive: true })
      fs.writeFileSync(PAYLOAD_CAPTURE_PATH, JSON.stringify(req.body, null, 2), 'utf-8')
      payloadCaptured = true
      console.log('[CS2 GSI] Payload capturado (bomba plantada) em examples/cs2-payload.json')
    } catch (err) {
      console.error('[CS2 GSI] Erro ao capturar payload:', err)
    }
  }

  const parsed = parseCS2(req.body)
  if (!parsed) return res.sendStatus(200)

  global.cs2State = parsed
  io.emit('cs2:gamestate', parsed)

  res.sendStatus(200)
})

// GET /gsi/cs2/state — retorna último estado conhecido
app.get('/gsi/cs2/state', (_req, res) => {
  res.json(global.cs2State)
})

// GET /gsi/cs2/radars — retorna coordenadas dos mapas para o radar
app.get('/gsi/cs2/radars', (_req, res) => {
  const radarsPath = path.join(ASSETS_DIR, 'images/cs2/radars.json')
  try {
    const data = fs.readFileSync(radarsPath, 'utf-8')
    res.setHeader('Content-Type', 'application/json')
    res.send(data)
  } catch (err) {
    console.warn('[CS2 GSI] radars.json não encontrado:', radarsPath)
    res.json({})
  }
})

setupSocketHandler(io)

httpServer.listen(PORT, () => {
  console.log(`[server] Nexus Live rodando em http://localhost:${PORT}`)
})
