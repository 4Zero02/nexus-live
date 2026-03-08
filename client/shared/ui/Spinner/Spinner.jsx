import styles from './Spinner.module.css'

const Spinner = ({ size = 'md', label, centered = false }) => {
  const wrapperClass = [styles.wrapper, centered ? styles.centered : ''].filter(Boolean).join(' ')
  const spinnerClass = [styles.spinner, size !== 'md' ? styles[size] : ''].filter(Boolean).join(' ')

  if (label) {
    return (
      <div className={wrapperClass}>
        <span className={spinnerClass} aria-hidden="true" />
        <span>{label}</span>
      </div>
    )
  }

  return <span className={spinnerClass} aria-label="Carregando..." />
}

export default Spinner
