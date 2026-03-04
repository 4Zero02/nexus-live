import { Outlet } from 'react-router-dom'
import { ToastProvider } from '@shared/ui/Toast/Toast'
import StatusBar from '@shared/ui/StatusBar/StatusBar'
import TopNav from './TopNav/TopNav'
import styles from './Layout.module.css'

const Layout = () => {
  return (
    <ToastProvider>
      <div className={styles.root}>
        <StatusBar />
        <TopNav />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  )
}

export default Layout
