import styles from './Input.module.css'

const Input = ({
  label,
  error,
  variant = 'input',
  id,
  className = '',
  ...props
}) => {
  const Field = variant === 'textarea' ? 'textarea' : 'input'

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <Field
        id={id}
        className={`${styles.field} ${error ? styles.hasError : ''} ${variant === 'textarea' ? styles.textarea : ''}`}
        {...props}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  )
}

export default Input
