import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { SessionProvider } from './context/SessionContext.jsx'

// ═══════════════════════════════════════════════════════
//  Router: HashRouter (not BrowserRouter).
//  Reason: the production build is served by GitHub Pages,
//  which has no SPA fallback. A BrowserRouter deep URL
//  like /journeys/new-hire would 404 on refresh. Hash-based
//  routing (/#/journeys/new-hire) keeps routing 100% client-
//  side so every URL is refresh-safe.
// ═══════════════════════════════════════════════════════
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <UserProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </UserProvider>
    </HashRouter>
  </StrictMode>,
)
