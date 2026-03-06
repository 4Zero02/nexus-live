import { useCallback } from 'react'
import LottiePlayer from '@shared/LottiePlayer/LottiePlayer'
import styles from './IntroOutro.module.css'

const IntroOutro = ({ state, emit }) => {
  const visible = state?.visible ?? false
  const mode = state?.mode ?? null
  const introFile = state?.introFile ?? null
  const outroFile = state?.outroFile ?? null

  const src =
    mode === 'intro' && introFile
      ? `/assets/file/lottie/${introFile}`
      : mode === 'outro' && outroFile
        ? `/assets/file/lottie/${outroFile}`
        : null

  const handleComplete = useCallback(() => {
    if (emit) emit('overlay:hide')
  }, [emit])

  return (
    <div className={`${styles.container} ${visible ? styles.isVisible : styles.isHidden}`}>
      {visible && src && (
        <LottiePlayer
          key={src}
          src={src}
          autoplay
          loop={false}
          onComplete={handleComplete}
        />
      )}
    </div>
  )
}

export default IntroOutro
