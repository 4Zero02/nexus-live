import styles from './CountdownTimer.module.css'

const formatTime = (seconds) => {
  const s = Math.max(0, Math.round(seconds))
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

const CountdownTimer = ({ state }) => {
  const visible = state?.visible ?? false
  const primaryColor = state?.primaryColor ?? '#65b307'
  const font = state?.font ?? 'Inter'
  const remaining = state?.remaining ?? 0
  const warningThreshold = state?.warningThreshold ?? 10
  const isWarning = remaining <= warningThreshold && remaining > 0
  const isFinished = remaining <= 0

  return (
    <div
      className={`${styles.container} ${visible ? styles.isVisible : styles.isHidden}`}
      style={{ '--ct-accent': primaryColor, '--ct-font': font }}
    >
      <span
        className={`${styles.time} ${isWarning ? styles.warning : ''} ${isFinished ? styles.finished : ''}`}
      >
        {formatTime(remaining)}
      </span>
    </div>
  )
}

export default CountdownTimer
