import { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'

const useOverlaySocket = (overlayId) => {
  const [state, setState] = useState(null)
  const [overlayType, setOverlayType] = useState(null)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!overlayId) return

    const socket = io({ path: '/socket.io' })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('overlay:sync', { overlayId })
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('overlay:sync', ({ type, state: syncedState }) => {
      if (type) setOverlayType(type)
      setState(syncedState)
    })

    socket.on('overlay:show', ({ state: newState }) => {
      setState(newState)
    })

    socket.on('overlay:hide', ({ state: newState }) => {
      setState(newState)
    })

    socket.on('overlay:update', ({ state: newState }) => {
      setState(newState)
    })

    return () => {
      socket.disconnect()
    }
  }, [overlayId])

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, { overlayId, ...data })
    }
  }, [overlayId])

  return { state, overlayType, emit, connected }
}

export default useOverlaySocket
