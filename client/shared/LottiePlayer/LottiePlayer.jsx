import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottiePlayer = ({ src, autoplay = true, loop = false, onComplete }) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!src) {
      console.warn('[LottiePlayer] src não fornecido — renderizando vazio');
      return;
    }

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Arquivo não encontrado: ${src}`);
        return res.json();
      })
      .then((animationData) => {
        if (!containerRef.current) return;

        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          animationData,
        });

        if (onComplete) {
          animationRef.current.addEventListener('complete', onComplete);
        }
      })
      .catch((err) => {
        console.warn('[LottiePlayer] Erro ao carregar animação:', err.message);
      });

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [src, autoplay, loop]);

  return <div ref={containerRef} />;
};

export default LottiePlayer;
