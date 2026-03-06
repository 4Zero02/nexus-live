import styles from './NewsTickerPreview.module.css'

const NewsTickerPreview = () => (
  <div className={styles.wrapper}>
    <div className={styles.ticker}>
      <div className={styles.label}>AO VIVO</div>
      <div className={styles.track}>
        <span className={styles.text}>Notícia em destaque • Segunda notícia importante • Terceira manchete</span>
      </div>
    </div>
  </div>
)

export default NewsTickerPreview
