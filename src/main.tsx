import {LandscapeLayout} from './layout/LandscapeLayout'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.frameElement?.hasAttribute('data-milo-viewport') ? <App /> : <LandscapeLayout />}
  </StrictMode>,
)
