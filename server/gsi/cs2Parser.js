/**
 * CS2 GSI Parser
 * Normaliza o payload bruto do CS2 Game State Integration.
 */

const GRENADES = new Set([
  'weapon_flashbang',
  'weapon_smokegrenade',
  'weapon_hegrenade',
  'weapon_molotov',
  'weapon_incgrenade',
  'weapon_decoy',
  'weapon_tagrenade',
])

const PISTOLS = new Set([
  'weapon_glock',
  'weapon_usp_silencer',
  'weapon_p2000',
  'weapon_p250',
  'weapon_deagle',
  'weapon_fiveseven',
  'weapon_tec9',
  'weapon_cz75a',
  'weapon_revolver',
  'weapon_elite',
])

const EQUIPMENT = new Set(['weapon_c4', 'weapon_knife', 'weapon_taser', 'weapon_zeus'])

const categorizeWeapons = (weaponsObj) => {
  if (!weaponsObj) {
    return { primary: null, secondary: null, grenades: [], hasDefuseKit: false, hasBomb: false }
  }

  const items = Object.values(weaponsObj)
  let primary = null
  let secondary = null
  const grenades = []
  let hasDefuseKit = false
  let hasBomb = false

  for (const w of items) {
    const name = w.name ?? ''
    if (name === 'weapon_c4') { hasBomb = true; continue }
    if (name === 'weapon_knife') continue
    if (name === 'weapon_taser' || name === 'weapon_zeus') continue
    if (w.type === 'Knife') continue
    if (w.name === 'weapon_c4') { hasBomb = true; continue }

    // Kit de defuse não aparece como weapon, vem em allplayers_state
    if (GRENADES.has(name)) {
      grenades.push(name.replace('weapon_', ''))
    } else if (PISTOLS.has(name)) {
      secondary = name.replace('weapon_', '')
    } else if (!EQUIPMENT.has(name)) {
      primary = name.replace('weapon_', '')
    }
  }

  return { primary, secondary, grenades, hasBomb, hasDefuseKit }
}

const detectKills = (allplayers, previously) => {
  if (!allplayers || !previously?.allplayers) return []

  // Vítimas: saúde passou de >0 para 0
  const victims = []
  for (const [steamId, prev] of Object.entries(previously.allplayers)) {
    const curr = allplayers[steamId]
    if (!curr) continue
    const prevHealth = prev.state?.health
    const currHealth = curr.state?.health ?? 0
    if (prevHealth !== undefined && prevHealth > 0 && currHealth === 0) {
      victims.push({ steamId, name: curr.name ?? '' })
    }
  }

  if (victims.length === 0) return []

  // Atacantes: kill count aumentou neste payload
  const killers = []
  for (const [steamId, prev] of Object.entries(previously.allplayers)) {
    const curr = allplayers[steamId]
    if (!curr) continue
    const prevKills = prev.match_stats?.kills
    const currKills = curr.match_stats?.kills ?? 0
    if (prevKills !== undefined && currKills > prevKills) {
      const weapons = curr.weapons ? Object.values(curr.weapons) : []
      const activeWeapon = weapons.find((w) => w.state === 'active')
      const prevHs = prev.extra_info?.headshots
      const currHs = curr.extra_info?.headshots ?? 0
      killers.push({
        name: curr.name ?? '',
        weapon: activeWeapon?.name?.replace('weapon_', '') ?? 'unknown',
        headshot: prevHs !== undefined && currHs > prevHs,
      })
    }
  }

  return victims.map((victim, i) => {
    const killer = killers[i] ?? { name: null, weapon: 'unknown', headshot: false }
    return {
      attacker: killer.name,
      victim: victim.name,
      weapon: killer.weapon,
      headshot: killer.headshot,
      timestamp: Date.now(),
    }
  })
}

const parse = (payload) => {
  try {
    const { map, round, allplayers, bomb, phase_countdowns, previously } = payload ?? {}

    if (!allplayers) return null

    const match = {
      phase: map?.phase ?? null,
      roundNumber: map?.round ?? 0,
      ctScore: map?.team_ct?.score ?? 0,
      tScore: map?.team_t?.score ?? 0,
      mapName: map?.name ?? '',
      mode: map?.mode ?? '',
    }

    const roundData = {
      phase: round?.phase ?? null,
      bombState: bomb?.state ?? null,
      winTeam: round?.win_team ?? null,
    }

    const timer = {
      phase: phase_countdowns?.phase ?? null,
      remaining: parseFloat(phase_countdowns?.phase_ends_in ?? 0),
    }

    const players = Object.entries(allplayers).map(([steamId, p]) => {
      const weapons = categorizeWeapons(p.weapons)

      return {
        steamId,
        name: p.name ?? '',
        team: p.team ?? null,
        // Vida e armadura
        health: p.state?.health ?? 0,
        armor: p.state?.armor ?? 0,
        hasHelmet: p.state?.helmet ?? false,
        isAlive: (p.state?.health ?? 0) > 0,
        // KDA — requer allplayers_match_stats no cfg
        kills: p.match_stats?.kills ?? 0,
        deaths: p.match_stats?.deaths ?? 0,
        assists: p.match_stats?.assists ?? 0,
        mvps: p.match_stats?.mvps ?? 0,
        score: p.match_stats?.score ?? 0,
        // Estatísticas do round atual
        roundKills: p.state?.round_kills ?? 0,
        roundDamage: p.state?.round_totaldmg ?? 0,
        // Dados extras — requer allplayers_extra_info no cfg
        headshots: p.extra_info?.headshots ?? 0,
        adr: p.extra_info?.adr ?? 0,
        // Economia
        money: p.state?.money ?? 0,
        equipValue: p.state?.equip_value ?? 0,
        // Armas e utilitárias
        primary: weapons.primary,
        secondary: weapons.secondary,
        grenades: weapons.grenades,
        hasBomb: weapons.hasBomb,
        hasDefuseKit: p.state?.defusekit ?? false,
      }
    })

    // Economia por time
    const ctPlayers = players.filter((p) => p.team === 'CT')
    const tPlayers = players.filter((p) => p.team === 'T')
    const economy = {
      ct: {
        totalMoney: ctPlayers.reduce((s, p) => s + p.money, 0),
        totalEquipValue: ctPlayers.reduce((s, p) => s + p.equipValue, 0),
      },
      t: {
        totalMoney: tPlayers.reduce((s, p) => s + p.money, 0),
        totalEquipValue: tPlayers.reduce((s, p) => s + p.equipValue, 0),
      },
    }

    const kills = detectKills(allplayers, previously)

    console.log(`[CS2 GSI] phase: ${match.phase}, round: ${match.roundNumber}`)

    return { match, round: roundData, timer, players, economy, kills }
  } catch (err) {
    console.error('[CS2 GSI] Erro ao parsear payload:', err)
    return null
  }
}

export { parse }
