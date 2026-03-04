import styles from './Card.module.css'

const Card = ({ children, interactive = false, className = '', ...props }) => {
  return (
    <div
      className={`${styles.card} ${interactive ? styles.interactive : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
