import styles from './CS2ObservedPlayer.module.css'

const IconHeart = () => (
  <svg width="13" height="12" viewBox="0 0 13 12" fill="currentColor" aria-hidden="true">
    <path d="M6.5,10.5 C6.5,10.5 1,7 1,3.5 C1,2 2.2,1 3.5,1 C4.5,1 5.5,1.6 6.5,2.8 C7.5,1.6 8.5,1 9.5,1 C10.8,1 12,2 12,3.5 C12,7 6.5,10.5 6.5,10.5 Z"/>
  </svg>
)

const IconShield = () => (
  <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor" aria-hidden="true">
    <path d="M5.5,0.5 L10,2.5 L10,7 C10,10 7.8,12 5.5,12.5 C3.2,12 1,10 1,7 L1,2.5 Z"/>
  </svg>
)

const IconHelmet = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor" aria-hidden="true">
    <path d="M7,0.5 C3.4,0.5 0.5,3 0.5,6 L0.5,8 L13.5,8 L13.5,6 C13.5,3 10.6,0.5 7,0.5 Z"/>
    <rect x="0" y="7.5" width="14" height="2.5" rx="0.6"/>
    <rect x="0" y="7.5" width="2.5" height="4"  rx="0.6"/>
    <rect x="11.5" y="7.5" width="2.5" height="4" rx="0.6"/>
  </svg>
)

const IconBullet = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor" aria-hidden="true">
    <path d="M4,0.5 C2.2,0.5 1,2 1,4 L1,11 L7,11 L7,4 C7,2 5.8,0.5 4,0.5 Z"/>
  </svg>
)

const getHpColor = (hp) => {
  if (hp > 70) return '#5ec96e'
  if (hp > 40) return '#e8943a'
  if (hp > 20) return '#e05c3a'
  return '#c0392b'
}

const CS2ObservedPlayer = ({ player, ctColor = '#4a9eff', tColor = '#f5a623' }) => {
  if (!player) return null

  const hp       = player.health ?? 0
  const armor    = player.armor ?? 0
  const hpColor  = hp < 30 ? '#e53e3e' : getHpColor(hp)
  const teamColor = player.team === 'CT' ? ctColor : player.team === 'T' ? tColor : 'rgba(255,255,255,0.7)'

  const ammoClip    = player.ammoClip
  const ammoReserve = player.ammoReserve
  const hasAmmo     = ammoClip !== null && ammoReserve !== null

  return (
    <div className={styles.container}>
      {/* Linha principal */}
      <div className={styles.mainRow}>
        {/* HP */}
        <div className={styles.hpBlock}>
          <span className={styles.hpIcon} style={{ color: hpColor }}>
            <IconHeart />
          </span>
          <span className={styles.hpValue} style={{ color: hpColor }}>{hp}</span>
          <div className={styles.hpBarTrack}>
            <div
              className={styles.hpBarFill}
              style={{ width: `${Math.max(0, Math.min(100, hp))}%`, background: hpColor }}
            />
          </div>
        </div>

        {/* Armor */}
        <div className={styles.armorBlock}>
          <span className={styles.armorIcon}>
            {player.hasHelmet ? <IconHelmet /> : <IconShield />}
          </span>
          <span className={styles.armorValue}>{armor}</span>
        </div>

        {/* Nome */}
        <span className={styles.playerName} style={{ color: teamColor }}>
          {player.name}
        </span>

        {/* Ammo */}
        {hasAmmo && (
          <div className={styles.ammoBlock}>
            <IconBullet />
            <span className={styles.ammoClip}>{ammoClip}</span>
            <span className={styles.ammoSep}>/</span>
            <span className={styles.ammoReserve}>{ammoReserve}</span>
          </div>
        )}
      </div>

      {/* Sub-linha: K / D / A / Dano */}
      <div className={styles.statsRow}>
        <span className={styles.statItem}>
          <span className={styles.statLabel}>K</span>
          <span className={styles.statValue}>{player.kills ?? 0}</span>
        </span>
        <span className={styles.statSep}>/</span>
        <span className={styles.statItem}>
          <span className={styles.statLabel}>D</span>
          <span className={styles.statValue}>{player.deaths ?? 0}</span>
        </span>
        <span className={styles.statSep}>/</span>
        <span className={styles.statItem}>
          <span className={styles.statLabel}>A</span>
          <span className={styles.statValue}>{player.assists ?? 0}</span>
        </span>
        <span className={styles.statSep}>·</span>
        <span className={styles.statItem}>
          <span className={styles.statLabel}>DMG</span>
          <span className={styles.statValue}>{player.roundDamage ?? 0}</span>
        </span>
      </div>
    </div>
  )
}

export default CS2ObservedPlayer
