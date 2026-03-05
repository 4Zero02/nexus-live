import { Link } from 'react-router-dom'
import styles from './OverlayCard.module.css'

const OverlayCard = ({ type, instanceCount }) => {
  const { id, label, description, preview: Preview } = type

  return (
    <Link to={`/overlay/${id}`} className={styles.card}>
      <div className={styles.preview}>
        {Preview ? (
          <Preview />
        ) : (
          <div className={styles.previewPlaceholder}>
            <span className={styles.previewInitial}>{label[0]}</span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{label}</h3>
        <p className={styles.desc}>{description}</p>
        <span className={styles.count}>
          {instanceCount} {instanceCount === 1 ? 'instância' : 'instâncias'}
        </span>
      </div>
    </Link>
  )
}

export default OverlayCard
