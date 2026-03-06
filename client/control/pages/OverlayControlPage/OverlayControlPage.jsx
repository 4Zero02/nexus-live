import { useParams, Link } from 'react-router-dom'
import useOverlaySocket from '@shared/useOverlaySocket'
import { getOverlayType } from '@shared/overlayRegistry'
import Button from '@shared/ui/Button/Button'
import { useToast } from '@shared/ui/Toast/useToast'
import styles from './OverlayControlPage.module.css'

const OverlayControlPage = () => {
  const { id } = useParams()
  const { state, overlayType, instanceName, synced, emit, connected } = useOverlaySocket(id)
  const { toast } = useToast()

  const outputUrl = `http://localhost:5173/output/${id}`

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(outputUrl)
    toast.success('URL copiada!')
  }

  if (!synced) {
    return <div className={styles.loading}>Carregando...</div>
  }

  const registryEntry = getOverlayType(overlayType)

  if (!registryEntry || !registryEntry.controlComponent) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundMsg}>Instância <code>"{id}"</code> não encontrada.</p>
        <Link to="/dashboard" className={styles.backLink}>← Voltar ao Dashboard</Link>
      </div>
    )
  }

  const ControlComponent = registryEntry.controlComponent

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/dashboard" className={styles.back}>← Overlays</Link>
        <span className={styles.sep}>/</span>
        <Link to={`/overlay/${registryEntry.id}`} className={styles.back}>{registryEntry.label}</Link>
        <span className={styles.sep}>/</span>
        <span className={styles.current}>{instanceName ?? id}</span>
      </div>

      <div className={styles.header}>
        <h1 className={styles.instanceName}>{instanceName ?? id}</h1>
        <div className={styles.outputBar}>
          <span className={styles.urlText}>{outputUrl}</span>
          <Button variant="secondary" onClick={handleCopyUrl}>Copiar URL</Button>
          <a href={outputUrl} target="_blank" rel="noreferrer" className={styles.openLink}>
            <Button variant="secondary">Abrir output ↗</Button>
          </a>
        </div>
      </div>

      <div className={styles.content}>
        <ControlComponent
          overlayId={id}
          state={state}
          emit={emit}
          connected={connected}
        />
      </div>
    </div>
  )
}

export default OverlayControlPage
