import fs from 'fs-extra'
import path from 'path'

const CATEGORIES = {
  images: ['.png', '.webp', '.jpg', '.jpeg', '.gif', '.svg'],
  lottie: ['.json'],
  fonts: ['.ttf', '.otf', '.woff', '.woff2'],
}

export const listAssets = async (assetsDir) => {
  const result = { images: [], lottie: [], fonts: [] }

  const dirExists = await fs.pathExists(assetsDir)
  if (!dirExists) return result

  for (const [category, exts] of Object.entries(CATEGORIES)) {
    const categoryDir = path.join(assetsDir, category)
    const exists = await fs.pathExists(categoryDir)
    if (!exists) continue

    try {
      const files = await fs.readdir(categoryDir)
      result[category] = files.filter(f => {
        const ext = path.extname(f).toLowerCase()
        return exts.includes(ext)
      })
    } catch (err) {
      console.warn(`[assets] Erro ao ler ${categoryDir}:`, err.message)
    }
  }

  return result
}
