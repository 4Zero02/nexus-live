import { useState, useEffect, useRef } from 'react'
import styles from './CS2Radar.module.css'

const RADAR_SIZE = 300

const CS2Radar = ({ players = [], mapName = '', ctColor = '#4a9eff', tColor = '#f5a623' }) => {
  const [radarData, setRadarData] = useState(null)
  const [imageError, setImageError] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    fetch('/gsi/cs2/radars')
      .then((r) => r.json())
      .then((data) => {
        setRadarData(data)
      })
      .catch((err) => {
        console.warn('[CS2Radar] Falha ao carregar radars.json:', err)
        setRadarData({})
      })
  }, [])

  const cleanMapName = mapName.replace(/^de_|^cs_|^ar_/, (m) => m)
  const mapKey = mapName ? mapName.toLowerCase() : ''
  const mapInfo = radarData?.[mapKey] ?? null

  const imageUrl = mapName
    ? `/assets/file/images/cs2/img/maps/${mapName}.png`
    : null

  // Convert world coordinates to pixel coordinates for a 1024x1024 radar image
  // displayed at RADAR_SIZE x RADAR_SIZE
  const worldToPixel = (worldX, worldY) => {
    if (!mapInfo) return null
    const { pos_x, pos_y, scale } = mapInfo
    // pos_x and pos_y are top-left world coords, scale is units/pixel on original radar
    const pixelX = (worldX - pos_x) / scale
    const pixelY = (pos_y - worldY) / scale  // Y is inverted in CS2 engine
    // Scale to our display size (radar images are 1024×1024)
    const ratio = RADAR_SIZE / 1024
    return {
      x: pixelX * ratio,
      y: pixelY * ratio,
    }
  }

  const alivePlayers = players.filter((p) => p.isAlive)
  const deadPlayers  = players.filter((p) => !p.isAlive)
  const bombCarrier  = players.find((p) => p.hasBomb && p.isAlive)

  return (
    <div className={styles.container}>
      {/* Map image */}
      {imageUrl && !imageError && (
        <img
          className={styles.mapImage}
          src={imageUrl}
          alt={mapName}
          width={RADAR_SIZE}
          height={RADAR_SIZE}
          onError={() => {
            console.warn('[CS2Radar] Imagem do mapa não encontrada:', imageUrl)
            setImageError(true)
          }}
        />
      )}

      {/* Fallback background if no image */}
      {(!imageUrl || imageError) && (
        <div className={styles.mapFallback}>
          <span className={styles.mapFallbackLabel}>{mapName || 'RADAR'}</span>
        </div>
      )}

      {/* Player dots */}
      <svg
        className={styles.overlay}
        width={RADAR_SIZE}
        height={RADAR_SIZE}
        viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
      >
        {/* Dead players — dimmed */}
        {deadPlayers.map((p) => {
          const pos = p.position ? worldToPixel(p.position.x, p.position.y) : null
          if (!pos) return null
          const color = p.team === 'CT' ? ctColor : tColor
          return (
            <circle
              key={`dead-${p.steamId}`}
              cx={pos.x}
              cy={pos.y}
              r={4}
              fill={color}
              opacity={0.25}
            />
          )
        })}

        {/* Alive players */}
        {alivePlayers.map((p) => {
          const pos = p.position ? worldToPixel(p.position.x, p.position.y) : null
          if (!pos) return null
          const color = p.team === 'CT' ? ctColor : tColor
          return (
            <g key={`alive-${p.steamId}`}>
              <circle cx={pos.x} cy={pos.y} r={6} fill={color} opacity={0.9} />
              <circle cx={pos.x} cy={pos.y} r={6} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
            </g>
          )
        })}

        {/* Bomb carrier indicator */}
        {bombCarrier && (() => {
          const pos = bombCarrier.position
            ? worldToPixel(bombCarrier.position.x, bombCarrier.position.y)
            : null
          if (!pos) return null
          return (
            <g key="bomb">
              <circle cx={pos.x} cy={pos.y} r={10} fill="none" stroke="#e8d44d" strokeWidth={1.5} opacity={0.8} />
              <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#e8d44d" fontWeight="bold">C4</text>
            </g>
          )
        })()}
      </svg>

      {/* Map name label */}
      {mapName && (
        <div className={styles.mapLabel}>{mapName.replace('de_', '').replace('cs_', '').toUpperCase()}</div>
      )}
    </div>
  )
}

export default CS2Radar
