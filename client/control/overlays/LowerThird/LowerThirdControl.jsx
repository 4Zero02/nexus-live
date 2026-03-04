import { useState } from 'react'
import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import { useToast } from '@shared/ui/Toast/useToast'
import styles from './LowerThirdControl.module.css'

const LowerThirdControl = ({ state, emit, connected }) => {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const { toast } = useToast()

  const isVisible = state?.visible ?? false

  const handleShow = () => {
    emit('overlay:show', { data: { name, title } })
    toast.success('Lower Third exibido')
  }

  const handleHide = () => {
    emit('overlay:hide', {})
    toast.info('Lower Third ocultado')
  }

  const handleUpdate = () => {
    emit('overlay:update', { data: { name, title } })
    toast.success('Lower Third atualizado')
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
            id="lt-name"
            label="Nome"
            placeholder="Ex: João Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="lt-title"
            label="Título / Cargo"
            placeholder="Ex: Comentarista"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          variant="secondary"
          size="lg"
          fullWidth
          disabled={!connected || !isVisible}
          onClick={handleUpdate}
        >
          Atualizar
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
