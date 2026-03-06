import styles from './NewsTicker.module.css'

const SPEED_DURATION = {
  1: '60s',
  2: '45s',
  3: '30s',
  4: '20s',
  5: '12s',
}

const NewsTicker = ({ state }) => {
  const visible = state?.visible ?? false
  const labelText = state?.labelText ?? 'AO VIVO'
  const labelColor = state?.labelColor ?? '#e11d48'
  const backgroundColor = state?.backgroundColor ?? 'rgba(10, 10, 10, 0.92)'
  const items = state?.items ?? []
  const speed = state?.speed ?? 3

  const duration = SPEED_DURATION[speed] ?? SPEED_DURATION[3]
  const content = items.length > 0 ? items.join('   •   ') : '\u00A0'

  return (
    <div
      className={`${styles.ticker} ${visible ? styles.isVisible : styles.isHidden}`}
      style={{
        '--ticker-bg': backgroundColor,
        '--ticker-label-bg': labelColor,
        '--ticker-duration': duration,
      }}
    >
      <div className={styles.label}>{labelText}</div>
      <div className={styles.track}>
        <span className={styles.content} aria-live="polite">
          {content}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{content}
        </span>
      </div>
    </div>
  )
}

export default NewsTicker
