import { useState, useEffect } from 'react'
import Button from '@shared/ui/Button/Button'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import { useToast } from '@shared/ui/Toast/useToast'
import styles from './IntroOutroControl.module.css'

const IntroOutroControl = ({ state, emit, connected }) => {
  const { toast } = useToast()
  const [lottieFiles, setLottieFiles] = useState([])

  useEffect(() => {
    fetch('/assets/list')
      .then((r) => r.json())
      .then((data) => {
        if (data.lottie?.length) setLottieFiles(data.lottie)
      })
      .catch((err) => console.warn('[IntroOutroControl] Falha ao carregar assets:', err))
  }, [])

  const isVisible = state?.visible ?? false
  const introFile = state?.introFile ?? ''
  const outroFile = state?.outroFile ?? ''
  const mode = state?.mode ?? null

  const isPlaying = isVisible && mode !== null
  const statusLabel = isPlaying ? 'REPRODUZINDO' : 'PRONTO'
  const statusVariant = isPlaying ? 'live' : 'offline'

  const update = (patch) => emit('overlay:update', { data: patch })

  const handlePlayIntro = () => {
    if (!introFile) {
      toast.error('Selecione um arquivo de intro')
      return
    }
    update({ mode: 'intro' })
    emit('overlay:show', {})
    toast.success('Reproduzindo intro...')
  }

  const handlePlayOutro = () => {
    if (!outroFile) {
      toast.error('Selecione um arquivo de outro')
      return
    }
    update({ mode: 'outro' })
    emit('overlay:show', {})
    toast.success('Reproduzindo outro...')
  }

  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <h2 className={styles.heading}>Intro / Outro</h2>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      <Card>
        <div className={styles.fields}>
          <div className={styles.fieldGroup}>
            <label className={styles.selectLabel} htmlFor="io-introFile">
              Arquivo de Intro
            </label>
            <select
              id="io-introFile"
              className={styles.select}
              value={introFile}
              onChange={(e) => update({ introFile: e.target.value || null })}
            >
              <option value="">— Selecione um arquivo —</option>
              {lottieFiles.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.selectLabel} htmlFor="io-outroFile">
              Arquivo de Outro
            </label>
            <select
              id="io-outroFile"
              className={styles.select}
              value={outroFile}
              onChange={(e) => update({ outroFile: e.target.value || null })}
            >
              <option value="">— Selecione um arquivo —</option>
              {lottieFiles.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!connected || !introFile || isPlaying}
          onClick={handlePlayIntro}
        >
          ▶ Tocar Intro
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!connected || !outroFile || isPlaying}
          onClick={handlePlayOutro}
        >
          ▶ Tocar Outro
        </Button>
      </div>
    </div>
  )
}

export default IntroOutroControl
