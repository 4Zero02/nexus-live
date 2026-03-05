import { useState, useEffect } from 'react'
import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import { useToast } from '@shared/ui/Toast/useToast'
import styles from './ScoreboardControl.module.css'

const FALLBACK_FONTS = ['Inter', 'Roboto', 'Montserrat', 'Oswald', 'Rajdhani']

const ScoreboardControl = ({ state, emit, connected }) => {
  const { toast } = useToast()
  const [images, setImages] = useState([])
  const [fonts, setFonts] = useState(FALLBACK_FONTS)

  useEffect(() => {
    fetch('/assets/list')
      .then(r => r.json())
      .then(data => {
        if (data.images?.length) setImages(data.images)
        if (data.fonts?.length) {
          const fontNames = data.fonts.map(f => f.replace(/\.[^.]+$/, ''))
          setFonts([...new Set([...FALLBACK_FONTS, ...fontNames])])
        }
      })
      .catch(err => console.warn('[ScoreboardControl] Falha ao carregar assets:', err))
  }, [])

  const isVisible = state?.visible ?? false
  const primaryColor = state?.primaryColor ?? '#65b307'
  const font = state?.font ?? 'Inter'
  const event = state?.event ?? ''
  const teamA = state?.teamA ?? { name: '', score: 0, logo: null }
  const teamB = state?.teamB ?? { name: '', score: 0, logo: null }

  const update = (patch) => emit('overlay:update', { data: patch })

  const updateTeamA = (patch) => update({ teamA: { ...teamA, ...patch } })
  const updateTeamB = (patch) => update({ teamB: { ...teamB, ...patch } })

  const handleShow = () => {
    emit('overlay:show', {})
    toast.success('Scoreboard exibido')
  }

  const handleHide = () => {
    emit('overlay:hide', {})
    toast.info('Scoreboard ocultado')
  }

  const handleReset = () => {
    update({
      teamA: { ...teamA, score: 0 },
      teamB: { ...teamB, score: 0 },
    })
    toast.info('Placar zerado')
  }

  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <h2 className={styles.heading}>Scoreboard</h2>
        <Badge variant={isVisible ? 'live' : 'offline'}>
          {isVisible ? 'VISÍVEL' : 'OCULTO'}
        </Badge>
      </div>

      {/* Placar */}
      <Card>
        <p className={styles.sectionLabel}>Placar</p>
        <div className={styles.scoreRow}>
          <div className={styles.scoreTeam}>
            <span className={styles.scoreTeamName}>{teamA.name || 'Time A'}</span>
            <div className={styles.scoreControls}>
              <button
                className={styles.scoreBtn}
                disabled={!connected || teamA.score <= 0}
                onClick={() => updateTeamA({ score: teamA.score - 1 })}
                aria-label="Diminuir score Time A"
              >
                −
              </button>
              <span className={styles.scoreDisplay}>{teamA.score}</span>
              <button
                className={styles.scoreBtn}
                disabled={!connected}
                onClick={() => updateTeamA({ score: teamA.score + 1 })}
                aria-label="Aumentar score Time A"
              >
                +
              </button>
            </div>
          </div>

          <span className={styles.scoreSep}>×</span>

          <div className={styles.scoreTeam}>
            <span className={styles.scoreTeamName}>{teamB.name || 'Time B'}</span>
            <div className={styles.scoreControls}>
              <button
                className={styles.scoreBtn}
                disabled={!connected || teamB.score <= 0}
                onClick={() => updateTeamB({ score: teamB.score - 1 })}
                aria-label="Diminuir score Time B"
              >
                −
              </button>
              <span className={styles.scoreDisplay}>{teamB.score}</span>
              <button
                className={styles.scoreBtn}
                disabled={!connected}
                onClick={() => updateTeamB({ score: teamB.score + 1 })}
                aria-label="Aumentar score Time B"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Times */}
      <Card>
        <p className={styles.sectionLabel}>Times</p>
        <div className={styles.teamsGrid}>
          <div className={styles.teamFields}>
            <Input
              id="sb-teamA-name"
              label="Nome — Time A"
              placeholder="Ex: LOUD"
              value={teamA.name}
              onChange={(e) => updateTeamA({ name: e.target.value })}
            />
            <div className={styles.fieldGroup}>
              <label className={styles.selectLabel} htmlFor="sb-teamA-logo">Logo — Time A</label>
              <select
                id="sb-teamA-logo"
                className={styles.select}
                value={teamA.logo ?? ''}
                onChange={(e) => updateTeamA({ logo: e.target.value || null })}
              >
                <option value="">— Sem logo —</option>
                {images.map(img => (
                  <option key={img} value={img}>{img}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.teamFields}>
            <Input
              id="sb-teamB-name"
              label="Nome — Time B"
              placeholder="Ex: paiN"
              value={teamB.name}
              onChange={(e) => updateTeamB({ name: e.target.value })}
            />
            <div className={styles.fieldGroup}>
              <label className={styles.selectLabel} htmlFor="sb-teamB-logo">Logo — Time B</label>
              <select
                id="sb-teamB-logo"
                className={styles.select}
                value={teamB.logo ?? ''}
                onChange={(e) => updateTeamB({ logo: e.target.value || null })}
              >
                <option value="">— Sem logo —</option>
                {images.map(img => (
                  <option key={img} value={img}>{img}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Evento e estilo */}
      <Card>
        <p className={styles.sectionLabel}>Evento e estilo</p>
        <div className={styles.fields}>
          <Input
            id="sb-event"
            label="Evento"
            placeholder="Ex: CBLOL 2025 — Fase de Grupos"
            value={event}
            onChange={(e) => update({ event: e.target.value })}
          />

          <div className={styles.colorRow}>
            <label className={styles.colorLabel} htmlFor="sb-primaryColor">
              Cor de destaque
            </label>
            <input
              id="sb-primaryColor"
              type="color"
              className={styles.colorInput}
              value={primaryColor}
              onChange={(e) => update({ primaryColor: e.target.value })}
            />
            <span className={styles.colorValue}>{primaryColor}</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.selectLabel} htmlFor="sb-font">Fonte</label>
            <select
              id="sb-font"
              className={styles.select}
              value={font}
              onChange={(e) => update({ font: e.target.value })}
            >
              {fonts.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Ações */}
      <div className={styles.actions}>
        <Button variant="primary" size="lg" fullWidth disabled={!connected || isVisible} onClick={handleShow}>
          Mostrar
        </Button>
        <Button variant="danger" size="lg" fullWidth disabled={!connected || !isVisible} onClick={handleHide}>
          Esconder
        </Button>
        <Button variant="secondary" size="lg" fullWidth disabled={!connected} onClick={handleReset}>
          Resetar placar
        </Button>
      </div>
    </div>
  )
}

export default ScoreboardControl
