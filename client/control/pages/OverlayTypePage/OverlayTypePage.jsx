import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import { getOverlayType } from '@shared/overlayRegistry'
import Card from '@shared/ui/Card/Card'
import Badge from '@shared/ui/Badge/Badge'
import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import { useToast } from '@shared/ui/Toast/useToast'
import Spinner from '@shared/ui/Spinner/Spinner'
import styles from './OverlayTypePage.module.css'

const OverlayTypePage = () => {
  const { typeId } = useParams()
  const overlayType = getOverlayType(typeId)

  const { toast } = useToast()
  const [instances, setInstances] = useState([])
  const [loadingInstances, setLoadingInstances] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [connected, setConnected] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io({ path: '/socket.io' })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('instance:list', { type: typeId })
    })

    socket.on('disconnect', () => setConnected(false))

    socket.on('instances:data', (list) => {
      setInstances(list)
      setLoadingInstances(false)
    })

    socket.on('instance:created', (instance) => {
      setInstances((prev) => [...prev, instance])
      setCreating(false)
      setShowForm(false)
      setNewName('')
      toast.success(`Instância "${instance.name}" criada`)
    })

    socket.on('instance:deleted', ({ id }) => {
      setInstances((prev) => prev.filter((i) => i.id !== id))
      toast.info('Instância removida')
    })

    return () => socket.disconnect()
  }, [typeId])

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newName.trim() || !socketRef.current?.connected) return
    setCreating(true)
    socketRef.current.emit('instance:create', {
      type: typeId,
      name: newName.trim(),
      defaultState: overlayType.defaultState,
    })
  }

  const handleDelete = (id) => {
    if (!socketRef.current?.connected) return
    setConfirmDeleteId(id)
  }

  const handleConfirmDelete = (id) => {
    if (!socketRef.current?.connected) return
    socketRef.current.emit('instance:delete', { id })
    setConfirmDeleteId(null)
  }

  if (!overlayType) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundMsg}>
          Tipo <code>"{typeId}"</code> não encontrado.
        </p>
        <Link to="/dashboard" className={styles.backLink}>
          ← Voltar ao Dashboard
        </Link>
      </div>
    )
  }

  const Preview = overlayType.preview

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/dashboard" className={styles.back}>← Dashboard</Link>
        <span className={styles.sep}>/</span>
        <span className={styles.current}>{overlayType.label}</span>
      </div>

      <div className={styles.header}>
        {Preview && (
          <div className={styles.previewBox}>
            <Preview />
          </div>
        )}
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{overlayType.label}</h1>
          <p className={styles.description}>{overlayType.description}</p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Instâncias
            {instances.length > 0 && (
              <span className={styles.count}>{instances.length}</span>
            )}
          </h2>
          <Button
            onClick={() => setShowForm(true)}
            disabled={!connected || showForm}
          >
            + Nova instância
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className={styles.form}>
            <Input
              label="Nome da instância"
              placeholder={`ex: ${overlayType.label} — Roxo Gotham`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            <div className={styles.formActions}>
              <Button type="submit" loading={creating} disabled={!newName.trim()}>
                Criar
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setShowForm(false); setNewName('') }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {loadingInstances ? (
          <Spinner label="Carregando instâncias..." />
        ) : instances.length === 0 && !showForm ? (
          <p className={styles.empty}>Nenhuma instância criada ainda.</p>
        ) : (
          <div className={styles.list}>
            {instances.map((instance) => (
              <Card key={instance.id} className={styles.instanceCard}>
                <div className={styles.instanceInfo}>
                  <span className={styles.instanceName}>{instance.name}</span>
                  <Badge variant={instance.state?.visible ? 'live' : 'offline'}>
                    {instance.state?.visible ? 'Visível' : 'Oculto'}
                  </Badge>
                </div>
                <div className={styles.instanceActions}>
                  {confirmDeleteId === instance.id ? (
                    <div className={styles.confirmDelete}>
                      <span className={styles.confirmLabel}>Deletar?</span>
                      <button
                        className={styles.confirmBtn}
                        onClick={() => handleConfirmDelete(instance.id)}
                      >
                        Sim
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link to={`/control/${instance.id}`} className={styles.controlLink}>
                        Controlar →
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(instance.id)}
                        title="Deletar instância"
                        disabled={!connected}
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OverlayTypePage
