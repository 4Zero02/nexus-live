import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const useCS2GameState = () => {
  const [gameState, setGameState] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = io({ path: '/socket.io' })

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

    return () => {
      socket.disconnect()
    }
  }, [])

  const economy = gameState?.economy ?? null

  return { gameState, economy, isConnected }
}

export default useCS2GameState
