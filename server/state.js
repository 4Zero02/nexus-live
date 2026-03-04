import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STATE_FILE = path.join(__dirname, 'data', 'state.json')

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

export const getState = async (overlayId) => {
  const all = await readAll()
  return all[overlayId] ?? null
}

export const setState = async (overlayId, state) => {
  const all = await readAll()
  all[overlayId] = { ...all[overlayId], ...state }
  await writeAll(all)
  return all[overlayId]
}

export const getAllStates = async () => {
  return readAll()
}
