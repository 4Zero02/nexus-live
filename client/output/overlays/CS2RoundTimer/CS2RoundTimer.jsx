import useCS2GameState from '@shared/useCS2GameState'
import styles from './CS2RoundTimer.module.css'

const PHASE_LABELS = {
  freezetime: 'FREEZE',
  live:       'ROUND',
  bomb:       'BOMBA PLANTADA',
  defuse:     'DEFUSANDO',
  warmup:     'WARMUP',
}

const formatTime = (remaining) => {
  if (remaining == null) return '--'
  const total = Math.max(0, Math.ceil(remaining))
  if (total >= 60) {
    const m = Math.floor(total / 60)
    const s = (total % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }
  return total.toString().padStart(2, '0')
}

const CS2RoundTimer = ({ state }) => {
  const visible           = state?.visible           ?? false
  const primaryColor      = state?.primaryColor      ?? '#48bb78'
  const warningColor      = state?.warningColor      ?? '#e53e3e'
  const font              = state?.font              ?? 'Inter'
  const warningThreshold  = state?.warningThreshold  ?? 10

  const { gameState } = useCS2GameState()
  const timer    = gameState?.timer
  const remaining = timer?.remaining ?? null
  const phase     = timer?.phase ?? null

  const isWarning = remaining !== null && remaining <= warningThreshold
  const isPulse   = remaining !== null && remaining <= 5 && remaining > 0
  const color     = isWarning ? warningColor : primaryColor
  const phaseLabel = PHASE_LABELS[phase] ?? ''

  return (
    <div
      className={`${styles.container} ${visible ? styles.isVisible : styles.isHidden}`}
      style={{ '--accent': color, '--font': font }}
    >
      <span className={`${styles.time} ${isPulse ? styles.pulse : ''}`}>
        {formatTime(remaining)}
      </span>
      {phaseLabel && <span className={styles.phase}>{phaseLabel}</span>}
    </div>
  )
}

export default CS2RoundTimer
