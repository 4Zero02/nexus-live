import { NavLink } from 'react-router-dom'
import styles from './MobileDrawer.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overlays', icon: '▦' },
  { to: '/assets', label: 'Assets', icon: '◈' },
]

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
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default MobileDrawer
