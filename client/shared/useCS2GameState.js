import { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'

const MAX_KILLS = 10

const useCS2GameState = () => {
  const [gameState, setGameState] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [kills, setKills] = useState([])
  const socketRef = useRef(null)

  const addKill = useCallback((kill) => {
    setKills((prev) => {
      const next = [kill, ...prev]
      return next.slice(0, MAX_KILLS)
    })
  }, [])

  useEffect(() => {
    const socket = io({ path: '/socket.io' })
    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)

      fetch('/gsi/cs2/state')
        .then((r) => r.json())
        .then((data) => {
          if (data) setGameState(data)
        })
        .catch(() => {})
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('cs2:gamestate', (data) => {
      setGameState(data)
    })

    socket.on('cs2:kill', (kill) => {
      addKill(kill)
    })

    return () => {
      socket.disconnect()
    }
  }, [addKill])

  const economy = gameState?.economy ?? null

  return { gameState, economy, isConnected, kills }
}

export default useCS2GameState
