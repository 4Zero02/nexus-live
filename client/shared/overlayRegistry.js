import LowerThird from '@output/overlays/LowerThird/LowerThird'
import LowerThirdControl from '@control/overlays/LowerThird/LowerThirdControl'
import LowerThirdPreview from '@control/overlays/LowerThird/LowerThirdPreview'
import SocialBug from '@output/overlays/SocialBug/SocialBug'
import SocialBugControl from '@control/overlays/SocialBug/SocialBugControl'
import SocialBugPreview from '@control/overlays/SocialBug/SocialBugPreview'
import Scoreboard from '@output/overlays/Scoreboard/Scoreboard'
import ScoreboardControl from '@control/overlays/Scoreboard/ScoreboardControl'
import ScoreboardPreview from '@control/overlays/Scoreboard/ScoreboardPreview'
import CountdownTimer from '@output/overlays/CountdownTimer/CountdownTimer'
import CountdownTimerControl from '@control/overlays/CountdownTimer/CountdownTimerControl'
import CountdownTimerPreview from '@control/overlays/CountdownTimer/CountdownTimerPreview'

export const OVERLAY_REGISTRY = [
  {
    id: 'lower-third',
    label: 'Lower Third',
    description: 'Nome e cargo do apresentador ou entrevistado',
    preview: LowerThirdPreview,
    outputComponent: LowerThird,
    controlComponent: LowerThirdControl,
    defaultState: {
      visible: false,
      primaryColor: '#65b307',
      font: 'Inter',
      icon: null,
      mainText: '',
      secondText: '',
    },
  },
  {
    id: 'social-bug',
    label: 'Social Bug',
    description: 'Handle de rede social com auto-hide',
    preview: SocialBugPreview,
    outputComponent: SocialBug,
    controlComponent: SocialBugControl,
    defaultState: {
      visible: false,
      platform: 'instagram',
      backgroundColor: '#E1306C',
      handle: '',
      autohide: 0,
    },
  },
  {
    id: 'scoreboard',
    label: 'Scoreboard',
    description: 'Placar ao vivo com dois times',
    preview: ScoreboardPreview,
    outputComponent: Scoreboard,
    controlComponent: ScoreboardControl,
    defaultState: {
      visible: false,
      primaryColor: '#65b307',
      font: 'Inter',
      teamA: { name: '', score: 0, logo: null },
      teamB: { name: '', score: 0, logo: null },
      event: '',
    },
  },
  {
    id: 'countdown-timer',
    label: 'Countdown Timer',
    description: 'Contagem regressiva server-side',
    preview: CountdownTimerPreview,
    outputComponent: CountdownTimer,
    controlComponent: CountdownTimerControl,
    defaultState: {
      visible: false,
      primaryColor: '#65b307',
      font: 'Inter',
      warningThreshold: 10,
      duration: 300,
      remaining: 300,
      running: false,
    },
  },
  {
    id: 'news-ticker',
    label: 'News Ticker',
    description: 'Faixa de texto rolando na base da tela',
    preview: null,
    outputComponent: null,
    controlComponent: null,
    defaultState: {
      visible: false,
      labelText: 'AO VIVO',
      labelColor: '#e11d48',
      backgroundColor: '#1e1e2e',
      items: [],
      speed: 3,
    },
  },
  {
    id: 'intro-outro',
    label: 'Intro / Outro',
    description: 'Animação Lottie de abertura e encerramento',
    preview: null,
    outputComponent: null,
    controlComponent: null,
    defaultState: {
      visible: false,
      introFile: null,
      outroFile: null,
      mode: null,
    },
  },
]

export const getOverlayType = (typeId) =>
  OVERLAY_REGISTRY.find((entry) => entry.id === typeId) ?? null
