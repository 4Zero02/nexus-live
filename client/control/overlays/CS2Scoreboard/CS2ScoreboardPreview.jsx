import styles from './CS2ScoreboardPreview.module.css'

const FAKE_CT = [
  { name: 'nexus_player', kda: '12/3/2' },
  { name: 'striker_x',   kda: '9/4/1'  },
  { name: 'snipeR',      kda: '7/5/3'  },
  { name: 'clutcher',    kda: '5/6/0'  },
  { name: 'igl_br',      kda: '4/4/5'  },
]

const FAKE_T = [
  { name: 'headshot_k',  kda: '8/5/1', dead: true },
  { name: 'rush_b',      kda: '6/7/2'  },
  { name: 'smoker99',    kda: '5/6/4'  },
  { name: 'awp_god',     kda: '4/8/1', dead: true },
  { name: 'entry_fr',    kda: '3/9/3'  },
]

const CS2ScoreboardPreview = () => (
  <div className={styles.wrapper}>
    <div className={styles.header}>
      <div className={styles.teamHeader}>
        <div className={styles.logo}>NXS</div>
        <span className={styles.teamName}>NEXUS</span>
      </div>
      <div className={styles.scores}>
        <span className={styles.score}>8</span>
        <span className={styles.sep}>:</span>
        <span className={styles.score}>5</span>
      </div>
      <div className={`${styles.teamHeader} ${styles.teamHeaderRight}`}>
        <span className={styles.teamName}>ALTAIR</span>
        <div className={styles.logo}>ALT</div>
      </div>
    </div>

    <div className={styles.body}>
      <div className={styles.col}>
        {FAKE_CT.map((p) => (
          <div key={p.name} className={styles.player}>
            <span className={styles.status}>●</span>
            <span className={styles.name}>{p.name}</span>
            <span className={styles.kda}>{p.kda}</span>
          </div>
        ))}
      </div>
      <div className={styles.divider} />
      <div className={styles.col}>
        {FAKE_T.map((p) => (
          <div key={p.name} className={`${styles.player} ${p.dead ? styles.dead : ''}`}>
            <span className={styles.status}>{p.dead ? '✕' : '●'}</span>
            <span className={styles.name}>{p.name}</span>
            <span className={styles.kda}>{p.kda}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default CS2ScoreboardPreview
