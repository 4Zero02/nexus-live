import { useState, useEffect } from 'react'
import ImageGrid from './ImageGrid'
import LottieGrid from './LottieGrid'
import FontList from './FontList'
import styles from './AssetsPage.module.css'

const TABS = [
  { id: 'images', label: 'Imagens' },
  { id: 'lottie', label: 'Lottie' },
  { id: 'fonts', label: 'Fontes' },
]

const AssetsPage = () => {
  const [activeTab, setActiveTab] = useState('images')
  const [assets, setAssets] = useState({ images: [], lottie: [], fonts: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/assets/list')
      .then(r => r.json())
      .then(data => {
        setAssets(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('[AssetsPage] Erro ao carregar lista de assets:', err)
        setError('Não foi possível carregar a lista de assets.')
        setLoading(false)
      })
  }, [])

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Assets</h1>

      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {!loading && (
              <span className={styles.count}>{assets[tab.id]?.length ?? 0}</span>
            )}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {loading && <p className={styles.loading}>Carregando assets...</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}
        {!loading && !error && (
          <>
            {activeTab === 'images' && <ImageGrid files={assets.images} />}
            {activeTab === 'lottie' && <LottieGrid files={assets.lottie} />}
            {activeTab === 'fonts' && <FontList files={assets.fonts} />}
          </>
        )}
      </div>
    </div>
  )
}

export default AssetsPage
