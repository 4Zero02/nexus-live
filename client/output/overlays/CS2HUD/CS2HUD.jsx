import useCS2GameState from '@shared/useCS2GameState'
import CS2Header from './CS2Header'
import CS2TeamPanel from './CS2TeamPanel'
import CS2ObservedPlayer from './CS2ObservedPlayer'
import CS2MapList from './CS2MapList'
import styles from './CS2HUD.module.css'

const CS2HUD = ({ state }) => {
  const visible          = state?.visible          ?? false
  const teamCTName       = state?.teamCTName        ?? 'Counter-Terrorists'
  const teamTName        = state?.teamTName         ?? 'Terrorists'
  const teamCTShortName  = state?.teamCTShortName   ?? 'CT'
  const teamTShortName   = state?.teamTShortName    ?? 'TR'
  const teamCTColor      = state?.teamCTColor       ?? '#4a9eff'
  const teamTColor       = state?.teamTColor        ?? '#f5a623'
  const teamCTLogo       = state?.teamCTLogo        ?? null
  const teamTLogo        = state?.teamTLogo         ?? null
  const swapSides        = state?.swapSides         ?? false
  const seriesFormat     = state?.seriesFormat      ?? 'md1'
  const seriesScore      = state?.seriesScore       ?? { ct: 0, t: 0 }
  const mapList          = state?.mapList           ?? []
  // Company accent color — used only in the center score header
  const scoreAccentColor = state?.scoreAccentColor  ?? '#00b64c'

  const { gameState } = useCS2GameState()

  // Sort by observerSlot
  const rawCT = (gameState?.players?.filter((p) => p.team === 'CT') ?? [])
    .sort((a, b) => (a.observerSlot ?? 0) - (b.observerSlot ?? 0))
  const rawT = (gameState?.players?.filter((p) => p.team === 'T') ?? [])
    .sort((a, b) => (a.observerSlot ?? 0) - (b.observerSlot ?? 0))

  // Assign positions based on swapSides
  // side prop: 'ct' = left layout, 't' = right layout
  const leftPlayers    = swapSides ? rawT  : rawCT
  const rightPlayers   = swapSides ? rawCT : rawT
  const leftColor      = swapSides ? teamTColor  : teamCTColor
  const rightColor     = swapSides ? teamCTColor : teamTColor
  const leftName       = swapSides ? teamTName   : teamCTName
  const rightName      = swapSides ? teamCTName  : teamTName
  const leftLogo       = swapSides ? teamTLogo   : teamCTLogo
  const rightLogo      = swapSides ? teamCTLogo  : teamTLogo

  return (
    <div
      className={`${styles.canvas} ${visible ? styles.isVisible : styles.isHidden}`}
    >
      {/* Header — topo centro */}
      <div className={styles.headerArea}>
        <CS2Header
          match={gameState?.match ?? null}
          timer={gameState?.timer ?? null}
          teamCTLogo={leftLogo}
          teamTLogo={rightLogo}
          swapSides={swapSides}
          seriesFormat={seriesFormat}
          seriesScore={seriesScore}
          teamCTShortName={swapSides ? teamTShortName : teamCTShortName}
          teamTShortName={swapSides ? teamCTShortName : teamTShortName}
          ctColor={leftColor}
          tColor={rightColor}
        />
      </div>

      {/* Map List — topo esquerdo (apenas em séries com mapas definidos) */}
      {mapList.length > 0 && seriesFormat !== 'md1' && (
        <div className={styles.mapListArea}>
          <CS2MapList
            mapList={mapList}
            ctShortName={swapSides ? teamTShortName : teamCTShortName}
            tShortName={swapSides ? teamCTShortName : teamTShortName}
            ctColor={leftColor}
            tColor={rightColor}
          />
        </div>
      )}

      {/* TeamPanel — esquerda */}
      <div className={styles.ctPanelArea}>
        <CS2TeamPanel
          players={leftPlayers}
          side="ct"
          primaryColor={leftColor}
          teamName={leftName}
        />
      </div>

      {/* TeamPanel — direita */}
      <div className={styles.tPanelArea}>
        <CS2TeamPanel
          players={rightPlayers}
          side="t"
          primaryColor={rightColor}
          teamName={rightName}
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
