import { Outlet, useLocation } from 'react-router-dom'
import { ToastProvider } from '@shared/ui/Toast/Toast'
import StatusBar from '@shared/ui/StatusBar/StatusBar'
import TopNav from './TopNav/TopNav'
import styles from './Layout.module.css'

const Layout = () => {
  const location = useLocation()

  return (
    <ToastProvider>
      <div className={styles.root}>
        <StatusBar />
        <TopNav />
        <main className={styles.main}>
          <div key={location.pathname} className={styles.page}>
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}

export default Layout
