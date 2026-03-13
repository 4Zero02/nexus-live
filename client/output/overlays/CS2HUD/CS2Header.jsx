import styles from './CS2Header.module.css'

const BOMB_ICON = '/assets/file/images/cs2/icons/planted-bomb.svg'

const formatTimer = (remaining) => {
  if (remaining == null) return '--:--'
  const total = Math.max(0, Math.ceil(remaining))
  const mins = Math.floor(total / 60).toString().padStart(2, '0')
  const secs = (total % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

const MapDots = ({ wins, total, color }) => {
  if (!total) return null
  return (
    <div className={styles.mapDots}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`${styles.mapDot} ${i < wins ? styles.mapDotFilled : ''}`}
          style={i < wins ? { background: color } : {}}
        />
      ))}
    </div>
  )
}

const CS2Header = ({
  match,
  timer,
  teamCTLogo,
  teamTLogo,
  swapSides = false,
  seriesFormat = 'md1',
  seriesScore = { ct: 0, t: 0 },
  teamCTShortName = 'CT',
  teamTShortName = 'TR',
  ctColor = '#4a9eff',
  tColor = '#f5a623',
}) => {
  const phase     = timer?.phase ?? match?.phase ?? null
  const remaining = timer?.remaining ?? null
  const isWarning = remaining !== null && remaining <= 10 && phase === 'live'
  const isBomb    = phase === 'bomb'
  const isFreeze  = phase === 'freezetime'

  const ctScore = match?.ctScore ?? 0
  const tScore  = match?.tScore  ?? 0
  const roundNum = match?.roundNumber ?? 0

  // Swap visual positions if needed
  const leftScore    = swapSides ? tScore    : ctScore
  const rightScore   = swapSides ? ctScore   : tScore
  const leftLogo     = swapSides ? teamTLogo : teamCTLogo
  const rightLogo    = swapSides ? teamCTLogo : teamTLogo
  const leftMapWins  = swapSides ? (seriesScore?.t  ?? 0) : (seriesScore?.ct ?? 0)
  const rightMapWins = swapSides ? (seriesScore?.ct ?? 0) : (seriesScore?.t  ?? 0)
  const leftColor    = swapSides ? tColor  : ctColor
  const rightColor   = swapSides ? ctColor : tColor
  const leftShort    = swapSides ? teamTShortName : teamCTShortName
  const rightShort   = swapSides ? teamCTShortName : teamTShortName

  const seriesMax = seriesFormat === 'md3' ? 3 : seriesFormat === 'md5' ? 5 : 0

  let timerDisplay
  if (isFreeze) {
    timerDisplay = <span className={styles.timerFreeze}>FREEZE</span>
  } else if (isBomb) {
    timerDisplay = (
      <span className={`${styles.timerBomb} ${styles.bombPulse}`}>
        <img src={BOMB_ICON} className={styles.bombIcon} alt="" />
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
      {/* Lado esquerdo */}
      <div className={styles.teamSide}>
        {leftLogo && (
          <img src={`/assets/file/images/${leftLogo}`} className={styles.teamLogo} alt="" />
        )}
        <div className={styles.scoreBlock}>
          <span className={styles.score} style={{ color: leftColor }}>{leftScore}</span>
          {seriesMax > 0 && (
            <MapDots wins={leftMapWins} total={seriesMax} color={leftColor} />
          )}
        </div>
      </div>

      {/* Centro */}
      <div className={styles.center}>
        <div className={styles.timerRow}>{timerDisplay}</div>
        {seriesMax > 0 && (
          <div className={styles.seriesRow}>
            <span className={styles.seriesLabel} style={{ color: leftColor }}>{leftShort}</span>
            <span className={styles.seriesScore}>
              {leftMapWins} – {rightMapWins}
            </span>
            <span className={styles.seriesLabel} style={{ color: rightColor }}>{rightShort}</span>
          </div>
        )}
        <div className={styles.roundInfo}>ROUND {roundNum + 1}</div>
      </div>

      {/* Lado direito */}
      <div className={`${styles.teamSide} ${styles.teamSideRight}`}>
        <div className={styles.scoreBlock}>
          <span className={styles.score} style={{ color: rightColor }}>{rightScore}</span>
          {seriesMax > 0 && (
            <MapDots wins={rightMapWins} total={seriesMax} color={rightColor} />
          )}
        </div>
        {rightLogo && (
          <img src={`/assets/file/images/${rightLogo}`} className={styles.teamLogo} alt="" />
        )}
      </div>
    </div>
  )
}

export default CS2Header
