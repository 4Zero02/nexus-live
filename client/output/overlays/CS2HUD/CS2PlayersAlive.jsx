import styles from './CS2PlayersAlive.module.css'

const IconPlayerAlive = ({ color }) => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill={color} aria-hidden="true">
    <circle cx="5" cy="3.5" r="2.5" />
    <path d="M1,13 C1,9.7 2.8,8 5,8 C7.2,8 9,9.7 9,13 Z" />
  </svg>
)

const CS2PlayersAlive = ({ players = [], ctColor = '#4a9eff', tColor = '#f5a623' }) => {
  const ctAlive = players.filter((p) => p.team === 'CT' && p.isAlive).length
  const tAlive  = players.filter((p) => p.team === 'T'  && p.isAlive).length

  return (
    <div className={styles.container}>
      <div className={styles.label}>PLAYERS ALIVE</div>
      <div className={styles.counts}>
        <div className={styles.side}>
          <div className={styles.icons}>
            {Array.from({ length: 5 }, (_, i) => (
              <IconPlayerAlive
                key={i}
                color={i < ctAlive ? ctColor : 'rgba(255,255,255,0.12)'}
              />
            ))}
          </div>
          <span className={styles.num} style={{ color: ctColor }}>{ctAlive}</span>
        </div>

        <span className={styles.vs}>vs</span>

        <div className={`${styles.side} ${styles.sideRight}`}>
          <span className={styles.num} style={{ color: tColor }}>{tAlive}</span>
          <div className={`${styles.icons} ${styles.iconsRight}`}>
            {Array.from({ length: 5 }, (_, i) => (
              <IconPlayerAlive
                key={i}
                color={i < tAlive ? tColor : 'rgba(255,255,255,0.12)'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CS2PlayersAlive
