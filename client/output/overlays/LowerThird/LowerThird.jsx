import styles from './LowerThird.module.css'

const LowerThird = ({ state }) => {
  const visible = state?.visible ?? false
  const name = state?.name ?? ''
  const title = state?.title ?? ''

  return (
    <div className={`${styles.container} ${visible ? styles.isVisible : styles.isHidden}`}>
      <div className={styles.bar} />
      <div className={styles.text}>
        <span className={styles.name}>{name}</span>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  )
}

export default LowerThird
