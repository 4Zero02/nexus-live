import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import MobileDrawer from './MobileDrawer'
import styles from './TopNav.module.css'

const Logo = () => (
  <span className={styles.logo}>
    <span className={styles.logoBracket}>[</span>
    NEXUS
    <span className={styles.logoAccent}> ELITE</span>
    <span className={styles.logoBracket}>]</span>
  </span>
)

const TopNav = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={styles.logoLink}>
          <Logo />
        </NavLink>

        <div className={styles.links}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            Overlays
          </NavLink>
          <NavLink
            to="/assets"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            Assets
          </NavLink>
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
