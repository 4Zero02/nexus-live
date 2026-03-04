import styles from './Badge.module.css'

const Badge = ({ variant = 'offline', children }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  )
}

export default Badge
