import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import { useToast } from '@shared/ui/Toast/useToast'
import styles from './NewsTickerControl.module.css'

const SPEED_LABELS = {
  1: 'Muito devagar',
  2: 'Devagar',
  3: 'Normal',
  4: 'Rápido',
  5: 'Muito rápido',
}

const NewsTickerControl = ({ state, emit, connected }) => {
  const { toast } = useToast()

  const isVisible = state?.visible ?? false
  const labelText = state?.labelText ?? 'AO VIVO'
  const labelColor = state?.labelColor ?? '#e11d48'
  const backgroundColor = state?.backgroundColor ?? 'rgba(10, 10, 10, 0.92)'
  const items = state?.items ?? []
  const speed = state?.speed ?? 3

  const update = (patch) => emit('overlay:update', { data: patch })

  const handleShow = () => {
    emit('overlay:show', {})
    toast.success('Ticker exibido')
  }

  const handleHide = () => {
    emit('overlay:hide', {})
    toast.info('Ticker ocultado')
  }

  const handleItemsChange = (text) => {
    const parsed = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    update({ items: parsed })
  }

  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <h2 className={styles.heading}>News Ticker</h2>
        <Badge variant={isVisible ? 'live' : 'offline'}>
          {isVisible ? 'VISÍVEL' : 'OCULTO'}
        </Badge>
      </div>

      {/* Label */}
      <Card>
        <p className={styles.sectionLabel}>Label</p>
        <div className={styles.fields}>
          <Input
            id="nt-labelText"
            label="Texto do label"
            value={labelText}
            onChange={(e) => update({ labelText: e.target.value })}
          />
          <div className={styles.colorRow}>
            <label className={styles.colorLabel} htmlFor="nt-labelColor">
              Cor do label
            </label>
            <input
              id="nt-labelColor"
              type="color"
              className={styles.colorInput}
              value={labelColor.startsWith('rgba') ? '#e11d48' : labelColor}
              onChange={(e) => update({ labelColor: e.target.value })}
            />
            <span className={styles.colorValue}>{labelColor}</span>
          </div>
        </div>
      </Card>

      {/* Fundo */}
      <Card>
        <p className={styles.sectionLabel}>Fundo</p>
        <div className={styles.colorRow}>
          <label className={styles.colorLabel} htmlFor="nt-bgColor">
            Cor de fundo
          </label>
          <input
            id="nt-bgColor"
            type="color"
            className={styles.colorInput}
            value={backgroundColor.startsWith('rgba') ? '#0a0a0a' : backgroundColor}
            onChange={(e) => update({ backgroundColor: e.target.value })}
          />
          <span className={styles.colorValue}>{backgroundColor}</span>
        </div>
      </Card>

      {/* Itens */}
      <Card>
        <p className={styles.sectionLabel}>Itens (um por linha)</p>
        <textarea
          className={styles.textarea}
          value={items.join('\n')}
          rows={6}
          placeholder={'Breaking: Nexus Elite Summer Split começa hoje\nFinal das finais às 21h no canal oficial'}
          onChange={(e) => handleItemsChange(e.target.value)}
        />
        <p className={styles.hint}>{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
      </Card>

      {/* Velocidade */}
      <Card>
        <p className={styles.sectionLabel}>Velocidade</p>
        <div className={styles.sliderRow}>
          <span className={styles.sliderMin}>1</span>
          <input
            type="range"
            className={styles.slider}
            min="1"
            max="5"
            step="1"
            value={speed}
            onChange={(e) => update({ speed: parseInt(e.target.value, 10) })}
          />
          <span className={styles.sliderMax}>5</span>
        </div>
        <p className={styles.speedLabel}>{SPEED_LABELS[speed]}</p>
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

export default NewsTickerControl
