import useCS2GameState from '@shared/useCS2GameState'
import styles from './CS2Scoreboard.module.css'

const CT_COLOR = '#5b8dd9'
const T_COLOR  = '#e8943a'

// ─── Categorização de armas ───────────────────────────────────────────────────

const SNIPER_NAMES  = new Set(['awp', 'ssg08', 'scar20', 'g3sg1'])
const SMG_NAMES     = new Set(['mp9', 'mac10', 'mp7', 'ump45', 'p90', 'bizon', 'mp5sd'])
const SHOTGUN_NAMES = new Set(['nova', 'xm1014', 'mag7', 'sawedoff'])
const LMG_NAMES     = new Set(['m249', 'negev'])
const PISTOL_NAMES  = new Set(['glock', 'usp_silencer', 'p2000', 'p250', 'deagle', 'fiveseven', 'tec9', 'cz75a', 'revolver', 'elite'])

const getWeaponCategory = (w) => {
  if (!w) return null
  if (SNIPER_NAMES.has(w))  return 'sniper'
  if (SMG_NAMES.has(w))     return 'smg'
  if (SHOTGUN_NAMES.has(w)) return 'shotgun'
  if (LMG_NAMES.has(w))     return 'lmg'
  if (PISTOL_NAMES.has(w))  return 'pistol'
  return 'rifle'
}

// ─── Ícones SVG de armas ──────────────────────────────────────────────────────

const IconRifle = () => (
  <svg width="20" height="11" viewBox="0 0 20 11" fill="currentColor" aria-hidden="true">
    {/* coronha */}
    <rect x="0"  y="4"   width="2.5" height="4"   rx="0.8"/>
    {/* corpo */}
    <rect x="1.5" y="3"  width="11"  height="5"   rx="1.2"/>
    {/* cano */}
    <rect x="11"  y="3.8" width="8.5" height="2.2" rx="0.8"/>
    {/* carregador */}
    <rect x="7"   y="7.5" width="3"   height="3.5" rx="0.8"/>
  </svg>
)

const IconSniper = () => (
  <svg width="26" height="11" viewBox="0 0 26 11" fill="currentColor" aria-hidden="true">
    {/* coronha */}
    <rect x="0"   y="4.5" width="2"   height="4"   rx="0.8"/>
    {/* corpo */}
    <rect x="1.5" y="3.5" width="9"   height="4"   rx="1.2"/>
    {/* cano longo */}
    <rect x="9.5" y="4"   width="16"  height="2.2" rx="0.8"/>
    {/* mira telescópica */}
    <rect x="4"   y="0"   width="5"   height="3.8" rx="0.8"/>
    {/* lente da mira */}
    <rect x="5"   y="0.5" width="3"   height="1"   rx="0.4" fill="rgba(150,200,255,0.6)"/>
  </svg>
)

const IconPistol = () => (
  <svg width="15" height="13" viewBox="0 0 15 13" fill="currentColor" aria-hidden="true">
    {/* slide/topo */}
    <rect x="1"   y="0.5" width="11"  height="4.5" rx="1.2"/>
    {/* boca do cano */}
    <rect x="11"  y="1.5" width="4"   height="2.5" rx="0.6"/>
    {/* armação */}
    <rect x="1"   y="4.5" width="7"   height="2.5" rx="0.5"/>
    {/* coronha/grip */}
    <rect x="1.5" y="6.5" width="4.5" height="6"   rx="0.8"/>
  </svg>
)

const IconSmg = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
    {/* corpo compacto */}
    <rect x="0"   y="2.5" width="11"  height="5.5" rx="1.2"/>
    {/* cano */}
    <rect x="10"  y="3.5" width="8"   height="2.2" rx="0.8"/>
    {/* carregador caixa */}
    <rect x="4.5" y="7.5" width="3"   height="4.5" rx="0.8"/>
  </svg>
)

const IconShotgun = () => (
  <svg width="20" height="11" viewBox="0 0 20 11" fill="currentColor" aria-hidden="true">
    {/* coronha */}
    <rect x="0"   y="3.5" width="2.5" height="4"   rx="0.8"/>
    {/* corpo (mais alto) */}
    <rect x="1.5" y="2"   width="9"   height="7"   rx="1.2"/>
    {/* cano duplo / grosso */}
    <rect x="9.5" y="3"   width="10"  height="5"   rx="0.8"/>
    {/* separador canos */}
    <rect x="9.5" y="5.2" width="10"  height="0.6" rx="0" fill="rgba(0,0,0,0.3)"/>
  </svg>
)

const IconLmg = () => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="currentColor" aria-hidden="true">
    {/* coronha */}
    <rect x="0"   y="3"  width="2.5" height="5"   rx="0.8"/>
    {/* corpo */}
    <rect x="1.5" y="2"  width="12"  height="6"   rx="1.2"/>
    {/* cano */}
    <rect x="12"  y="3"  width="10"  height="2.5" rx="0.8"/>
    {/* tambor (carregador circular) */}
    <circle cx="8.5" cy="11" r="3.5"/>
    <circle cx="8.5" cy="11" r="1.5" fill="rgba(0,0,0,0.4)"/>
  </svg>
)

const WeaponIcons = { rifle: <IconRifle />, sniper: <IconSniper />, pistol: <IconPistol />, smg: <IconSmg />, shotgun: <IconShotgun />, lmg: <IconLmg /> }

// ─── Ícones SVG de utilitárias ────────────────────────────────────────────────

const IconGrenade = () => (
  <svg width="9" height="12" viewBox="0 0 9 12" fill="currentColor" aria-hidden="true">
    {/* corpo */}
    <circle cx="4.5" cy="8" r="3.8"/>
    {/* alavanca (spoon) */}
    <rect x="3.5" y="2.5" width="2"   height="3.5" rx="0.5"/>
    {/* pino */}
    <rect x="2.5" y="0.5" width="4"   height="2"   rx="0.5"/>
  </svg>
)

const GRENADE_INFO = {
  smokegrenade: { title: 'Smoke',    cls: 'smoke' },
  flashbang:    { title: 'Flash',    cls: 'flash' },
  hegrenade:    { title: 'HE',       cls: 'he'    },
  molotov:      { title: 'Molotov',  cls: 'inc'   },
  incgrenade:   { title: 'Incend.',  cls: 'inc'   },
  decoy:        { title: 'Decoy',    cls: 'decoy' },
}

// ─── Ícones SVG de equipamento ────────────────────────────────────────────────

const IconVest = () => (
  <svg width="10" height="13" viewBox="0 0 10 13" fill="currentColor" aria-hidden="true">
    <path d="M5,0 L9.5,2.5 L9.5,8 C9.5,11 7.5,12.5 5,13 C2.5,12.5 0.5,11 0.5,8 L0.5,2.5 Z"/>
  </svg>
)

const IconHelmet = () => (
  <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor" aria-hidden="true">
    {/* cúpula */}
    <path d="M6.5,0.5 C3,0.5 0.5,2.8 0.5,5.5 L0.5,7.5 L12.5,7.5 L12.5,5.5 C12.5,2.8 10,0.5 6.5,0.5 Z"/>
    {/* aba */}
    <rect x="0" y="7" width="13" height="2.5" rx="0.6"/>
    {/* protetor lateral */}
    <rect x="0" y="7" width="2.5" height="4"   rx="0.6"/>
    <rect x="10.5" y="7" width="2.5" height="4" rx="0.6"/>
  </svg>
)

const IconKit = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    {/* alicate / ferramenta de defuse */}
    <path d="M9.5,0.5 C8,0.5 7,2 7.5,3.2 L1.5,9.2 C1,9.7 1,10.5 1.5,11 C2,11.5 2.8,11.5 3.2,11 L9.2,5 C10.4,5.5 12,4.5 12,3 C12,1.5 10.8,0.5 9.5,0.5 Z M9.5,3.5 C8.9,3.5 8.5,3 8.5,2.5 C8.5,2 8.9,1.5 9.5,1.5 C10.1,1.5 10.5,2 10.5,2.5 C10.5,3 10.1,3.5 9.5,3.5 Z"/>
    {/* arame cortado */}
    <rect x="0" y="5.2" width="6"   height="1.2" rx="0.5" transform="rotate(-45, 3, 5.8)"/>
    <rect x="5" y="0.2" width="6"   height="1.2" rx="0.5" transform="rotate(-45, 8, 0.8)"/>
  </svg>
)

// ─── Fases e timer ────────────────────────────────────────────────────────────

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
          <span key={g} className={`${styles.grenade} ${styles[info.cls]}`} title={info.title}>
            <IconGrenade />
            {count > 1 && <span className={styles.grenadeCount}>×{count}</span>}
          </span>
        )
      })}
    </div>
  )
}

const Equip = ({ armor, hasHelmet, hasDefuseKit, side }) => (
  <div className={styles.equip}>
    {hasDefuseKit && side === 'CT' && (
      <span className={`${styles.equipIcon} ${styles.kit}`} title="Kit de defuse">
        <IconKit />
      </span>
    )}
    {armor > 0 && (
      <span
        className={`${styles.equipIcon} ${hasHelmet ? styles.helmet : styles.vest}`}
        title={hasHelmet ? 'Capacete + Colete' : 'Colete'}
      >
        {hasHelmet ? <IconHelmet /> : <IconVest />}
      </span>
    )}
  </div>
)

const PlayerRow = ({ player, side }) => {
  const dead      = !player.isAlive
  const teamColor = side === 'CT' ? CT_COLOR : T_COLOR
  const hpColor   = dead ? 'rgba(255,255,255,0.2)' : getHpColor(player.health)

  const weaponKey      = player.primary ?? player.secondary
  const weaponCategory = getWeaponCategory(weaponKey)
  const weaponIcon     = weaponCategory ? WeaponIcons[weaponCategory] : null

  const dot  = <span className={styles.dot} style={{ background: dead ? 'rgba(255,255,255,0.15)' : teamColor }} />
  const name = <span className={styles.name}>{player.name}</span>
  const hp   = <span className={styles.hp} style={{ color: hpColor }}>{dead ? '0' : player.health}</span>
  const kda  = (
    <span className={styles.kda}>
      <b>{player.kills}</b>
      <span className={styles.sep}>/</span>
      <span className={styles.deaths}>{player.deaths}</span>
      <span className={styles.sep}>/</span>
      <span className={styles.assists}>{player.assists}</span>
    </span>
  )
  const money = <span className={styles.money}>${(player.money ?? 0).toLocaleString()}</span>
  const wpn   = weaponIcon
    ? <span className={`${styles.weapon} ${styles[`wpn_${weaponCategory}`]}`} title={weaponKey}>{weaponIcon}</span>
    : null
  const nades = <Grenades grenades={player.grenades} />
  const equip = <Equip armor={player.armor} hasHelmet={player.hasHelmet} hasDefuseKit={player.hasDefuseKit} side={side} />

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
