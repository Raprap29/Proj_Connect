import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReduxProvider } from './provider/provider.tsx'
import { AppContext } from './context/AppContext.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContext>
      <ReduxProvider>
        <App />
      </ReduxProvider>
    </AppContext>
  </StrictMode>,
)
