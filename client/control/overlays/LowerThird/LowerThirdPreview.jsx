import styles from './LowerThirdPreview.module.css'

const LowerThirdPreview = () => (
  <div className={styles.wrapper}>
    <div className={styles.bar} />
    <div className={styles.text}>
      <span className={styles.name}>Nome do Apresentador</span>
      <span className={styles.title}>Cargo / Função</span>
    </div>
  </div>
)

export default LowerThirdPreview
