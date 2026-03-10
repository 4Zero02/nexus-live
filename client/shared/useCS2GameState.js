import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const useCS2GameState = () => {
  const [gameState, setGameState] = useState(null)
  const [kills, setKills] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef(null)

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
      setKills((prev) => [...prev.slice(-49), kill])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const economy = gameState?.economy ?? null

  return { gameState, kills, economy, isConnected }
}

export default useCS2GameState
