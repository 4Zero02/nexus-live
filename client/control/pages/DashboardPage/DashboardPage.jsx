import { useMemo } from 'react'
import useDashboardSocket from '@shared/useDashboardSocket'
import { OVERLAY_REGISTRY } from '@shared/overlayRegistry'
import OverlayCard from './OverlayCard'
import styles from './DashboardPage.module.css'

const DashboardPage = () => {
  const { instances, connected } = useDashboardSocket()

  const countsByType = useMemo(() => {
    const counts = {}
    instances.forEach(({ type }) => {
      counts[type] = (counts[type] ?? 0) + 1
    })
    return counts
  }, [instances])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Overlays</h1>
        {!connected && (
          <p className={styles.offline}>Servidor desconectado — reconectando...</p>
        )}
      </div>

      <div className={styles.grid}>
        {OVERLAY_REGISTRY.map((type) => (
          <OverlayCard
            key={type.id}
            type={type}
            instanceCount={countsByType[type.id] ?? 0}
          />
        ))}
      </div>
    </div>
  )
}

export default DashboardPage
