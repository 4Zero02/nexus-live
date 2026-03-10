import { useState, useEffect } from 'react'
import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import { useToast } from '@shared/ui/Toast/useToast'
import useCS2GameState from '@shared/useCS2GameState'
import styles from './CS2ScoreboardControl.module.css'

const FALLBACK_FONTS = ['Inter', 'Roboto', 'Montserrat', 'Oswald', 'Rajdhani']

const CS2ScoreboardControl = ({ state, emit, connected }) => {
  const { toast } = useToast()
  const [images, setImages] = useState([])
  const [fonts, setFonts] = useState(FALLBACK_FONTS)
  const { gameState, isConnected: cs2Connected } = useCS2GameState()

  useEffect(() => {
    fetch('/assets/list')
      .then((r) => r.json())
      .then((data) => {
        if (data.images?.length) setImages(data.images)
        if (data.fonts?.length) {
          const fontNames = data.fonts.map((f) => f.replace(/\.[^.]+$/, ''))
          setFonts([...new Set([...FALLBACK_FONTS, ...fontNames])])
        }
      })
      .catch((err) => console.warn('[CS2ScoreboardControl] Falha ao carregar assets:', err))
  }, [])

  const isVisible = state?.visible ?? false
  const primaryColor = state?.primaryColor ?? '#f0b429'
  const font = state?.font ?? 'Inter'
  const teamCTName = state?.teamCTName ?? 'CT'
  const teamTName = state?.teamTName ?? 'T'
  const teamCTLogo = state?.teamCTLogo ?? null
  const teamTLogo = state?.teamTLogo ?? null

  const update = (patch) => emit('overlay:update', { data: patch })

  const ctPlayers = gameState?.players?.filter((p) => p.team === 'CT') ?? []
  const tPlayers = gameState?.players?.filter((p) => p.team === 'T') ?? []

  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <h2 className={styles.heading}>CS2 Scoreboard</h2>
        <div className={styles.badges}>
          <Badge variant={cs2Connected && gameState ? 'live' : 'offline'}>
            {cs2Connected && gameState ? 'CS2 ✓' : 'CS2 ✗'}
          </Badge>
          <Badge variant={isVisible ? 'live' : 'offline'}>
            {isVisible ? 'VISÍVEL' : 'OCULTO'}
          </Badge>
        </div>
      </div>

      {/* Placar ao vivo (read-only) */}
      <Card>
        <p className={styles.sectionLabel}>Placar ao vivo</p>
        <div className={styles.liveScore}>
          <div className={styles.liveTeam}>
            <span className={styles.liveTeamName}>{teamCTName}</span>
            <span className={styles.liveScoreNum}>{gameState?.match?.ctScore ?? '—'}</span>
          </div>
          <span className={styles.liveSep}>:</span>
          <div className={`${styles.liveTeam} ${styles.liveTeamRight}`}>
            <span className={styles.liveScoreNum}>{gameState?.match?.tScore ?? '—'}</span>
            <span className={styles.liveTeamName}>{teamTName}</span>
          </div>
        </div>
        {gameState && (
          <p className={styles.mapLabel}>
            {gameState.match.mapName} · Round {gameState.match.roundNumber}
          </p>
        )}
      </Card>

      {/* Jogadores ao vivo (read-only) */}
      {gameState && (
        <Card>
          <p className={styles.sectionLabel}>Jogadores ao vivo</p>
          <div className={styles.playersGrid}>
            <div className={styles.playerCol}>
              <p className={styles.colLabel}>CT</p>
              {ctPlayers.map((p) => (
                <div key={p.steamId} className={`${styles.playerRow} ${!p.isAlive ? styles.dead : ''}`}>
                  <span className={styles.playerStatus}>{p.isAlive ? '●' : '✕'}</span>
                  <span className={styles.playerName}>{p.name}</span>
                  <span className={styles.playerKDA}>{p.kills}/{p.deaths}/{p.assists}</span>
                </div>
              ))}
            </div>
            <div className={styles.playerCol}>
              <p className={styles.colLabel}>T</p>
              {tPlayers.map((p) => (
                <div key={p.steamId} className={`${styles.playerRow} ${!p.isAlive ? styles.dead : ''}`}>
                  <span className={styles.playerStatus}>{p.isAlive ? '●' : '✕'}</span>
                  <span className={styles.playerName}>{p.name}</span>
                  <span className={styles.playerKDA}>{p.kills}/{p.deaths}/{p.assists}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Times */}
      <Card>
        <p className={styles.sectionLabel}>Times</p>
        <div className={styles.teamsGrid}>
          <div className={styles.teamFields}>
            <Input
              id="cs2sb-ct-name"
              label="Nome CT"
              placeholder="Ex: NEXUS"
              value={teamCTName}
              onChange={(e) => update({ teamCTName: e.target.value })}
            />
            <div className={styles.fieldGroup}>
              <label className={styles.selectLabel} htmlFor="cs2sb-ct-logo">Logo CT</label>
              <select
                id="cs2sb-ct-logo"
                className={styles.select}
                value={teamCTLogo ?? ''}
                onChange={(e) => update({ teamCTLogo: e.target.value || null })}
              >
                <option value="">— Sem logo —</option>
                {images.map((img) => (
                  <option key={img} value={img}>{img}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.teamFields}>
            <Input
              id="cs2sb-t-name"
              label="Nome T"
              placeholder="Ex: ALTAIR"
              value={teamTName}
              onChange={(e) => update({ teamTName: e.target.value })}
            />
            <div className={styles.fieldGroup}>
              <label className={styles.selectLabel} htmlFor="cs2sb-t-logo">Logo T</label>
              <select
                id="cs2sb-t-logo"
                className={styles.select}
                value={teamTLogo ?? ''}
                onChange={(e) => update({ teamTLogo: e.target.value || null })}
              >
                <option value="">— Sem logo —</option>
                {images.map((img) => (
                  <option key={img} value={img}>{img}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Estilo */}
      <Card>
        <p className={styles.sectionLabel}>Estilo</p>
        <div className={styles.fields}>
          <div className={styles.colorRow}>
            <label className={styles.colorLabel} htmlFor="cs2sb-color">
              Cor de destaque
            </label>
            <input
              id="cs2sb-color"
              type="color"
              className={styles.colorInput}
              value={primaryColor}
              onChange={(e) => update({ primaryColor: e.target.value })}
            />
            <span className={styles.colorValue}>{primaryColor}</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.selectLabel} htmlFor="cs2sb-font">Fonte</label>
            <select
              id="cs2sb-font"
              className={styles.select}
              value={font}
              onChange={(e) => update({ font: e.target.value })}
            >
              {fonts.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
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
          onClick={() => { emit('overlay:show', {}); toast.success('CS2 Scoreboard exibido') }}
        >
          Mostrar
        </Button>
        <Button
          variant="danger"
          size="lg"
          fullWidth
          disabled={!connected || !isVisible}
          onClick={() => { emit('overlay:hide', {}); toast.info('CS2 Scoreboard ocultado') }}
        >
          Esconder
        </Button>
      </div>
    </div>
  )
}

export default CS2ScoreboardControl
