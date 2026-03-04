import { useParams, Link } from 'react-router-dom'
import useOverlaySocket from '@shared/useOverlaySocket'
import './control.css'
import LowerThirdControl from './overlays/LowerThird/LowerThirdControl'

const CONTROLS = {
  'lower-third': LowerThirdControl,
}

const ControlApp = () => {
  const { id } = useParams()
  const { state, emit, connected } = useOverlaySocket(id)

  const ControlComponent = CONTROLS[id]

  return (
    <div className="control-wrapper">
      <header className="control-header">
        <Link to="/control" className="control-back">← Todos os overlays</Link>
        <span className={`control-status ${connected ? 'is-connected' : 'is-disconnected'}`}>
          {connected ? 'conectado' : 'desconectado'}
        </span>
      </header>
      <main className="control-main">
        {ControlComponent
          ? <ControlComponent overlayId={id} state={state} emit={emit} connected={connected} />
          : <p className="control-unknown">Overlay "{id}" não encontrado.</p>
        }
      </main>
    </div>
  )
}

export default ControlApp
