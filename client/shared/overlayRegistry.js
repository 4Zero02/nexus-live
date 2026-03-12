import CS2HUD from '@output/overlays/CS2HUD/CS2HUD'
import CS2HUDControl from '@control/overlays/CS2HUD/CS2HUDControl'
import CS2HUDPreview from '@control/overlays/CS2HUD/CS2HUDPreview'
import CS2Scoreboard from '@output/overlays/CS2Scoreboard/CS2Scoreboard'
import CS2ScoreboardControl from '@control/overlays/CS2Scoreboard/CS2ScoreboardControl'
import CS2ScoreboardPreview from '@control/overlays/CS2Scoreboard/CS2ScoreboardPreview'
import CS2RoundTimer from '@output/overlays/CS2RoundTimer/CS2RoundTimer'
import CS2RoundTimerControl from '@control/overlays/CS2RoundTimer/CS2RoundTimerControl'
import CS2RoundTimerPreview from '@control/overlays/CS2RoundTimer/CS2RoundTimerPreview'
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
import NewsTicker from '@output/overlays/NewsTicker/NewsTicker'
import NewsTickerControl from '@control/overlays/NewsTicker/NewsTickerControl'
import NewsTickerPreview from '@control/overlays/NewsTicker/NewsTickerPreview'
import IntroOutro from '@output/overlays/IntroOutro/IntroOutro'
import IntroOutroControl from '@control/overlays/IntroOutro/IntroOutroControl'
import IntroOutroPreview from '@control/overlays/IntroOutro/IntroOutroPreview'

export const OVERLAY_REGISTRY = [
  {
    id: 'cs2-hud',
    label: 'CS2 Observer HUD',
    description: 'HUD completa para transmissão de partidas de CS2 com radar, placar e kill feed',
    preview: CS2HUDPreview,
    outputComponent: CS2HUD,
    controlComponent: CS2HUDControl,
    defaultState: {
      visible: false,
      teamCTName: 'Counter-Terrorists',
      teamTName: 'Terrorists',
      teamCTColor: '#4a9eff',
      teamTColor: '#f5a623',
      teamCTLogo: null,
      teamTLogo: null,
    },
  },
  {
    id: 'cs2-round-timer',
    label: 'CS2 Round Timer',
    description: 'Tempo restante do round via GSI com aviso visual',
    preview: CS2RoundTimerPreview,
    outputComponent: CS2RoundTimer,
    controlComponent: CS2RoundTimerControl,
    defaultState: {
      visible: false,
      primaryColor: '#48bb78',
      warningColor: '#e53e3e',
      font: 'Inter',
      warningThreshold: 10,
    },
  },
  {
    id: 'cs2-scoreboard',
    label: 'CS2 Scoreboard',
    description: 'Placar ao vivo via GSI — kills, deaths e assistências de cada jogador',
    preview: CS2ScoreboardPreview,
    outputComponent: CS2Scoreboard,
    controlComponent: CS2ScoreboardControl,
    defaultState: {
      visible: false,
      primaryColor: '#f0b429',
      font: 'Inter',
      teamCTName: 'CT',
      teamTName: 'T',
      teamCTLogo: null,
      teamTLogo: null,
    },
  },
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
    preview: NewsTickerPreview,
    outputComponent: NewsTicker,
    controlComponent: NewsTickerControl,
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
    preview: IntroOutroPreview,
    outputComponent: IntroOutro,
    controlComponent: IntroOutroControl,
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
