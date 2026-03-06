import styles from './IntroOutroPreview.module.css'

const IntroOutroPreview = () => (
  <div className={styles.wrapper}>
    <div className={styles.card}>
      <div className={styles.icon}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <span className={styles.label}>INTRO / OUTRO</span>
    </div>
  </div>
)

export default IntroOutroPreview
