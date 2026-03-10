import useCS2GameState from '@shared/useCS2GameState'
import styles from './CS2Scoreboard.module.css'

const CT_COLOR = '#5b8dd9'
const T_COLOR  = '#e8943a'

const WEAPON_DISPLAY = {
  ak47: 'AK-47', m4a1: 'M4A1', m4a1_silencer: 'M4A1-S', awp: 'AWP',
  deagle: 'Deagle', usp_silencer: 'USP-S', glock: 'Glock', p2000: 'P2000',
  famas: 'FAMAS', galil: 'Galil', aug: 'AUG', sg556: 'SG 553',
  scar20: 'SCAR-20', g3sg1: 'G3SG1', ssg08: 'SSG 08',
  mp9: 'MP9', mac10: 'MAC-10', mp7: 'MP7', ump45: 'UMP-45',
  p90: 'P90', bizon: 'PP-Bizon', mp5sd: 'MP5-SD',
  nova: 'Nova', xm1014: 'XM1014', mag7: 'MAG-7', sawedoff: 'Sawed-Off',
  m249: 'M249', negev: 'Negev',
  p250: 'P250', fiveseven: 'Five-SeveN', tec9: 'Tec-9',
  cz75a: 'CZ75', revolver: 'R8', elite: 'Duals',
}

const GRENADE_INFO = {
  smokegrenade: { label: 'SM',  cls: 'smoke' },
  flashbang:    { label: 'FL',  cls: 'flash' },
  hegrenade:    { label: 'HE',  cls: 'he'    },
  molotov:      { label: 'INC', cls: 'inc'   },
  incgrenade:   { label: 'INC', cls: 'inc'   },
  decoy:        { label: 'DC',  cls: 'decoy' },
}

const PHASE_LABELS = {
  freezetime:   'FREEZE TIME',
  live:         'LIVE',
  bomb:         'BOMBA',
  defuse:       'DEFUSANDO',
  warmup:       'WARMUP',
  intermission: 'INTERVALO',
  gameover:     'FIM DE JOGO',
}

const formatTimer = (remaining) => {
  if (remaining == null) return '--:--'
  const total = Math.max(0, Math.ceil(remaining))
  const mins = Math.floor(total / 60).toString().padStart(2, '0')
  const secs = (total % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

const getWeaponDisplay = (w) =>
  w ? (WEAPON_DISPLAY[w] ?? w.replace(/_/g, ' ').toUpperCase()) : null

const getHpColor = (hp) => {
  if (hp > 70) return '#5ec96e'
  if (hp > 40) return '#e8943a'
  if (hp > 20) return '#e05c3a'
  return '#c0392b'
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const TeamLogo = ({ logo, name }) => {
  const url = logo ? `/assets/file/images/${logo}` : null
  const initials = name ? name.slice(0, 3).toUpperCase() : '???'
  return (
    <div className={styles.logoBox}>
      {url && (
        <img
          src={url}
          alt={name}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextSibling.style.display = 'flex'
            console.warn('[CS2Scoreboard] logo não encontrado:', logo)
          }}
        />
      )}
      <span className={styles.logoInitials} style={{ display: url ? 'none' : 'flex' }}>
        {initials}
      </span>
    </div>
  )
}

const Grenades = ({ grenades }) => {
  if (!grenades?.length) return null
  const counts = {}
  grenades.forEach((g) => { counts[g] = (counts[g] ?? 0) + 1 })
  return (
    <div className={styles.grenades}>
      {Object.entries(counts).map(([g, count]) => {
        const info = GRENADE_INFO[g]
        if (!info) return null
        return (
          <span key={g} className={`${styles.grenade} ${styles[info.cls]}`}>
            {info.label}{count > 1 ? `×${count}` : ''}
          </span>
        )
      })}
    </div>
  )
}

const Equip = ({ armor, hasHelmet, hasDefuseKit, side }) => (
  <div className={styles.equip}>
    {hasDefuseKit && side === 'CT' && (
      <span className={`${styles.equipIcon} ${styles.kit}`}>KIT</span>
    )}
    {armor > 0 && (
      <span className={`${styles.equipIcon} ${hasHelmet ? styles.helmet : styles.vest}`}>
        {hasHelmet ? 'HEL' : 'VES'}
      </span>
    )}
  </div>
)

const PlayerRow = ({ player, side }) => {
  const dead = !player.isAlive
  const teamColor = side === 'CT' ? CT_COLOR : T_COLOR
  const weapon = getWeaponDisplay(player.primary ?? player.secondary)
  const hpColor = dead ? 'rgba(255,255,255,0.2)' : getHpColor(player.health)

  const dot   = <span className={styles.dot} style={{ background: dead ? 'rgba(255,255,255,0.15)' : teamColor }} />
  const name  = <span className={styles.name}>{player.name}</span>
  const hp    = <span className={styles.hp} style={{ color: hpColor }}>{dead ? '0' : player.health}</span>
  const kda   = (
    <span className={styles.kda}>
      <b>{player.kills}</b>
      <span className={styles.sep}>/</span>
      <span className={styles.deaths}>{player.deaths}</span>
      <span className={styles.sep}>/</span>
      <span className={styles.assists}>{player.assists}</span>
    </span>
  )
  const money   = <span className={styles.money}>${(player.money ?? 0).toLocaleString()}</span>
  const wpn     = weapon ? <span className={styles.weapon}>{weapon}</span> : null
  const nades   = <Grenades grenades={player.grenades} />
  const equip   = <Equip armor={player.armor} hasHelmet={player.hasHelmet} hasDefuseKit={player.hasDefuseKit} side={side} />

  return (
    <div className={`${styles.row} ${dead ? styles.dead : ''} ${side === 'CT' ? styles.ctRow : styles.tRow}`}>
      {side === 'CT' ? (
        <>
          <div className={styles.main}>{dot}{hp}{name}{kda}</div>
          <div className={styles.detail}>{wpn}{nades}{money}{equip}</div>
        </>
      ) : (
        <>
          <div className={styles.main}>{kda}{name}{hp}{dot}</div>
          <div className={styles.detail}>{equip}{money}{nades}{wpn}</div>
        </>
      )}
    </div>
  )
}

const ScoreHeader = ({ gameState, teamCTName, teamTName, teamCTLogo, teamTLogo }) => {
  const { match, timer } = gameState
  const phase      = timer?.phase ?? match?.phase
  const phaseLabel = PHASE_LABELS[phase] ?? ''

  return (
    <div className={styles.header}>
      <div className={styles.headerCT}>
        <TeamLogo logo={teamCTLogo} name={teamCTName} />
        <span className={styles.teamName} style={{ color: CT_COLOR }}>{teamCTName}</span>
        <span className={styles.score} style={{ color: CT_COLOR }}>{match.ctScore}</span>
      </div>

      <div className={styles.headerCenter}>
        <span className={styles.timer}>{formatTimer(timer?.remaining)}</span>
        {phaseLabel && <span className={styles.phase}>{phaseLabel}</span>}
        <span className={styles.roundNum}>ROUND {match.roundNumber}</span>
      </div>

      <div className={styles.headerT}>
        <span className={styles.score} style={{ color: T_COLOR }}>{match.tScore}</span>
        <span className={styles.teamName} style={{ color: T_COLOR }}>{teamTName}</span>
        <TeamLogo logo={teamTLogo} name={teamTName} />
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

const CS2Scoreboard = ({ state }) => {
  const visible      = state?.visible      ?? false
  const primaryColor = state?.primaryColor ?? '#f0b429'
  const font         = state?.font         ?? 'Inter'
  const teamCTName   = state?.teamCTName   ?? 'CT'
  const teamTName    = state?.teamTName    ?? 'T'
  const teamCTLogo   = state?.teamCTLogo   ?? null
  const teamTLogo    = state?.teamTLogo    ?? null

  const { gameState } = useCS2GameState()

  const ctPlayers = (gameState?.players?.filter((p) => p.team === 'CT') ?? [])
    .sort((a, b) => b.kills - a.kills || a.deaths - b.deaths)
  const tPlayers = (gameState?.players?.filter((p) => p.team === 'T') ?? [])
    .sort((a, b) => b.kills - a.kills || a.deaths - b.deaths)

  return (
    <div
      className={`${styles.container} ${visible ? styles.isVisible : styles.isHidden}`}
      style={{ '--accent': primaryColor, '--font': font }}
    >
      {!gameState ? (
        <div className={styles.waiting}>Aguardando CS2...</div>
      ) : (
        <>
          <ScoreHeader
            gameState={gameState}
            teamCTName={teamCTName}
            teamTName={teamTName}
            teamCTLogo={teamCTLogo}
            teamTLogo={teamTLogo}
          />
          <div className={styles.players}>
            <div className={styles.ctCol}>
              {ctPlayers.map((p) => <PlayerRow key={p.steamId} player={p} side="CT" />)}
            </div>
            <div className={styles.tCol}>
              {tPlayers.map((p) => <PlayerRow key={p.steamId} player={p} side="T" />)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CS2Scoreboard
