import styles from './CS2Header.module.css'

const formatTimer = (remaining) => {
  if (remaining == null) return '--:--'
  const total = Math.max(0, Math.ceil(remaining))
  const mins = Math.floor(total / 60).toString().padStart(2, '0')
  const secs = (total % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

// Ícone de bomba SVG inline
const IconBomb = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
    <circle cx="8" cy="11" r="6" />
    <rect x="7" y="3" width="2" height="4" rx="1" />
    <line x1="12" y1="3" x2="15" y2="0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="15" cy="0" r="1.5" />
  </svg>
)

const CS2Header = ({ match, timer, teamCTName, teamTName, ctColor, tColor }) => {
  const phase     = timer?.phase ?? match?.phase ?? null
  const remaining = timer?.remaining ?? null
  const isWarning = remaining !== null && remaining <= 10 && phase === 'live'
  const isBomb    = phase === 'bomb'
  const isFreeze  = phase === 'freezetime'

  const ctScore = match?.ctScore ?? 0
  const tScore  = match?.tScore  ?? 0
  const roundNum = match?.roundNumber ?? 0
  const maxRounds = 24

  let timerDisplay
  if (isFreeze) {
    timerDisplay = <span className={styles.timerFreeze}>FREEZE</span>
  } else if (isBomb) {
    timerDisplay = (
      <span className={`${styles.timerBomb} ${styles.bombPulse}`}>
        <IconBomb />
        {formatTimer(remaining)}
      </span>
    )
  } else {
    timerDisplay = (
      <span
        className={styles.timerValue}
        style={{ color: isWarning ? '#e53e3e' : '#fff' }}
      >
        {formatTimer(remaining)}
      </span>
    )
  }

  return (
    <div className={styles.header}>
      {/* CT lado */}
      <div className={styles.teamSide} style={{ '--side-color': ctColor }}>
        <span className={styles.teamName} style={{ color: ctColor }}>{teamCTName}</span>
        <span className={styles.score} style={{ color: ctColor }}>{ctScore}</span>
      </div>

      {/* Centro */}
      <div className={styles.center}>
        <div className={styles.timerRow}>{timerDisplay}</div>
        <div className={styles.roundInfo}>
          ROUND {roundNum}/{maxRounds}
        </div>
      </div>

      {/* T lado */}
      <div className={`${styles.teamSide} ${styles.teamSideRight}`} style={{ '--side-color': tColor }}>
        <span className={styles.score} style={{ color: tColor }}>{tScore}</span>
        <span className={styles.teamName} style={{ color: tColor }}>{teamTName}</span>
      </div>
    </div>
  )
}

export default CS2Header
