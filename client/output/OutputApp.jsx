import { useParams } from 'react-router-dom'
import useOverlaySocket from '@shared/useOverlaySocket'
import './output.css'
import LowerThird from './overlays/LowerThird/LowerThird'

const OVERLAYS = {
  'lower-third': LowerThird,
}

const OutputApp = () => {
  const { id } = useParams()
  const { state } = useOverlaySocket(id)

  const OverlayComponent = OVERLAYS[id]

  if (!OverlayComponent) return null

  return <OverlayComponent state={state} />
}

export default OutputApp
