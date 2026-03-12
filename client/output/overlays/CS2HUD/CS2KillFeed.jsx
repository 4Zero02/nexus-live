import { useState, useEffect, useRef } from 'react'
import styles from './CS2KillFeed.module.css'

const MAX_VISIBLE = 5
const KILL_LIFETIME_MS = 8000

// Weapon icons inline (same set as CS2TeamPanel)
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

const IconRifle = () => (
  <svg width="18" height="10" viewBox="0 0 20 11" fill="currentColor" aria-hidden="true">
    <rect x="0"  y="4"   width="2.5" height="4"   rx="0.8"/>
    <rect x="1.5" y="3"  width="11"  height="5"   rx="1.2"/>
    <rect x="11"  y="3.8" width="8.5" height="2.2" rx="0.8"/>
    <rect x="7"   y="7.5" width="3"   height="3.5" rx="0.8"/>
  </svg>
)
const IconSniper = () => (
  <svg width="24" height="10" viewBox="0 0 26 11" fill="currentColor" aria-hidden="true">
    <rect x="0"   y="4.5" width="2"   height="4"   rx="0.8"/>
    <rect x="1.5" y="3.5" width="9"   height="4"   rx="1.2"/>
    <rect x="9.5" y="4"   width="16"  height="2.2" rx="0.8"/>
    <rect x="4"   y="0"   width="5"   height="3.8" rx="0.8"/>
    <rect x="5"   y="0.5" width="3"   height="1"   rx="0.4" fill="rgba(150,200,255,0.6)"/>
  </svg>
)
const IconPistol = () => (
  <svg width="13" height="11" viewBox="0 0 15 13" fill="currentColor" aria-hidden="true">
    <rect x="1"   y="0.5" width="11"  height="4.5" rx="1.2"/>
    <rect x="11"  y="1.5" width="4"   height="2.5" rx="0.6"/>
    <rect x="1"   y="4.5" width="7"   height="2.5" rx="0.5"/>
    <rect x="1.5" y="6.5" width="4.5" height="6"   rx="0.8"/>
  </svg>
)
const IconSmg = () => (
  <svg width="16" height="10" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
    <rect x="0"   y="2.5" width="11"  height="5.5" rx="1.2"/>
    <rect x="10"  y="3.5" width="8"   height="2.2" rx="0.8"/>
    <rect x="4.5" y="7.5" width="3"   height="4.5" rx="0.8"/>
  </svg>
)
const IconShotgun = () => (
  <svg width="18" height="10" viewBox="0 0 20 11" fill="currentColor" aria-hidden="true">
    <rect x="0"   y="3.5" width="2.5" height="4"   rx="0.8"/>
    <rect x="1.5" y="2"   width="9"   height="7"   rx="1.2"/>
    <rect x="9.5" y="3"   width="10"  height="5"   rx="0.8"/>
    <rect x="9.5" y="5.2" width="10"  height="0.6" rx="0" fill="rgba(0,0,0,0.3)"/>
  </svg>
)
const IconLmg = () => (
  <svg width="20" height="12" viewBox="0 0 22 14" fill="currentColor" aria-hidden="true">
    <rect x="0"   y="3"  width="2.5" height="5"   rx="0.8"/>
    <rect x="1.5" y="2"  width="12"  height="6"   rx="1.2"/>
    <rect x="12"  y="3"  width="10"  height="2.5" rx="0.8"/>
    <circle cx="8.5" cy="11" r="3.5"/>
    <circle cx="8.5" cy="11" r="1.5" fill="rgba(0,0,0,0.4)"/>
  </svg>
)

const IconHeadshot = () => (
  <svg width="11" height="11" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true">
    <path d="M6.5,1 C3.5,1 1,3.2 1,6 C1,7.8 2,9.4 3.5,10.2 L3.5,12 L9.5,12 L9.5,10.2 C11,9.4 12,7.8 12,6 C12,3.2 9.5,1 6.5,1 Z"/>
    <circle cx="4.5" cy="6.5" r="1.2" fill="rgba(0,0,0,0.5)"/>
    <circle cx="8.5" cy="6.5" r="1.2" fill="rgba(0,0,0,0.5)"/>
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

// ─── Main Component ───────────────────────────────────────────────────────────

const CS2KillFeed = ({ kills = [], ctColor = '#4a9eff', tColor = '#f5a623', players = [] }) => {
  const [visibleKills, setVisibleKills] = useState([])
  const timersRef = useRef({})

  // Build player team map for color lookup
  const teamMap = {}
  players.forEach((p) => { teamMap[p.steamId] = p.team })

  useEffect(() => {
    if (!kills.length) return
    const latest = kills[0]
    const id = `${latest.timestamp}-${latest.attacker?.steamId}`

    // Avoid duplicates
    setVisibleKills((prev) => {
      if (prev.some((k) => `${k.timestamp}-${k.attacker?.steamId}` === id)) return prev
      const next = [{ ...latest, _id: id, _fading: false }, ...prev].slice(0, MAX_VISIBLE)
      return next
    })

    // Schedule removal after KILL_LIFETIME_MS
    if (timersRef.current[id]) clearTimeout(timersRef.current[id])
    timersRef.current[id] = setTimeout(() => {
      setVisibleKills((prev) => prev.filter((k) => k._id !== id))
      delete timersRef.current[id]
    }, KILL_LIFETIME_MS)
  }, [kills])

  if (!visibleKills.length) return null

  return (
    <div className={styles.feed}>
      {visibleKills.map((kill) => {
        const attackerTeam = kill.attacker?.team ?? teamMap[kill.attacker?.steamId] ?? null
        const victimTeam   = kill.victim?.team   ?? teamMap[kill.victim?.steamId]   ?? null
        const attackerColor = attackerTeam === 'CT' ? ctColor : attackerTeam === 'T' ? tColor : 'rgba(255,255,255,0.8)'
        const victimColor   = victimTeam   === 'CT' ? ctColor : victimTeam   === 'T' ? tColor : 'rgba(255,255,255,0.8)'
        const weaponCat     = getWeaponCategory(kill.weapon)
        const weaponIcon    = weaponCat ? WeaponIcons[weaponCat] : null

        return (
          <div key={kill._id} className={styles.killEntry}>
            <span className={styles.attackerName} style={{ color: attackerColor }}>
              {kill.attacker?.name ?? '?'}
            </span>
            <span className={styles.weaponZone}>
              {kill.headshot && (
                <span className={styles.headshotIcon} title="Headshot">
                  <IconHeadshot />
                </span>
              )}
              {weaponIcon && (
                <span className={`${styles.weaponIcon} ${weaponCat ? styles[`wpn_${weaponCat}`] : ''}`}>
                  {weaponIcon}
                </span>
              )}
            </span>
            <span className={styles.victimName} style={{ color: victimColor }}>
              {kill.victim?.name ?? '?'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default CS2KillFeed
