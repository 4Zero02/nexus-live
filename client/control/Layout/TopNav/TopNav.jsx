import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { OVERLAY_REGISTRY } from '@shared/overlayRegistry'
import MobileDrawer from './MobileDrawer'
import styles from './TopNav.module.css'

const ConnectionBadge = () => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = io({ path: '/socket.io' })
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    return () => socket.disconnect()
  }, [])

  return (
    <span
      className={`${styles.connectionBadge} ${connected ? styles.badgeConnected : styles.badgeDisconnected}`}
      title={connected ? 'Servidor conectado' : 'Servidor desconectado'}
    />
  )
}

const Logo = () => (
  <span className={styles.logo}>
    <span className={styles.logoBracket}>[</span>
    NEXUS
    <span className={styles.logoAccent}> ELITE</span>
    <span className={styles.logoBracket}>]</span>
  </span>
)

const OverlaysDropdown = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        className={`${styles.link} ${styles.dropdownTrigger}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        Overlays
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▾</span>
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          {OVERLAY_REGISTRY.map(({ id, label, description }) => (
            <NavLink
              key={id}
              to={`/overlay/${id}`}
              className={({ isActive }) =>
                `${styles.dropdownItem} ${isActive ? styles.active : ''}`
              }
              onClick={() => setOpen(false)}
            >
              <span className={styles.dropdownLabel}>{label}</span>
              <span className={styles.dropdownDesc}>{description}</span>
            </NavLink>
          ))}
          <div className={styles.dropdownDivider} />
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.dropdownItem} ${isActive ? styles.active : ''}`
            }
            onClick={() => setOpen(false)}
          >
            <span className={styles.dropdownLabel}>Ver todos</span>
            <span className={styles.dropdownDesc}>Dashboard com todos os tipos</span>
          </NavLink>
        </div>
      )}
    </div>
  )
}

const TopNav = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={styles.logoLink}>
          <Logo />
        </NavLink>

        <div className={styles.links}>
          <OverlaysDropdown />
          <NavLink
            to="/assets"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            Assets
          </NavLink>
          <ConnectionBadge />
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

export default TopNav
