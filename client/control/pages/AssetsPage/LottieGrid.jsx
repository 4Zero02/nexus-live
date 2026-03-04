import { useState, useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import AssetModal from './AssetModal'
import styles from './AssetsPage.module.css'

const LottiePreview = ({ file, size = 80 }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    let anim = null
    fetch(`/assets/file/lottie/${file}`)
      .then(r => r.json())
      .then(animData => {
        if (!containerRef.current) return
        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animData,
        })
      })
      .catch(() => {
        console.warn(`[LottieGrid] Falha ao carregar ${file}`)
      })

    return () => {
      if (anim) anim.destroy()
    }
  }, [file])

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  )
}

const LottieGrid = ({ files }) => {
  const [selected, setSelected] = useState(null)

  if (files.length === 0) {
    return <p className={styles.empty}>Nenhum arquivo Lottie encontrado em <code>/assets/lottie/</code></p>
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
            <div className={styles.lottiePreviewWrap}>
              <LottiePreview file={file} size={80} />
            </div>
            <span className={styles.thumbName}>{file}</span>
          </button>
        ))}
      </div>

      {selected && (
        <AssetModal title={selected} onClose={() => setSelected(null)}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LottiePreview file={selected} size={300} />
          </div>
        </AssetModal>
      )}
    </>
  )
}

export default LottieGrid
