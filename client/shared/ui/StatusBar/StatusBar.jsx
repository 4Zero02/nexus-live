import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import styles from './StatusBar.module.css'

const StatusBar = () => {
  const [connected, setConnected] = useState(false)
  const [everConnected, setEverConnected] = useState(false)

  useEffect(() => {
    const socket = io({ path: '/socket.io' })
    socket.on('connect', () => {
      setConnected(true)
      setEverConnected(true)
    })
    socket.on('disconnect', () => setConnected(false))
    return () => socket.disconnect()
  }, [])

  return (
    <>
      <div
        className={`${styles.bar} ${connected ? styles.connected : styles.disconnected}`}
        title={connected ? 'Servidor conectado' : 'Servidor desconectado'}
      />
      {!connected && everConnected && (
        <div className={styles.banner}>
          Servidor offline — reconectando automaticamente…
        </div>
      )}
    </>
  )
}

export default StatusBar
