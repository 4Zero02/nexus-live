import styles from './CS2MapList.module.css'

const formatMapName = (name) => {
  if (!name) return ''
  return name.replace(/^(de_|cs_|ar_)/, '').replace(/_/g, ' ').toUpperCase()
}

const CS2MapList = ({ mapList = [], ctShortName = 'CT', tShortName = 'TR', ctColor = '#4a9eff', tColor = '#f5a623' }) => {
  if (!mapList?.length) return null

  return (
    <div className={styles.container}>
      {mapList.map((item, i) => {
        const isPlayed = item.scoreLeft !== null && item.scoreRight !== null && item.scoreLeft !== undefined
        const pickedBy = item.pickedBy
        let pickedLabel = '—'
        let pickedColor = 'rgba(255,255,255,0.4)'
        if (pickedBy === 'ct') { pickedLabel = ctShortName; pickedColor = ctColor }
        else if (pickedBy === 't') { pickedLabel = tShortName; pickedColor = tColor }
        else if (pickedBy === 'decoy') { pickedLabel = 'DECOY'; pickedColor = 'rgba(255,255,255,0.4)' }

        return (
          <div key={item.id ?? i} className={`${styles.mapRow} ${!isPlayed ? styles.upcoming : ''}`}>
            <span className={styles.mapIndex}>{i + 1}</span>
            <span className={styles.mapName}>{formatMapName(item.mapName)}</span>
            <span className={styles.pickedBy} style={{ color: pickedColor }}>{pickedLabel}</span>
            {isPlayed ? (
              <span className={styles.score}>
                <span className={styles.scoreLeft}>{item.scoreLeft}</span>
                <span className={styles.scoreSep}>–</span>
                <span className={styles.scoreRight}>{item.scoreRight}</span>
              </span>
            ) : (
              <span className={styles.upcoming}>EM JOGO</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CS2MapList
