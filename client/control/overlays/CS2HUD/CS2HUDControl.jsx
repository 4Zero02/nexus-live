import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import { useToast } from '@shared/ui/Toast/useToast'
import useCS2GameState from '@shared/useCS2GameState'
import styles from './CS2HUDControl.module.css'

const CS2HUDControl = ({ state, emit, connected }) => {
  const { toast } = useToast()
  const { gameState, isConnected: cs2Connected, kills } = useCS2GameState()

  const isVisible  = state?.visible      ?? false
  const teamCTName = state?.teamCTName   ?? 'Counter-Terrorists'
  const teamTName  = state?.teamTName    ?? 'Terrorists'
  const teamCTColor = state?.teamCTColor ?? '#4a9eff'
  const teamTColor  = state?.teamTColor  ?? '#f5a623'

  const update = (patch) => emit('overlay:update', { data: patch })

  const ctPlayers = gameState?.players?.filter((p) => p.team === 'CT') ?? []
  const tPlayers  = gameState?.players?.filter((p) => p.team === 'T')  ?? []
  const ctAlive   = ctPlayers.filter((p) => p.isAlive).length
  const tAlive    = tPlayers.filter((p) => p.isAlive).length

  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <h2 className={styles.heading}>CS2 Observer HUD</h2>
        <div className={styles.badges}>
          <Badge variant={cs2Connected && gameState ? 'live' : 'offline'}>
            {cs2Connected && gameState ? 'CS2 ✓' : 'CS2 ✗'}
          </Badge>
          <Badge variant={isVisible ? 'live' : 'offline'}>
            {isVisible ? 'VISÍVEL' : 'OCULTO'}
          </Badge>
        </div>
      </div>

      {/* Placar ao vivo */}
      <Card>
        <p className={styles.sectionLabel}>Partida ao vivo</p>
        {gameState ? (
          <>
            <div className={styles.liveScore}>
              <div className={styles.liveTeam}>
                <span className={styles.liveTeamName} style={{ color: teamCTColor }}>{teamCTName}</span>
                <span className={styles.liveScoreNum}>{gameState.match?.ctScore ?? '—'}</span>
              </div>
              <span className={styles.liveSep}>:</span>
              <div className={`${styles.liveTeam} ${styles.liveTeamRight}`}>
                <span className={styles.liveScoreNum}>{gameState.match?.tScore ?? '—'}</span>
                <span className={styles.liveTeamName} style={{ color: teamTColor }}>{teamTName}</span>
              </div>
            </div>
            <p className={styles.mapLabel}>
              {gameState.match?.mapName} · Round {gameState.match?.roundNumber} · {gameState.timer?.phase ?? 'N/D'}
            </p>
            <div className={styles.aliveRow}>
              <span className={styles.aliveItem} style={{ color: teamCTColor }}>CT vivos: {ctAlive}/5</span>
              <span className={styles.aliveItem} style={{ color: teamTColor }}>T vivos: {tAlive}/5</span>
            </div>
          </>
        ) : (
          <p className={styles.noData}>Aguardando CS2 GSI...</p>
        )}
      </Card>

      {/* Kills recentes */}
      {kills.length > 0 && (
        <Card>
          <p className={styles.sectionLabel}>Kills recentes</p>
          <div className={styles.killsList}>
            {kills.slice(0, 5).map((k, i) => (
              <div key={i} className={styles.killItem}>
                <span className={styles.killAttacker}>{k.attacker?.name ?? '?'}</span>
                <span className={styles.killArrow}>→</span>
                <span className={styles.killVictim}>{k.victim?.name ?? '?'}</span>
                <span className={styles.killWeapon}>{k.weapon ?? ''}</span>
                {k.headshot && <span className={styles.killHs}>HS</span>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Times */}
      <Card>
        <p className={styles.sectionLabel}>Times</p>
        <div className={styles.teamsGrid}>
          <div className={styles.teamFields}>
            <Input
              id="cs2hud-ct-name"
              label="Nome CT"
              placeholder="Ex: Counter-Terrorists"
              value={teamCTName}
              onChange={(e) => update({ teamCTName: e.target.value })}
            />
            <div className={styles.colorRow}>
              <label className={styles.colorLabel} htmlFor="cs2hud-ct-color">Cor CT</label>
              <input
                id="cs2hud-ct-color"
                type="color"
                className={styles.colorInput}
                value={teamCTColor}
                onChange={(e) => update({ teamCTColor: e.target.value })}
              />
              <span className={styles.colorValue}>{teamCTColor}</span>
            </div>
          </div>

          <div className={styles.teamFields}>
            <Input
              id="cs2hud-t-name"
              label="Nome T"
              placeholder="Ex: Terrorists"
              value={teamTName}
              onChange={(e) => update({ teamTName: e.target.value })}
            />
            <div className={styles.colorRow}>
              <label className={styles.colorLabel} htmlFor="cs2hud-t-color">Cor T</label>
              <input
                id="cs2hud-t-color"
                type="color"
                className={styles.colorInput}
                value={teamTColor}
                onChange={(e) => update({ teamTColor: e.target.value })}
              />
              <span className={styles.colorValue}>{teamTColor}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Ações */}
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!connected || isVisible}
          onClick={() => { emit('overlay:show', {}); toast.success('CS2 HUD exibido') }}
        >
          Mostrar HUD
        </Button>
        <Button
          variant="danger"
          size="lg"
          fullWidth
          disabled={!connected || !isVisible}
          onClick={() => { emit('overlay:hide', {}); toast.info('CS2 HUD ocultado') }}
        >
          Esconder HUD
        </Button>
      </div>
    </div>
  )
}

export default CS2HUDControl
