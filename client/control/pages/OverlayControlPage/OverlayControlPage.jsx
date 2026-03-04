import { useParams, Link } from 'react-router-dom'
import useOverlaySocket from '@shared/useOverlaySocket'
import { OVERLAY_REGISTRY } from '@shared/overlayRegistry'
import LowerThirdControl from '../../overlays/LowerThird/LowerThirdControl'
import styles from './OverlayControlPage.module.css'

const CONTROLS = {
  'lower-third': LowerThirdControl,
}

const OverlayControlPage = () => {
  const { id } = useParams()
  const { state, emit, connected } = useOverlaySocket(id)

  const overlay = OVERLAY_REGISTRY.find(o => o.id === id)
  const ControlComponent = CONTROLS[id]

  if (!overlay || !ControlComponent) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundMsg}>Overlay <code>"{id}"</code> não encontrado.</p>
        <Link to="/dashboard" className={styles.backLink}>← Voltar ao Dashboard</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/dashboard" className={styles.back}>← Overlays</Link>
        <span className={styles.sep}>/</span>
        <span className={styles.current}>{overlay.name}</span>
      </div>

      <div className={styles.content}>
        <ControlComponent
          overlayId={id}
          state={state}
          emit={emit}
          connected={connected}
        />
      </div>
    </div>
  )
}

export default OverlayControlPage
