import useDashboardSocket from '@shared/useDashboardSocket'
import { OVERLAY_REGISTRY } from '@shared/overlayRegistry'
import OverlayCard from './OverlayCard'
import styles from './DashboardPage.module.css'

const DashboardPage = () => {
  const { states, emit, connected } = useDashboardSocket()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Overlays</h1>
        {!connected && (
          <p className={styles.offline}>Servidor desconectado — reconectando...</p>
        )}
      </div>

      <div className={styles.grid}>
        {OVERLAY_REGISTRY.map((overlay) => (
          <OverlayCard
            key={overlay.id}
            overlay={overlay}
            state={states[overlay.id]}
            emit={emit}
          />
        ))}
      </div>
    </div>
  )
}

export default DashboardPage
