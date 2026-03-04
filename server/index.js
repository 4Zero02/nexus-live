import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { setupSocketHandler } from './socketHandler.js'
import { listAssets } from './assets.js'

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

setupSocketHandler(io)

httpServer.listen(PORT, () => {
  console.log(`[server] Nexus Live rodando em http://localhost:${PORT}`)
})
