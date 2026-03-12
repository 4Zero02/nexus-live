import { useState, useEffect } from 'react'
import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import { useToast } from '@shared/ui/Toast/useToast'
import useCS2GameState from '@shared/useCS2GameState'
import styles from './CS2RoundTimerControl.module.css'

const FALLBACK_FONTS = ['Inter', 'Roboto', 'Montserrat', 'Oswald', 'Rajdhani']

const PHASE_LABELS = {
  freezetime: 'FREEZE',
  live:       'ROUND',
  bomb:       'BOMBA PLANTADA',
  defuse:     'DEFUSANDO',
  warmup:     'WARMUP',
}

const formatTime = (remaining) => {
  if (remaining == null) return '--'
  const total = Math.max(0, Math.ceil(remaining))
  if (total >= 60) {
    const m = Math.floor(total / 60)
    const s = (total % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }
  return total.toString().padStart(2, '0')
}

const CS2RoundTimerControl = ({ state, emit, connected }) => {
  const { toast } = useToast()
  const [fonts, setFonts] = useState(FALLBACK_FONTS)
  const { gameState, isConnected: cs2Connected } = useCS2GameState()

  useEffect(() => {
    fetch('/assets/list')
      .then((r) => r.json())
      .then((data) => {
        if (data.fonts?.length) {
          const names = data.fonts.map((f) => f.replace(/\.[^.]+$/, ''))
          setFonts([...new Set([...FALLBACK_FONTS, ...names])])
        }
      })
      .catch((err) => console.warn('[CS2RoundTimerControl] Falha ao carregar assets:', err))
  }, [])

  const isVisible         = state?.visible          ?? false
  const primaryColor      = state?.primaryColor      ?? '#48bb78'
  const warningColor      = state?.warningColor      ?? '#e53e3e'
  const font              = state?.font              ?? 'Inter'
  const warningThreshold  = state?.warningThreshold  ?? 10

  const update = (patch) => emit('overlay:update', { data: patch })

  const timer      = gameState?.timer
  const remaining  = timer?.remaining ?? null
  const phase      = timer?.phase ?? null
  const phaseLabel = PHASE_LABELS[phase] ?? (gameState ? 'N/D' : '—')
  const isWarning  = remaining !== null && remaining <= warningThreshold

  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <h2 className={styles.heading}>CS2 Round Timer</h2>
        <div className={styles.badges}>
          <Badge variant={cs2Connected && gameState ? 'live' : 'offline'}>
            {cs2Connected && gameState ? 'CS2 ✓' : 'CS2 ✗'}
          </Badge>
          <Badge variant={isVisible ? 'live' : 'offline'}>
            {isVisible ? 'VISÍVEL' : 'OCULTO'}
          </Badge>
        </div>
      </div>

      {/* Timer ao vivo (read-only) */}
      <Card>
        <p className={styles.sectionLabel}>Timer ao vivo</p>
        <div className={styles.liveTimer}>
          <span
            className={styles.liveTime}
            style={{ color: isWarning ? warningColor : primaryColor }}
          >
            {formatTime(remaining)}
          </span>
          <span className={styles.livePhase}>{phaseLabel}</span>
        </div>
      </Card>

      {/* Estilo */}
      <Card>
        <p className={styles.sectionLabel}>Estilo</p>
        <div className={styles.fields}>
          <div className={styles.colorRow}>
            <label className={styles.colorLabel} htmlFor="rt-primary">Cor principal</label>
            <input
              id="rt-primary"
              type="color"
              className={styles.colorInput}
              value={primaryColor}
              onChange={(e) => update({ primaryColor: e.target.value })}
            />
            <span className={styles.colorValue}>{primaryColor}</span>
          </div>
          <div className={styles.colorRow}>
            <label className={styles.colorLabel} htmlFor="rt-warning">Cor de aviso</label>
            <input
              id="rt-warning"
              type="color"
              className={styles.colorInput}
              value={warningColor}
              onChange={(e) => update({ warningColor: e.target.value })}
            />
            <span className={styles.colorValue}>{warningColor}</span>
          </div>
          <Input
            id="rt-threshold"
            label={`Aviso abaixo de (segundos) — atual: ${warningThreshold}s`}
            type="number"
            min={1}
            max={30}
            value={warningThreshold}
            onChange={(e) => {
              const v = Math.min(30, Math.max(1, Number(e.target.value)))
              update({ warningThreshold: v })
            }}
          />
          <div className={styles.fieldGroup}>
            <label className={styles.selectLabel} htmlFor="rt-font">Fonte</label>
            <select
              id="rt-font"
              className={styles.select}
              value={font}
              onChange={(e) => update({ font: e.target.value })}
            >
              {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Ações */}
      <div className={styles.actions}>
        <Button
          variant="primary" size="lg" fullWidth
          disabled={!connected || isVisible}
          onClick={() => { emit('overlay:show', {}); toast.success('Round Timer exibido') }}
        >
          Mostrar
        </Button>
        <Button
          variant="danger" size="lg" fullWidth
          disabled={!connected || !isVisible}
          onClick={() => { emit('overlay:hide', {}); toast.info('Round Timer ocultado') }}
        >
          Esconder
        </Button>
      </div>
    </div>
  )
}

export default CS2RoundTimerControl
