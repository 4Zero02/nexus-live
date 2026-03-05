import styles from './LowerThird.module.css'

const LowerThird = ({ state }) => {
  const visible = state?.visible ?? false
  const mainText = state?.mainText ?? ''
  const secondText = state?.secondText ?? ''
  const primaryColor = state?.primaryColor ?? '#65b307'
  const font = state?.font ?? 'Inter'
  const icon = state?.icon ?? null

  const iconUrl = icon ? `/assets/file/images/${icon}` : null

  return (
    <div
      className={`${styles.container} ${visible ? styles.isVisible : styles.isHidden}`}
      style={{ '--lt-accent': primaryColor, '--lt-font': font }}
    >
      {iconUrl && (
        <img
          className={styles.icon}
          src={iconUrl}
          alt=""
          onError={(e) => { e.currentTarget.style.display = 'none'; console.warn('[LowerThird] icon not found:', icon) }}
        />
      )}
      <div className={styles.bar} />
      <div className={styles.text}>
        <span className={styles.name}>{mainText}</span>
        {secondText && <span className={styles.title}>{secondText}</span>}
      </div>
    </div>
  )
}

export default LowerThird
