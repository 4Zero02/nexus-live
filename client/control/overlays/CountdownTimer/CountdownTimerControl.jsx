import { useState, useEffect } from 'react'
import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import { useToast } from '@shared/ui/Toast/useToast'
import styles from './CountdownTimerControl.module.css'

const FALLBACK_FONTS = ['Inter', 'Roboto', 'Montserrat', 'Oswald', 'Rajdhani']

const formatTime = (seconds) => {
  const s = Math.max(0, Math.round(seconds))
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

const CountdownTimerControl = ({ state, emit, connected }) => {
  const { toast } = useToast()
  const [fonts, setFonts] = useState(FALLBACK_FONTS)

  useEffect(() => {
    fetch('/assets/list')
      .then(r => r.json())
      .then(data => {
        if (data.fonts?.length) {
          const fontNames = data.fonts.map(f => f.replace(/\.[^.]+$/, ''))
          setFonts([...new Set([...FALLBACK_FONTS, ...fontNames])])
        }
      })
      .catch(err => console.warn('[CountdownTimerControl] Falha ao carregar assets:', err))
  }, [])

  const isVisible = state?.visible ?? false
  const primaryColor = state?.primaryColor ?? '#65b307'
  const font = state?.font ?? 'Inter'
  const warningThreshold = state?.warningThreshold ?? 10
  const duration = state?.duration ?? 300
  const remaining = state?.remaining ?? duration
  const running = state?.running ?? false

  const durationMinutes = Math.floor(duration / 60)
  const durationSeconds = duration % 60

  const isWarning = remaining <= warningThreshold && remaining > 0
  const isFinished = remaining <= 0

  const update = (patch) => emit('overlay:update', { data: patch })

  const handleDurationChange = (minutes, seconds) => {
    const totalSeconds = Math.max(0, minutes * 60 + seconds)
    update({ duration: totalSeconds, remaining: totalSeconds })
  }

  const handleStart = () => {
    emit('timer:start', {})
    toast.success('Timer iniciado')
  }

  const handlePause = () => {
    emit('timer:pause', {})
    toast.info('Timer pausado')
  }

  const handleReset = () => {
    emit('timer:reset', {})
    toast.info('Timer resetado')
  }

  const handleShow = () => {
    emit('overlay:show', {})
    toast.success('Timer exibido')
  }

  const handleHide = () => {
    emit('overlay:hide', {})
    toast.info('Timer ocultado')
  }

  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <h2 className={styles.heading}>Countdown Timer</h2>
        <Badge variant={isVisible ? 'live' : 'offline'}>
          {isVisible ? 'VISÍVEL' : 'OCULTO'}
        </Badge>
      </div>

      {/* Display do tempo restante */}
      <Card>
        <p className={styles.sectionLabel}>Tempo restante</p>
        <div
          className={`${styles.timeDisplay} ${isWarning ? styles.warning : ''} ${isFinished ? styles.finished : ''}`}
          style={{ '--ct-accent': primaryColor }}
        >
          {formatTime(remaining)}
        </div>
        <div className={styles.statusRow}>
          <span className={styles.statusText}>
            {running ? 'Rodando...' : isFinished ? 'Finalizado' : 'Pausado'}
          </span>
          {running && <span className={styles.runningDot} />}
        </div>
      </Card>

      {/* Controles do timer */}
      <Card>
        <p className={styles.sectionLabel}>Controles</p>
        <div className={styles.timerActions}>
          <button
            className={`${styles.timerBtn} ${styles.timerBtnStart}`}
            disabled={!connected || running || isFinished}
            onClick={handleStart}
          >
            ▶ Iniciar
          </button>
          <button
            className={`${styles.timerBtn} ${styles.timerBtnPause}`}
            disabled={!connected || !running}
            onClick={handlePause}
          >
            ⏸ Pausar
          </button>
          <button
            className={`${styles.timerBtn} ${styles.timerBtnReset}`}
            disabled={!connected}
            onClick={handleReset}
          >
            ↺ Resetar
          </button>
        </div>
      </Card>

      {/* Duração */}
      <Card>
        <p className={styles.sectionLabel}>Duração</p>
        <div className={styles.durationRow}>
          <div className={styles.durationField}>
            <Input
              id="ct-minutes"
              label="Minutos"
              type="number"
              min="0"
              max="99"
              value={durationMinutes}
              onChange={(e) =>
                handleDurationChange(parseInt(e.target.value, 10) || 0, durationSeconds)
              }
            />
          </div>
          <span className={styles.durationSep}>:</span>
          <div className={styles.durationField}>
            <Input
              id="ct-seconds"
              label="Segundos"
              type="number"
              min="0"
              max="59"
              value={durationSeconds}
              onChange={(e) =>
                handleDurationChange(durationMinutes, parseInt(e.target.value, 10) || 0)
              }
            />
          </div>
        </div>
      </Card>

      {/* Estilo e aviso */}
      <Card>
        <p className={styles.sectionLabel}>Estilo</p>
        <div className={styles.fields}>
          <div className={styles.colorRow}>
            <label className={styles.colorLabel} htmlFor="ct-primaryColor">
              Cor de destaque
            </label>
            <input
              id="ct-primaryColor"
              type="color"
              className={styles.colorInput}
              value={primaryColor}
              onChange={(e) => update({ primaryColor: e.target.value })}
            />
            <span className={styles.colorValue}>{primaryColor}</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.selectLabel} htmlFor="ct-font">Fonte</label>
            <select
              id="ct-font"
              className={styles.select}
              value={font}
              onChange={(e) => update({ font: e.target.value })}
            >
              {fonts.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <Input
            id="ct-warning"
            label="Aviso de tempo (segundos)"
            type="number"
            min="0"
            max="3600"
            value={warningThreshold}
            onChange={(e) => update({ warningThreshold: parseInt(e.target.value, 10) || 0 })}
          />
        </div>
      </Card>

      {/* Visibilidade */}
      <div className={styles.actions}>
        <Button variant="primary" size="lg" fullWidth disabled={!connected || isVisible} onClick={handleShow}>
          Mostrar
        </Button>
        <Button variant="danger" size="lg" fullWidth disabled={!connected || !isVisible} onClick={handleHide}>
          Esconder
        </Button>
      </div>
    </div>
  )
}

export default CountdownTimerControl
