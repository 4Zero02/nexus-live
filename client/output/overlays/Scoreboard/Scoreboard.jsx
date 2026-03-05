import { useRef, useState, useEffect } from 'react'
import styles from './Scoreboard.module.css'

const TeamSide = ({ team, font, primaryColor, reverse = false }) => {
  const name = team?.name ?? ''
  const logo = team?.logo ?? null
  const logoUrl = logo ? `/assets/file/images/${logo}` : null
  const initials = name ? name.slice(0, 3).toUpperCase() : '???'

  return (
    <div className={`${styles.team} ${reverse ? styles.teamReverse : ''}`} style={{ '--sb-accent': primaryColor, '--sb-font': font }}>
      <div className={styles.teamLogo}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'flex'
              console.warn('[Scoreboard] logo not found:', logo)
            }}
          />
        ) : null}
        <span
          className={styles.teamInitials}
          style={{ display: logoUrl ? 'none' : 'flex' }}
        >
          {initials}
        </span>
      </div>
      <span className={styles.teamName}>{name}</span>
    </div>
  )
}

const Scoreboard = ({ state }) => {
  const visible = state?.visible ?? false
  const primaryColor = state?.primaryColor ?? '#65b307'
  const font = state?.font ?? 'Inter'
  const teamA = state?.teamA ?? { name: '', score: 0, logo: null }
  const teamB = state?.teamB ?? { name: '', score: 0, logo: null }
  const event = state?.event ?? ''

  const prevScoreA = useRef(teamA.score)
  const prevScoreB = useRef(teamB.score)
  const [flashA, setFlashA] = useState(false)
  const [flashB, setFlashB] = useState(false)

  useEffect(() => {
    if (teamA.score !== prevScoreA.current) {
      prevScoreA.current = teamA.score
      setFlashA(true)
      const t = setTimeout(() => setFlashA(false), 600)
      return () => clearTimeout(t)
    }
  }, [teamA.score])

  useEffect(() => {
    if (teamB.score !== prevScoreB.current) {
      prevScoreB.current = teamB.score
      setFlashB(true)
      const t = setTimeout(() => setFlashB(false), 600)
      return () => clearTimeout(t)
    }
  }, [teamB.score])

  return (
    <div
      className={`${styles.container} ${visible ? styles.isVisible : styles.isHidden}`}
      style={{ '--sb-accent': primaryColor, '--sb-font': font }}
    >
      {event && <div className={styles.event}>{event}</div>}
      <div className={styles.board}>
        <TeamSide team={teamA} font={font} primaryColor={primaryColor} />
        <div className={styles.scores}>
          <span className={`${styles.score} ${flashA ? styles.flash : ''}`}>{teamA.score}</span>
          <span className={styles.separator}>–</span>
          <span className={`${styles.score} ${flashB ? styles.flash : ''}`}>{teamB.score}</span>
        </div>
        <TeamSide team={teamB} font={font} primaryColor={primaryColor} reverse />
      </div>
    </div>
  )
}

export default Scoreboard
