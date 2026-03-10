import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import path from 'path'
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

// GET /assets/file/:category/:filename — serve o arquivo estático
app.get('/assets/file/:category/:filename', (req, res) => {
  const { category, filename } = req.params

  const ALLOWED = ['images', 'lottie', 'fonts']
  if (!ALLOWED.includes(category)) {
    return res.status(400).json({ error: 'Categoria inválida' })
  }

  // Previne path traversal
  const safeName = path.basename(filename)
  const filePath = path.join(ASSETS_DIR, category, safeName)

  res.sendFile(filePath, (err) => {
    if (err) {
      console.warn(`[assets] Arquivo não encontrado: ${filePath}`)
      res.status(404).json({ error: 'Arquivo não encontrado' })
    }
  })
})

// CS2 GSI — estado em memória
global.cs2State = null

// POST /gsi/cs2 — recebe payload do CS2 GSI
app.post('/gsi/cs2', (req, res) => {
  const token = req.body?.auth?.token
  if (token !== 'nexus_gsi_token') {
    console.warn('[CS2 GSI] Token inválido')
    return res.status(401).json({ error: 'Token inválido' })
  }

  const parsed = parseCS2(req.body)
  if (!parsed) return res.sendStatus(200)

  global.cs2State = parsed
  io.emit('cs2:gamestate', parsed)

  for (const kill of parsed.kills) {
    io.emit('cs2:kill', kill)
  }

  res.sendStatus(200)
})

// GET /gsi/cs2/state — retorna último estado conhecido
app.get('/gsi/cs2/state', (_req, res) => {
  res.json(global.cs2State)
})

setupSocketHandler(io)

httpServer.listen(PORT, () => {
  console.log(`[server] Nexus Live rodando em http://localhost:${PORT}`)
})
