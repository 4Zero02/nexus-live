import styles from './CS2TeamPanel.module.css'

// ─── Weapon categories ────────────────────────────────────────────────────────

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

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconRifle = () => (
  <svg width="20" height="11" viewBox="0 0 20 11" fill="currentColor" aria-hidden="true">
    <rect x="0"  y="4"   width="2.5" height="4"   rx="0.8"/>
    <rect x="1.5" y="3"  width="11"  height="5"   rx="1.2"/>
    <rect x="11"  y="3.8" width="8.5" height="2.2" rx="0.8"/>
    <rect x="7"   y="7.5" width="3"   height="3.5" rx="0.8"/>
  </svg>
)

const IconSniper = () => (
  <svg width="26" height="11" viewBox="0 0 26 11" fill="currentColor" aria-hidden="true">
    <rect x="0"   y="4.5" width="2"   height="4"   rx="0.8"/>
    <rect x="1.5" y="3.5" width="9"   height="4"   rx="1.2"/>
    <rect x="9.5" y="4"   width="16"  height="2.2" rx="0.8"/>
    <rect x="4"   y="0"   width="5"   height="3.8" rx="0.8"/>
    <rect x="5"   y="0.5" width="3"   height="1"   rx="0.4" fill="rgba(150,200,255,0.6)"/>
  </svg>
)

const IconPistol = () => (
  <svg width="15" height="13" viewBox="0 0 15 13" fill="currentColor" aria-hidden="true">
    <rect x="1"   y="0.5" width="11"  height="4.5" rx="1.2"/>
    <rect x="11"  y="1.5" width="4"   height="2.5" rx="0.6"/>
    <rect x="1"   y="4.5" width="7"   height="2.5" rx="0.5"/>
    <rect x="1.5" y="6.5" width="4.5" height="6"   rx="0.8"/>
  </svg>
)

const IconSmg = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
    <rect x="0"   y="2.5" width="11"  height="5.5" rx="1.2"/>
    <rect x="10"  y="3.5" width="8"   height="2.2" rx="0.8"/>
    <rect x="4.5" y="7.5" width="3"   height="4.5" rx="0.8"/>
  </svg>
)

const IconShotgun = () => (
  <svg width="20" height="11" viewBox="0 0 20 11" fill="currentColor" aria-hidden="true">
    <rect x="0"   y="3.5" width="2.5" height="4"   rx="0.8"/>
    <rect x="1.5" y="2"   width="9"   height="7"   rx="1.2"/>
    <rect x="9.5" y="3"   width="10"  height="5"   rx="0.8"/>
    <rect x="9.5" y="5.2" width="10"  height="0.6" rx="0" fill="rgba(0,0,0,0.3)"/>
  </svg>
)

const IconLmg = () => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="currentColor" aria-hidden="true">
    <rect x="0"   y="3"  width="2.5" height="5"   rx="0.8"/>
    <rect x="1.5" y="2"  width="12"  height="6"   rx="1.2"/>
    <rect x="12"  y="3"  width="10"  height="2.5" rx="0.8"/>
    <circle cx="8.5" cy="11" r="3.5"/>
    <circle cx="8.5" cy="11" r="1.5" fill="rgba(0,0,0,0.4)"/>
  </svg>
)

const IconSkull = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true">
    <path d="M6.5,1 C3.5,1 1,3.2 1,6 C1,7.8 2,9.4 3.5,10.2 L3.5,12 L9.5,12 L9.5,10.2 C11,9.4 12,7.8 12,6 C12,3.2 9.5,1 6.5,1 Z"/>
    <circle cx="4.5" cy="6.5" r="1.2" fill="rgba(0,0,0,0.6)"/>
    <circle cx="8.5" cy="6.5" r="1.2" fill="rgba(0,0,0,0.6)"/>
  </svg>
)

const IconGrenade = () => (
  <svg width="9" height="12" viewBox="0 0 9 12" fill="currentColor" aria-hidden="true">
    <circle cx="4.5" cy="8" r="3.8"/>
    <rect x="3.5" y="2.5" width="2"   height="3.5" rx="0.5"/>
    <rect x="2.5" y="0.5" width="4"   height="2"   rx="0.5"/>
  </svg>
)

const IconVest = () => (
  <svg width="10" height="13" viewBox="0 0 10 13" fill="currentColor" aria-hidden="true">
    <path d="M5,0 L9.5,2.5 L9.5,8 C9.5,11 7.5,12.5 5,13 C2.5,12.5 0.5,11 0.5,8 L0.5,2.5 Z"/>
  </svg>
)

const IconHelmet = () => (
  <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor" aria-hidden="true">
    <path d="M6.5,0.5 C3,0.5 0.5,2.8 0.5,5.5 L0.5,7.5 L12.5,7.5 L12.5,5.5 C12.5,2.8 10,0.5 6.5,0.5 Z"/>
    <rect x="0" y="7" width="13" height="2.5" rx="0.6"/>
    <rect x="0" y="7" width="2.5" height="4"   rx="0.6"/>
    <rect x="10.5" y="7" width="2.5" height="4" rx="0.6"/>
  </svg>
)

const IconKit = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    <path d="M9.5,0.5 C8,0.5 7,2 7.5,3.2 L1.5,9.2 C1,9.7 1,10.5 1.5,11 C2,11.5 2.8,11.5 3.2,11 L9.2,5 C10.4,5.5 12,4.5 12,3 C12,1.5 10.8,0.5 9.5,0.5 Z M9.5,3.5 C8.9,3.5 8.5,3 8.5,2.5 C8.5,2 8.9,1.5 9.5,1.5 C10.1,1.5 10.5,2 10.5,2.5 C10.5,3 10.1,3.5 9.5,3.5 Z"/>
    <rect x="0" y="5.2" width="6"   height="1.2" rx="0.5" transform="rotate(-45, 3, 5.8)"/>
    <rect x="5" y="0.2" width="6"   height="1.2" rx="0.5" transform="rotate(-45, 8, 0.8)"/>
  </svg>
)

const WeaponIcons = {
  rifle:   <IconRifle />,
  sniper:  <IconSniper />,
  pistol:  <IconPistol />,
  smg:     <IconSmg />,
  shotgun: <IconShotgun />,
  lmg:     <IconLmg />,
}

const GRENADE_INFO = {
  smokegrenade: { title: 'Smoke', cls: 'smoke' },
  flashbang:    { title: 'Flash', cls: 'flash' },
  hegrenade:    { title: 'HE',    cls: 'he'    },
  molotov:      { title: 'Molotov', cls: 'inc' },
  incgrenade:   { title: 'Incend.', cls: 'inc' },
  decoy:        { title: 'Decoy', cls: 'decoy' },
}

const getHpColor = (hp) => {
  if (hp > 70) return '#5ec96e'
  if (hp > 40) return '#e8943a'
  if (hp > 20) return '#e05c3a'
  return '#c0392b'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const HpBar = ({ hp, primaryColor }) => {
  const color = hp <= 0 ? 'rgba(255,255,255,0.1)' : (hp < 30 ? '#c0392b' : primaryColor)
  const width = Math.max(0, Math.min(100, hp))
  return (
    <div className={styles.hpBarTrack}>
      <div
        className={styles.hpBarFill}
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  )
}

const GrenadeIcons = ({ grenades }) => {
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

const EquipIcons = ({ armor, hasHelmet, hasDefuseKit, side }) => (
  <div className={styles.equip}>
    {hasDefuseKit && side === 'ct' && (
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

const PlayerRow = ({ player, side, primaryColor, index }) => {
  const dead       = !player.isAlive
  const hpColor    = dead ? 'rgba(255,255,255,0.2)' : getHpColor(player.health)
  const weaponKey  = player.primary ?? player.secondary
  const weaponCat  = getWeaponCategory(weaponKey)
  const weaponIcon = weaponCat ? WeaponIcons[weaponCat] : null
  const isCT       = side === 'ct'

  const slotNum  = <span className={styles.slot}>{index + 1}</span>
  const name     = <span className={styles.name}>{player.name}</span>
  const hpNum    = <span className={styles.hpNum} style={{ color: hpColor }}>{dead ? '—' : player.health}</span>
  const skull    = dead ? <span className={styles.skull}><IconSkull /></span> : null
  const kd       = (
    <span className={styles.kd}>
      <b>{player.kills}</b>
      <span className={styles.kdSep}>/</span>
      <span className={styles.kdDeaths}>{player.deaths}</span>
    </span>
  )
  const money    = <span className={styles.money}>${(player.money ?? 0).toLocaleString()}</span>
  const wpn      = weaponIcon
    ? <span className={`${styles.weapon} ${styles[`wpn_${weaponCat}`]}`} title={weaponKey}>{weaponIcon}</span>
    : null
  const grenades = <GrenadeIcons grenades={player.grenades} />
  const equip    = <EquipIcons armor={player.armor} hasHelmet={player.hasHelmet} hasDefuseKit={player.hasDefuseKit} side={side} />

  return (
    <div className={`${styles.playerRow} ${dead ? styles.dead : ''} ${isCT ? styles.ctRow : styles.tRow}`}>
      <HpBar hp={dead ? 0 : player.health} primaryColor={primaryColor} />
      <div className={styles.mainLine}>
        {isCT ? (
          <>
            {slotNum}{hpNum}{dead ? skull : null}{name}{kd}
          </>
        ) : (
          <>
            {kd}{name}{dead ? skull : null}{hpNum}{slotNum}
          </>
        )}
      </div>
      <div className={`${styles.subLine} ${isCT ? '' : styles.subLineRight}`}>
        {isCT ? (
          <>{money}{grenades}{equip}</>
        ) : (
          <>{equip}{grenades}{money}</>
        )}
      </div>
    </div>
  )
}

const TeamHeader = ({ players, side, primaryColor, teamName }) => {
  const totalKills  = players.reduce((s, p) => s + (p.kills ?? 0), 0)
  const totalDeaths = players.reduce((s, p) => s + (p.deaths ?? 0), 0)
  const totalDmg    = players.reduce((s, p) => s + (p.roundDamage ?? 0), 0)
  const isCT = side === 'ct'

  return (
    <div
      className={`${styles.teamHeader} ${isCT ? styles.teamHeaderCT : styles.teamHeaderT}`}
      style={{ borderColor: primaryColor }}
    >
      <span className={styles.teamHeaderName} style={{ color: primaryColor }}>{teamName}</span>
      <div className={styles.teamHeaderStats}>
        <span className={styles.teamStat}>{totalKills}K</span>
        <span className={styles.teamStatSep}>/</span>
        <span className={styles.teamStat}>{totalDeaths}D</span>
        <span className={styles.teamStatSep}>·</span>
        <span className={styles.teamStat}>{totalDmg} DMG</span>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CS2TeamPanel = ({ players = [], side = 'ct', primaryColor = '#4a9eff', teamName = '' }) => {
  return (
    <div className={`${styles.panel} ${side === 'ct' ? styles.ctPanel : styles.tPanel}`}>
      <TeamHeader players={players} side={side} primaryColor={primaryColor} teamName={teamName} />
      <div className={styles.playerList}>
        {players.map((p, i) => (
          <PlayerRow
            key={p.steamId}
            player={p}
            side={side}
            primaryColor={primaryColor}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}

export default CS2TeamPanel
