import { useState } from 'react'
import AssetModal from './AssetModal'
import styles from './AssetsPage.module.css'

const ImageGrid = ({ files }) => {
  const [selected, setSelected] = useState(null)

  if (files.length === 0) {
    return <p className={styles.empty}>Nenhuma imagem encontrada em <code>/assets/images/</code></p>
  }

  return (
    <>
      <div className={styles.grid}>
        {files.map((file) => (
          <button
            key={file}
            className={styles.thumb}
            onClick={() => setSelected(file)}
            title={file}
          >
            <img
              src={`/assets/file/images/${file}`}
              alt={file}
              className={styles.thumbImg}
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span className={styles.thumbName}>{file}</span>
          </button>
        ))}
      </div>

      {selected && (
        <AssetModal title={selected} onClose={() => setSelected(null)}>
          <img
            src={`/assets/file/images/${selected}`}
            alt={selected}
            style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }}
            onError={(e) => {
              e.target.style.display = 'none'
              console.warn('[ImageGrid] imagem não encontrada:', selected)
            }}
          />
        </AssetModal>
      )}
    </>
  )
}

export default ImageGrid
