import useCS2GameState from '@shared/useCS2GameState'
import CS2Header from './CS2Header'
import CS2TeamPanel from './CS2TeamPanel'
import CS2PlayersAlive from './CS2PlayersAlive'
import CS2KillFeed from './CS2KillFeed'
import CS2Radar from './CS2Radar'
import CS2ObservedPlayer from './CS2ObservedPlayer'
import styles from './CS2HUD.module.css'

const CS2HUD = ({ state }) => {
  const visible      = state?.visible      ?? false
  const teamCTName   = state?.teamCTName   ?? 'Counter-Terrorists'
  const teamTName    = state?.teamTName    ?? 'Terrorists'
  const teamCTColor  = state?.teamCTColor  ?? '#4a9eff'
  const teamTColor   = state?.teamTColor   ?? '#f5a623'

  const { gameState, kills } = useCS2GameState()

  const ctPlayers = (gameState?.players?.filter((p) => p.team === 'CT') ?? [])
    .sort((a, b) => b.kills - a.kills || a.deaths - b.deaths)
  const tPlayers = (gameState?.players?.filter((p) => p.team === 'T') ?? [])
    .sort((a, b) => b.kills - a.kills || a.deaths - b.deaths)

  return (
    <div
      className={`${styles.canvas} ${visible ? styles.isVisible : styles.isHidden}`}
      style={{ '--ct-color': teamCTColor, '--t-color': teamTColor }}
    >
      {/* Header — topo centro */}
      <div className={styles.headerArea}>
        <CS2Header
          match={gameState?.match ?? null}
          timer={gameState?.timer ?? null}
          teamCTName={teamCTName}
          teamTName={teamTName}
          ctColor={teamCTColor}
          tColor={teamTColor}
        />
      </div>

      {/* Radar — topo esquerdo */}
      <div className={styles.radarArea}>
        <CS2Radar
          players={gameState?.players ?? []}
          mapName={gameState?.match?.mapName ?? ''}
          ctColor={teamCTColor}
          tColor={teamTColor}
        />
      </div>

      {/* PlayersAlive — topo direito */}
      <div className={styles.playersAliveArea}>
        <CS2PlayersAlive
          players={gameState?.players ?? []}
          ctColor={teamCTColor}
          tColor={teamTColor}
        />
      </div>

      {/* KillFeed — topo direito, abaixo PlayersAlive */}
      <div className={styles.killfeedArea}>
        <CS2KillFeed
          kills={kills}
          ctColor={teamCTColor}
          tColor={teamTColor}
          players={gameState?.players ?? []}
        />
      </div>

      {/* TeamPanel CT — esquerda baixo */}
      <div className={styles.ctPanelArea}>
        <CS2TeamPanel
          players={ctPlayers}
          side="ct"
          primaryColor={teamCTColor}
          teamName={teamCTName}
        />
      </div>

      {/* TeamPanel T — direita baixo */}
      <div className={styles.tPanelArea}>
        <CS2TeamPanel
          players={tPlayers}
          side="t"
          primaryColor={teamTColor}
          teamName={teamTName}
        />
      </div>

      {/* ObservedPlayer — centro baixo */}
      <div className={styles.observedArea}>
        <CS2ObservedPlayer
          player={gameState?.observedPlayer ?? null}
          ctColor={teamCTColor}
          tColor={teamTColor}
        />
      </div>
    </div>
  )
}

export default CS2HUD
