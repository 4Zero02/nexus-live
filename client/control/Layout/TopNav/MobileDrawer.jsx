import { NavLink } from 'react-router-dom'
import { OVERLAY_REGISTRY } from '@shared/overlayRegistry'
import styles from './MobileDrawer.module.css'

const MobileDrawer = ({ open, onClose }) => {
  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>
            <span className={styles.titleAccent}>[</span>
            NEXUS ELITE
            <span className={styles.titleAccent}>]</span>
          </span>
          <button className={styles.close} onClick={onClose} aria-label="Fechar menu">✕</button>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.icon}>▦</span>
            <span>Dashboard</span>
          </NavLink>

          <div className={styles.sectionLabel}>Overlays</div>

          {OVERLAY_REGISTRY.map(({ id, label }) => (
            <NavLink
              key={id}
              to={`/overlay/${id}`}
              onClick={onClose}
              className={({ isActive }) => `${styles.item} ${styles.subItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>◈</span>
              <span>{label}</span>
            </NavLink>
          ))}

          <div className={styles.sectionDivider} />

          <NavLink
            to="/assets"
            onClick={onClose}
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.icon}>◈</span>
            <span>Assets</span>
          </NavLink>
        </nav>
      </div>
    </div>
  )
}

export default MobileDrawer
