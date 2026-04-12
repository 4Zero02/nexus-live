import LowerThird from '@output/overlays/LowerThird/LowerThird'
import LowerThirdControl from '@control/overlays/LowerThird/LowerThirdControl'
import LowerThirdPreview from '@control/overlays/LowerThird/LowerThirdPreview'
import SocialBug from '@output/overlays/SocialBug/SocialBug'
import SocialBugControl from '@control/overlays/SocialBug/SocialBugControl'
import SocialBugPreview from '@control/overlays/SocialBug/SocialBugPreview'
import NewsTicker from '@output/overlays/NewsTicker/NewsTicker'
import NewsTickerControl from '@control/overlays/NewsTicker/NewsTickerControl'
import NewsTickerPreview from '@control/overlays/NewsTicker/NewsTickerPreview'
import IntroOutro from '@output/overlays/IntroOutro/IntroOutro'
import IntroOutroControl from '@control/overlays/IntroOutro/IntroOutroControl'
import IntroOutroPreview from '@control/overlays/IntroOutro/IntroOutroPreview'

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
