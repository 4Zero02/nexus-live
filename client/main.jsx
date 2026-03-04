import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import '@shared/styles/tokens.css'
import OutputApp from './output/OutputApp'
import Layout from './control/Layout/Layout'
import DashboardPage from './control/pages/DashboardPage/DashboardPage'
import OverlayControlPage from './control/pages/OverlayControlPage/OverlayControlPage'
import AssetsPage from './control/pages/AssetsPage/AssetsPage'
import StyleguidePage from './control/pages/StyleguidePage/StyleguidePage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Output — transparente para o OBS */}
        <Route path="/output/:id" element={<OutputApp />} />

        {/* Painel de controle — envolto no Layout */}
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/control/:id" element={<OverlayControlPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/styleguide" element={<StyleguidePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
