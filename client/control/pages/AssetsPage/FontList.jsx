import { useEffect, useState } from 'react'
import styles from './AssetsPage.module.css'

const FontItem = ({ file }) => {
  const [loaded, setLoaded] = useState(false)
  const fontName = file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')

  useEffect(() => {
    const url = `/assets/file/fonts/${file}`
    const font = new FontFace(fontName, `url(${url})`)
    font.load()
      .then(loadedFont => {
        document.fonts.add(loadedFont)
        setLoaded(true)
      })
      .catch(() => {
        console.warn(`[FontList] Falha ao carregar fonte ${file}`)
        setLoaded(true)
      })
  }, [file, fontName])

  return (
    <div className={styles.fontItem}>
      <div className={styles.fontMeta}>
        <span className={styles.fontFile}>{file}</span>
        {!loaded && <span className={styles.fontLoading}>carregando...</span>}
      </div>
      {loaded && (
        <span className={styles.fontPreview} style={{ fontFamily: `"${fontName}", sans-serif` }}>
          Nexus Elite 0123
        </span>
      )}
    </div>
  )
}

const FontList = ({ files }) => {
  if (files.length === 0) {
    return <p className={styles.empty}>Nenhuma fonte encontrada em <code>/assets/fonts/</code></p>
  }

  return (
    <div className={styles.fontList}>
      {files.map((file) => (
        <FontItem key={file} file={file} />
      ))}
    </div>
  )
}

export default FontList
