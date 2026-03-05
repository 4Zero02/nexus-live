import styles from './ScoreboardPreview.module.css'

const ScoreboardPreview = () => (
  <div className={styles.wrapper}>
    <div className={styles.event}>NEXUS ELITE — GRAND FINAL</div>
    <div className={styles.board}>
      <div className={styles.team}>
        <div className={styles.logo}>NXS</div>
        <span className={styles.name}>NEXUS</span>
      </div>
      <div className={styles.scores}>
        <span className={styles.score}>2</span>
        <span className={styles.sep}>–</span>
        <span className={styles.score}>1</span>
      </div>
      <div className={`${styles.team} ${styles.teamReverse}`}>
        <div className={styles.logo}>ALT</div>
        <span className={styles.name}>ALTAIR</span>
      </div>
    </div>
  </div>
)

export default ScoreboardPreview
