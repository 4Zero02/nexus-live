import { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'

const useDashboardSocket = () => {
  const [instances, setInstances] = useState([])
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io({ path: '/socket.io' })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('instance:list', {})
    })

    socket.on('disconnect', () => setConnected(false))

    socket.on('instances:data', (list) => {
      setInstances(list)
    })

    socket.on('instance:created', (instance) => {
      setInstances((prev) => [...prev, instance])
    })

    socket.on('instance:deleted', ({ id }) => {
      setInstances((prev) => prev.filter((inst) => inst.id !== id))
    })

    return () => socket.disconnect()
  }, [])

  const emit = useCallback((event, data = {}) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    }
  }, [])

  return { instances, emit, connected }
}

export default useDashboardSocket
