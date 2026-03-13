import styles from './CS2TeamPanel.module.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hexToRgba = (hex, alpha) => {
  const h = (hex ?? '#000000').replace('#', '')
  const r = parseInt(h.length === 3 ? h[0] + h[0] : h.slice(0, 2), 16)
  const g = parseInt(h.length === 3 ? h[1] + h[1] : h.slice(2, 4), 16)
  const b = parseInt(h.length === 3 ? h[2] + h[2] : h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const getHpColor = (hp) => {
  if (hp > 70) return '#5ec96e'
  if (hp > 40) return '#e8943a'
  if (hp > 20) return '#e05c3a'
  return '#c0392b'
}

// ─── Asset icon helpers ────────────────────────────────────────────────────────

const WEAPON_BASE = '/assets/file/images/cs2/weapons'
const ICON_BASE = '/assets/file/images/cs2/icons'

const hideOnError = (e) => { e.currentTarget.style.display = 'none' }

const WeaponIcon = ({ name }) => {
  if (!name) return null
  return (
    <img
      src={`${WEAPON_BASE}/${name}.svg`}
      className={styles.weaponImg}
      alt={name}
      onError={hideOnError}
    />
  )
}

const GrenadeImg = ({ name }) => (
  <img
    src={`${WEAPON_BASE}/${name}.svg`}
    className={styles.grenadeImg}
    alt={name}
    onError={hideOnError}
  />
)

const ArmorIcon = ({ hasHelmet }) => (
  <img
    src={`${ICON_BASE}/${hasHelmet ? 'armor-helmet' : 'armor'}.svg`}
    className={styles.equipImg}
    alt={hasHelmet ? 'armor+helmet' : 'armor'}
    onError={hideOnError}
  />
)

const KitIcon = () => (
  <img src={`${ICON_BASE}/defuse.svg`} className={styles.equipImg} alt="defuse kit" onError={hideOnError} />
)

const DeadIcon = () => (
  <img src={`${ICON_BASE}/dead.svg`} className={styles.deadImg} alt="dead" onError={hideOnError} />
)

// ─── Grenade titles ────────────────────────────────────────────────────────────

const GRENADE_TITLE = {
  smokegrenade: 'Smoke',
  flashbang: 'Flash',
  hegrenade: 'HE',
  molotov: 'Molotov',
  incgrenade: 'Incend.',
  decoy: 'Decoy',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const HpBar = ({ hp, primaryColor, reverse }) => {
  const color = hp <= 0 ? 'rgba(255,255,255,0.1)' : (hp < 30 ? '#c0392b' : primaryColor)
  const width = Math.max(0, Math.min(100, hp))
  return (
    <div className={`${styles.hpBarTrack} ${reverse ? styles.hpBarReverse : ''}`}>
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
        if (!GRENADE_TITLE[g]) return null
        return (
          <span key={g} className={`${styles.grenade} ${styles[g] ?? ''}`} title={GRENADE_TITLE[g]}>
            <GrenadeImg name={g} />
            {count > 1 && <span className={styles.grenadeCount}>×{count}</span>}
          </span>
        )
      })}
    </div>
  )
}

const EquipIcons = ({ armor, hasHelmet, hasDefuseKit, actualTeam }) => {
  if (!armor && !(hasDefuseKit && actualTeam === 'CT')) return null
  return (
    <div className={styles.equip}>
      {hasDefuseKit && actualTeam === 'CT' && (
        <span className={`${styles.equipIcon} ${styles.kit}`} title="Kit de defuse">
          <KitIcon />
        </span>
      )}
      {armor > 0 && (
        <span
          className={`${styles.equipIcon} ${hasHelmet ? styles.helmet : styles.vest}`}
          title={hasHelmet ? 'Capacete + Colete' : 'Colete'}
        >
          <ArmorIcon hasHelmet={hasHelmet} />
        </span>
      )}
    </div>
  )
}

const PlayerRow = ({ player, side, primaryColor }) => {
  const dead = !player.isAlive
  const hpColor = dead ? 'rgba(255,255,255,0.2)' : getHpColor(player.health)
  const weaponKey = player.primary ?? player.secondary
  const isLeft = side === 'ct'
  const slot = player.observerSlot ?? '?'

  const slotEl = <span className={styles.slot}>{slot}</span>
  const nameEl = <span className={styles.name}>{player.name}</span>
  const hpEl = <span className={styles.hpNum} style={{ color: hpColor }}>{dead ? '—' : player.health}</span>
  const deadEl = dead ? <span className={styles.deadWrapper}><DeadIcon /></span> : null
  const kdEl = (
    <span className={styles.kd}>
      <b>{player.kills}</b>
      <span className={styles.kdSep}>/</span>
      <span className={styles.kdDeaths}>{player.deaths}</span>
    </span>
  )
  const weaponEl = !dead ? <WeaponIcon name={weaponKey} /> : null
  const moneyEl = <span className={styles.money}>${(player.money ?? 0).toLocaleString()}</span>
  const grenades = <GrenadeIcons grenades={player.grenades} />
  const equip = (
    <EquipIcons
      armor={player.armor}
      hasHelmet={player.hasHelmet}
      hasDefuseKit={player.hasDefuseKit}
      actualTeam={player.team}
    />
  )

  return (
    <div className={`${styles.playerRow} ${dead ? styles.dead : ''}`}>
      <HpBar hp={dead ? 0 : player.health} primaryColor={primaryColor} reverse={!isLeft} />
      <div className={`${styles.mainLine} ${isLeft ? '' : styles.mainLineRight}`}>
        {isLeft ? (
          <>{slotEl}{dead ? deadEl : hpEl}{nameEl}{weaponEl}{kdEl}</>
        ) : (
          <>{kdEl}{weaponEl}{nameEl}{dead ? deadEl : hpEl}{slotEl}</>
        )}
      </div>
      <div className={`${styles.subLine} ${isLeft ? '' : styles.subLineRight}`}>
        {isLeft ? (
          <>{moneyEl}{grenades}{equip}</>
        ) : (
          <>{equip}{grenades}{moneyEl}</>
        )}
      </div>
    </div>
  )
}

const TeamHeader = ({ players, primaryColor, teamName }) => {
  return (
    <div className={styles.teamHeader}>
      <div
        className={styles.teamNameBand}
        style={{ background: hexToRgba(primaryColor, 0.85) }}
      >
        <span className={styles.teamName}>{teamName}</span>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CS2TeamPanel = ({ players = [], side = 'ct', primaryColor = '#4a9eff', teamName = '' }) => {
  return (
    <div className={`${styles.panel} ${side === 'ct' ? styles.ctPanel : styles.tPanel}`}>
      <TeamHeader players={players} primaryColor={primaryColor} teamName={teamName} />
      <div className={styles.playerList}>
        {players.map((p) => (
          <PlayerRow
            key={p.steamId}
            player={p}
            side={side}
            primaryColor={primaryColor}
          />
        ))}
      </div>
    </div>
  )
}

export default CS2TeamPanel
