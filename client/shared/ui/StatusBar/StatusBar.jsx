import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import styles from './StatusBar.module.css'

const StatusBar = () => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = io({ path: '/socket.io' })
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    return () => socket.disconnect()
  }, [])

  return (
    <div
      className={`${styles.bar} ${connected ? styles.connected : styles.disconnected}`}
      title={connected ? 'Servidor conectado' : 'Servidor desconectado'}
    />
  )
}

export default StatusBar
