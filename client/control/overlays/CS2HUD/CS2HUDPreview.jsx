import styles from './CS2HUDPreview.module.css'

const FAKE_CT = [
  { name: 'nexus_igl', kda: '8/2', alive: true  },
  { name: 'striker_x', kda: '6/3', alive: true  },
  { name: 'snipeR',    kda: '5/4', alive: false },
  { name: 'clutcher',  kda: '4/5', alive: true  },
  { name: 'rifler_br', kda: '3/3', alive: true  },
]

const FAKE_T = [
  { name: 'headshot_k', kda: '7/4', alive: false },
  { name: 'rush_b',     kda: '5/6', alive: true  },
  { name: 'smoker99',   kda: '4/5', alive: true  },
  { name: 'awp_god',    kda: '3/7', alive: true  },
  { name: 'entry_fr',   kda: '2/8', alive: true  },
]

const CS2HUDPreview = () => (
  <div className={styles.wrapper}>
    {/* Header */}
    <div className={styles.header}>
      <div className={styles.teamCT}>
        <span className={styles.teamName}>NEXUS</span>
        <span className={styles.score} style={{ color: '#4a9eff' }}>8</span>
      </div>
      <div className={styles.center}>
        <span className={styles.timer}>1:28</span>
        <span className={styles.round}>RD 11/24</span>
      </div>
      <div className={styles.teamT}>
        <span className={styles.score} style={{ color: '#f5a623' }}>6</span>
        <span className={styles.teamName}>ALTAIR</span>
      </div>
    </div>

    {/* Players */}
    <div className={styles.players}>
      <div className={styles.col}>
        {FAKE_CT.map((p) => (
          <div key={p.name} className={`${styles.player} ${!p.alive ? styles.dead : ''}`}>
            <div className={styles.hpBar}>
              <div className={styles.hpFill} style={{ width: p.alive ? '80%' : '0', background: '#4a9eff' }} />
            </div>
            <div className={styles.playerInfo}>
              <span className={styles.playerName}>{p.name}</span>
              <span className={styles.playerKda}>{p.kda}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={`${styles.col} ${styles.colRight}`}>
        {FAKE_T.map((p) => (
          <div key={p.name} className={`${styles.player} ${!p.alive ? styles.dead : ''}`}>
            <div className={styles.hpBar}>
              <div className={styles.hpFill} style={{ width: p.alive ? '65%' : '0', background: '#f5a623' }} />
            </div>
            <div className={`${styles.playerInfo} ${styles.playerInfoRight}`}>
              <span className={styles.playerKda}>{p.kda}</span>
              <span className={styles.playerName}>{p.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Players alive + killfeed hint */}
    <div className={styles.bottom}>
      <span className={styles.alive} style={{ color: '#4a9eff' }}>CT 4</span>
      <span className={styles.aliveLabel}>ALIVE</span>
      <span className={styles.alive} style={{ color: '#f5a623' }}>T 4</span>
    </div>
  </div>
)

export default CS2HUDPreview
