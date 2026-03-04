import { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { OVERLAY_REGISTRY } from './overlayRegistry'

const useDashboardSocket = () => {
  const [states, setStates] = useState({})
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io({ path: '/socket.io' })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      OVERLAY_REGISTRY.forEach(({ id }) => {
        socket.emit('overlay:sync', { overlayId: id })
      })
    })

    socket.on('disconnect', () => setConnected(false))

    socket.on('overlay:sync', ({ overlayId, state }) => {
      setStates(prev => ({ ...prev, [overlayId]: state }))
    })

    const handleUpdate = ({ overlayId, state }) => {
      setStates(prev => ({ ...prev, [overlayId]: state }))
    }

    socket.on('overlay:show', handleUpdate)
    socket.on('overlay:hide', handleUpdate)
    socket.on('overlay:update', handleUpdate)

    return () => socket.disconnect()
  }, [])

  const emit = useCallback((event, overlayId, data = {}) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, { overlayId, ...data })
    }
  }, [])

  return { states, emit, connected }
}

export default useDashboardSocket
