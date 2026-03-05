import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import { useToast } from '@shared/ui/Toast/useToast'
import styles from './LowerThirdControl.module.css'

const LowerThirdControl = ({ state, emit, connected }) => {
  const { toast } = useToast()

  const isVisible = state?.visible ?? false
  const mainText = state?.mainText ?? ''
  const secondText = state?.secondText ?? ''
  const primaryColor = state?.primaryColor ?? '#65b307'
  const font = state?.font ?? 'Inter'
  const icon = state?.icon ?? ''

  const update = (patch) => {
    emit('overlay:update', { data: patch })
  }

  const handleShow = () => {
    emit('overlay:show', {})
    toast.success('Lower Third exibido')
  }

  const handleHide = () => {
    emit('overlay:hide', {})
    toast.info('Lower Third ocultado')
  }

  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <h2 className={styles.heading}>Lower Third</h2>
        <Badge variant={isVisible ? 'live' : 'offline'}>
          {isVisible ? 'VISÍVEL' : 'OCULTO'}
        </Badge>
      </div>

      <Card>
        <div className={styles.fields}>
          <Input
            id="lt-mainText"
            label="Nome principal"
            placeholder="Ex: João Silva"
            value={mainText}
            onChange={(e) => update({ mainText: e.target.value })}
          />
          <Input
            id="lt-secondText"
            label="Título / Cargo"
            placeholder="Ex: Comentarista"
            value={secondText}
            onChange={(e) => update({ secondText: e.target.value })}
          />
          <Input
            id="lt-icon"
            label="Ícone (nome do arquivo em /assets/images/)"
            placeholder="Ex: instagram.png"
            value={icon}
            onChange={(e) => update({ icon: e.target.value || null })}
          />
          <div className={styles.colorRow}>
            <label className={styles.colorLabel} htmlFor="lt-primaryColor">
              Cor de destaque
            </label>
            <input
              id="lt-primaryColor"
              type="color"
              className={styles.colorInput}
              value={primaryColor}
              onChange={(e) => update({ primaryColor: e.target.value })}
            />
            <span className={styles.colorValue}>{primaryColor}</span>
          </div>
          <Input
            id="lt-font"
            label="Fonte"
            placeholder="Ex: Inter, Gotham, Roboto"
            value={font}
            onChange={(e) => update({ font: e.target.value })}
          />
        </div>
      </Card>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!connected || isVisible}
          onClick={handleShow}
        >
          Mostrar
        </Button>
        <Button
          variant="danger"
          size="lg"
          fullWidth
          disabled={!connected || !isVisible}
          onClick={handleHide}
        >
          Esconder
        </Button>
      </div>
    </div>
  )
}

export default LowerThirdControl
