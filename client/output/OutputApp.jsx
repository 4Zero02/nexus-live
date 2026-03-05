import { useParams } from 'react-router-dom'
import useOverlaySocket from '@shared/useOverlaySocket'
import { getOverlayType } from '@shared/overlayRegistry'
import './output.css'

const OutputApp = () => {
  const { id } = useParams()
  const { state, overlayType, emit } = useOverlaySocket(id)

  const registryEntry = overlayType ? getOverlayType(overlayType) : null
  const OverlayComponent = registryEntry?.outputComponent ?? null

  return (
    <div className="output-root">
      {OverlayComponent && state && <OverlayComponent state={state} emit={emit} />}
    </div>
  )
}

export default OutputApp
