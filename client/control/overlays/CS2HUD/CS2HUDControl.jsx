import { useState, useEffect } from 'react'
import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import { useToast } from '@shared/ui/Toast/useToast'
import useCS2GameState from '@shared/useCS2GameState'
import styles from './CS2HUDControl.module.css'

const CS2_MAPS = [
  'de_ancient', 'de_anubis', 'de_dust2', 'de_inferno',
  'de_mirage', 'de_nuke', 'de_overpass', 'de_train',
  'de_vertigo', 'de_edin', 'de_basalt',
]

const EMPTY_MAP = { mapName: '', pickedBy: '', scoreLeft: '', scoreRight: '' }

const CS2HUDControl = ({ state, emit, connected }) => {
  const { toast } = useToast()
  const { gameState, isConnected: cs2Connected } = useCS2GameState()
  const [images, setImages] = useState([])
  const [newMap, setNewMap] = useState(EMPTY_MAP)

  useEffect(() => {
    fetch('/assets/list')
      .then(r => r.json())
      .then(data => { if (data.images?.length) setImages(data.images) })
      .catch(err => console.warn('[CS2HUDControl] Falha ao carregar assets:', err))
  }, [])

  const isVisible         = state?.visible          ?? false
  const teamCTName        = state?.teamCTName        ?? 'Counter-Terrorists'
  const teamTName         = state?.teamTName         ?? 'Terrorists'
  const teamCTShortName   = state?.teamCTShortName   ?? 'CT'
  const teamTShortName    = state?.teamTShortName    ?? 'TR'
  const teamCTColor       = state?.teamCTColor       ?? '#4a9eff'
  const teamTColor        = state?.teamTColor        ?? '#f5a623'
  const teamCTLogo        = state?.teamCTLogo        ?? ''
  const teamTLogo         = state?.teamTLogo         ?? ''
  const swapSides         = state?.swapSides         ?? false
  const seriesFormat      = state?.seriesFormat      ?? 'md1'
  const seriesScore       = state?.seriesScore       ?? { ct: 0, t: 0 }
  const mapList           = state?.mapList           ?? []

  const update = (patch) => emit('overlay:update', { data: patch })

  const ctPlayers = gameState?.players?.filter((p) => p.team === 'CT') ?? []
  const tPlayers  = gameState?.players?.filter((p) => p.team === 'T')  ?? []
  const ctAlive   = ctPlayers.filter((p) => p.isAlive).length
  const tAlive    = tPlayers.filter((p) => p.isAlive).length

  const handleSwap = () => {
    update({ swapSides: !swapSides })
    toast.info(swapSides ? 'Times na posição original' : 'Lados trocados ↔')
  }

  const updateSeriesScore = (team, delta) => {
    const next = Math.max(0, (seriesScore[team] ?? 0) + delta)
    update({ seriesScore: { ...seriesScore, [team]: next } })
  }

  const addMap = () => {
    if (!newMap.mapName) return
    const item = {
      id: Date.now().toString(),
      mapName: newMap.mapName,
      pickedBy: newMap.pickedBy || null,
      scoreLeft:  newMap.scoreLeft  !== '' ? parseInt(newMap.scoreLeft,  10) : null,
      scoreRight: newMap.scoreRight !== '' ? parseInt(newMap.scoreRight, 10) : null,
    }
    update({ mapList: [...mapList, item] })
    setNewMap(EMPTY_MAP)
  }

  const removeMap = (id) => {
    update({ mapList: mapList.filter((m) => m.id !== id) })
  }

  const formatMapLabel = (name) =>
    name.replace(/^(de_|cs_|ar_)/, '').replace(/_/g, ' ').toUpperCase()

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
                <span className={styles.liveTeamName} style={{ color: teamCTColor }}>{teamCTShortName}</span>
                <span className={styles.liveScoreNum}>{gameState.match?.ctScore ?? '—'}</span>
              </div>
              <span className={styles.liveSep}>:</span>
              <div className={`${styles.liveTeam} ${styles.liveTeamRight}`}>
                <span className={styles.liveScoreNum}>{gameState.match?.tScore ?? '—'}</span>
                <span className={styles.liveTeamName} style={{ color: teamTColor }}>{teamTShortName}</span>
              </div>
            </div>
            <p className={styles.mapLabel}>
              {gameState.match?.mapName} · Round {(gameState.match?.roundNumber ?? 0) + 1} · {gameState.timer?.phase ?? 'N/D'}
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

      {/* Trocar lados */}
      <Button
        variant={swapSides ? 'primary' : 'secondary'}
        size="lg"
        fullWidth
        disabled={!connected}
        onClick={handleSwap}
      >
        {swapSides ? '↔ Lados Trocados (clique para reverter)' : '↔ Trocar Lados (halftime)'}
      </Button>

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
            <Input
              id="cs2hud-ct-short"
              label="Sigla CT (máx. 5)"
              placeholder="Ex: NXE"
              value={teamCTShortName}
              onChange={(e) => update({ teamCTShortName: e.target.value.slice(0, 5).toUpperCase() })}
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
            <div className={styles.logoRow}>
              <label className={styles.logoLabel}>Logo CT</label>
              <select
                className={styles.select}
                value={teamCTLogo}
                onChange={(e) => update({ teamCTLogo: e.target.value || null })}
              >
                <option value="">— Nenhuma —</option>
                {images.map(img => <option key={img} value={img}>{img}</option>)}
              </select>
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
            <Input
              id="cs2hud-t-short"
              label="Sigla T (máx. 5)"
              placeholder="Ex: FAZE"
              value={teamTShortName}
              onChange={(e) => update({ teamTShortName: e.target.value.slice(0, 5).toUpperCase() })}
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
            <div className={styles.logoRow}>
              <label className={styles.logoLabel}>Logo T</label>
              <select
                className={styles.select}
                value={teamTLogo}
                onChange={(e) => update({ teamTLogo: e.target.value || null })}
              >
                <option value="">— Nenhuma —</option>
                {images.map(img => <option key={img} value={img}>{img}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Formato da série */}
      <Card>
        <p className={styles.sectionLabel}>Formato da série</p>
        <div className={styles.seriesRow}>
          <div className={styles.formatSelect}>
            <label className={styles.colorLabel}>Formato</label>
            <select
              className={styles.select}
              value={seriesFormat}
              onChange={(e) => update({ seriesFormat: e.target.value })}
            >
              <option value="md1">MD1 (único mapa)</option>
              <option value="md3">MD3 (melhor de 3)</option>
              <option value="md5">MD5 (melhor de 5)</option>
            </select>
          </div>
        </div>

        {seriesFormat !== 'md1' && (
          <div className={styles.seriesScoreRow}>
            <div className={styles.seriesTeam}>
              <span className={styles.seriesTeamLabel} style={{ color: teamCTColor }}>{teamCTShortName}</span>
              <div className={styles.scoreButtons}>
                <button className={styles.scoreBtn} onClick={() => updateSeriesScore('ct', -1)}>−</button>
                <span className={styles.seriesScoreNum}>{seriesScore.ct}</span>
                <button className={styles.scoreBtn} onClick={() => updateSeriesScore('ct', +1)}>+</button>
              </div>
            </div>
            <span className={styles.seriesSep}>mapas</span>
            <div className={styles.seriesTeam}>
              <span className={styles.seriesTeamLabel} style={{ color: teamTColor }}>{teamTShortName}</span>
              <div className={styles.scoreButtons}>
                <button className={styles.scoreBtn} onClick={() => updateSeriesScore('t', -1)}>−</button>
                <span className={styles.seriesScoreNum}>{seriesScore.t}</span>
                <button className={styles.scoreBtn} onClick={() => updateSeriesScore('t', +1)}>+</button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Picks de mapas */}
      {seriesFormat !== 'md1' && (
        <Card>
          <p className={styles.sectionLabel}>Picks de mapas</p>

          {/* Formulário para adicionar */}
          <div className={styles.mapForm}>
            <select
              className={styles.select}
              value={newMap.mapName}
              onChange={(e) => setNewMap(m => ({ ...m, mapName: e.target.value }))}
            >
              <option value="">— Selecione o mapa —</option>
              {CS2_MAPS.map(m => (
                <option key={m} value={m}>{formatMapLabel(m)}</option>
              ))}
            </select>
            <div className={styles.mapFormRow}>
              <select
                className={styles.selectSmall}
                value={newMap.pickedBy}
                onChange={(e) => setNewMap(m => ({ ...m, pickedBy: e.target.value }))}
              >
                <option value="">— Pick —</option>
                <option value="ct">{teamCTShortName}</option>
                <option value="t">{teamTShortName}</option>
                <option value="decoy">DECOY</option>
              </select>
              <input
                type="number"
                className={styles.scoreInput}
                placeholder={teamCTShortName}
                value={newMap.scoreLeft}
                min="0" max="30"
                onChange={(e) => setNewMap(m => ({ ...m, scoreLeft: e.target.value }))}
              />
              <span className={styles.scoreDash}>–</span>
              <input
                type="number"
                className={styles.scoreInput}
                placeholder={teamTShortName}
                value={newMap.scoreRight}
                min="0" max="30"
                onChange={(e) => setNewMap(m => ({ ...m, scoreRight: e.target.value }))}
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={!newMap.mapName}
              onClick={addMap}
            >
              + Adicionar mapa
            </Button>
          </div>

          {/* Lista existente */}
          {mapList.length > 0 && (
            <div className={styles.mapList}>
              {mapList.map((item, i) => (
                <div key={item.id} className={styles.mapItem}>
                  <span className={styles.mapItemIndex}>{i + 1}</span>
                  <span className={styles.mapItemName}>{formatMapLabel(item.mapName)}</span>
                  {item.pickedBy && (
                    <span className={styles.mapItemPick} style={{
                      color: item.pickedBy === 'ct' ? teamCTColor : item.pickedBy === 't' ? teamTColor : 'rgba(255,255,255,0.5)'
                    }}>
                      {item.pickedBy === 'ct' ? teamCTShortName : item.pickedBy === 't' ? teamTShortName : 'DECOY'}
                    </span>
                  )}
                  {item.scoreLeft !== null && item.scoreLeft !== undefined && (
                    <span className={styles.mapItemScore}>{item.scoreLeft}–{item.scoreRight}</span>
                  )}
                  <button className={styles.mapItemRemove} onClick={() => removeMap(item.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

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
