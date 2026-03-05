import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STATE_FILE = path.join(__dirname, 'data', 'state.json')

const nanoid = (len = 6) => randomBytes(len).toString('base64url').slice(0, len)

const ensureFile = async () => {
  await fs.ensureFile(STATE_FILE)
  const content = await fs.readFile(STATE_FILE, 'utf-8').catch(() => '')
  if (!content.trim()) {
    await fs.writeJson(STATE_FILE, {})
  }
}

const readAll = async () => {
  await ensureFile()
  try {
    return await fs.readJson(STATE_FILE)
  } catch (err) {
    console.error('[state] Erro ao ler state.json:', err.message)
    return {}
  }
}

const writeAll = async (data) => {
  try {
    await fs.writeJson(STATE_FILE, data, { spaces: 2 })
  } catch (err) {
    console.error('[state] Erro ao salvar state.json:', err.message)
  }
}

// Retorna o state de uma instância pelo ID
export const getState = async (id) => {
  const all = await readAll()
  return all[id] ?? null
}

// Aplica patch no state de uma instância e persiste
export const setState = async (id, patch) => {
  const all = await readAll()
  if (!all[id]) {
    console.warn(`[state] Instância não encontrada: ${id}`)
    return null
  }
  all[id].state = { ...all[id].state, ...patch }
  await writeAll(all)
  return all[id]
}

// Cria nova instância de um tipo com o defaultState fornecido
export const createInstance = async (type, name, defaultState) => {
  const all = await readAll()
  const id = `${type}_${nanoid(6)}`
  all[id] = {
    type,
    name,
    state: { ...defaultState },
  }
  await writeAll(all)
  return { id, ...all[id] }
}

// Remove uma instância pelo ID
export const deleteInstance = async (id) => {
  const all = await readAll()
  if (!all[id]) return false
  delete all[id]
  await writeAll(all)
  return true
}

// Retorna todas as instâncias como array { id, type, name, state }
export const getAllInstances = async () => {
  const all = await readAll()
  return Object.entries(all).map(([id, instance]) => ({ id, ...instance }))
}

// Retorna instâncias filtradas por tipo
export const getInstancesByType = async (typeId) => {
  const all = await getAllInstances()
  return all.filter((instance) => instance.type === typeId)
}
