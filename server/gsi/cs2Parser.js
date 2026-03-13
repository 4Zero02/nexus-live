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


const parse = (payload) => {
  try {
    const { map, round, allplayers, bomb, phase_countdowns, player } = payload ?? {}

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
        observerSlot: p.observer_slot ?? 0,
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

    // Jogador observado (payload.player — diferente de allplayers)
    let observedPlayer = null
    if (player && player.steamid) {
      const weapons = categorizeWeapons(player.weapons)

      // KDA vem de allplayers (mais confiável que payload.player.match_stats)
      const fromAllPlayers = players.find((p) => p.steamId === player.steamid)

      observedPlayer = {
        steamId: player.steamid,
        name: player.name ?? '',
        team: player.team ?? null,
        health: player.state?.health ?? 0,
        armor: player.state?.armor ?? 0,
        hasHelmet: player.state?.helmet ?? false,
        isAlive: (player.state?.health ?? 0) > 0,
        kills: fromAllPlayers?.kills ?? player.match_stats?.kills ?? 0,
        deaths: fromAllPlayers?.deaths ?? player.match_stats?.deaths ?? 0,
        assists: fromAllPlayers?.assists ?? player.match_stats?.assists ?? 0,
        roundDamage: player.state?.round_totaldmg ?? 0,
        money: player.state?.money ?? 0,
        primary: weapons.primary,
        secondary: weapons.secondary,
        grenades: weapons.grenades,
        hasBomb: weapons.hasBomb,
        hasDefuseKit: player.state?.defusekit ?? false,
        ammoClip: null,
        ammoReserve: null,
      }
      // Ammo da arma ativa
      if (player.weapons) {
        const activeWeapon = Object.values(player.weapons).find((w) => w.state === 'active')
        if (activeWeapon) {
          observedPlayer.ammoClip = activeWeapon.ammo_clip ?? null
          observedPlayer.ammoReserve = activeWeapon.ammo_reserve ?? null
          observedPlayer.activeWeaponName = (activeWeapon.name ?? '').replace('weapon_', '')
        }
      }
    }

    console.log(`[CS2 GSI] phase: ${match.phase}, round: ${match.roundNumber}`)

    return { match, round: roundData, timer, players, economy, observedPlayer }
  } catch (err) {
    console.error('[CS2 GSI] Erro ao parsear payload:', err)
    return null
  }
}

export { parse }
