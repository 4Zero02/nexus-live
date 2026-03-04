import { useNavigate } from 'react-router-dom'
import Badge from '@shared/ui/Badge/Badge'
import Button from '@shared/ui/Button/Button'
import styles from './OverlayCard.module.css'

const OverlayCard = ({ overlay, state, emit }) => {
  const navigate = useNavigate()
  const isVisible = state?.visible ?? false

  const handleToggle = (e) => {
    e.stopPropagation()
    if (isVisible) {
      emit('overlay:hide', overlay.id)
    } else {
      emit('overlay:show', overlay.id)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>{overlay.icon}</span>
        </div>
        <div className={styles.meta}>
          <h3 className={styles.name}>{overlay.name}</h3>
          <p className={styles.desc}>{overlay.description}</p>
        </div>
      </div>

      <div className={styles.footer}>
        <Badge variant={isVisible ? 'live' : 'offline'}>
          {isVisible ? 'VISÍVEL' : 'OCULTO'}
        </Badge>

        <div className={styles.actions}>
          <Button
            variant={isVisible ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleToggle}
          >
            {isVisible ? 'Esconder' : 'Mostrar'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/control/${overlay.id}`)}
          >
            Controlar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OverlayCard
