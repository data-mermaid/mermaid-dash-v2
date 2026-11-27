import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import React from 'react'
import { PostHogProvider } from 'posthog-js/react'
import { initSentry, Sentry } from './sentry.js'

initSentry()

// Recover from stale/failed chunk loads (e.g. after a deploy or on flaky mobile networks)
// by reloading the page once. A sessionStorage timestamp prevents reload loops.
const PRELOAD_RELOAD_KEY = 'vitePreloadErrorReloadedAt'
const PRELOAD_RELOAD_COOLDOWN_MS = 10000

window.addEventListener('vite:preloadError', (event) => {
  try {
    const lastReloadAt = Number(window.sessionStorage.getItem(PRELOAD_RELOAD_KEY))
    if (lastReloadAt && Date.now() - lastReloadAt < PRELOAD_RELOAD_COOLDOWN_MS) {
      return
    }
    window.sessionStorage.setItem(PRELOAD_RELOAD_KEY, String(Date.now()))
  } catch {
    // sessionStorage can throw (private mode/storage restrictions); don't risk a reload loop
    return
  }
  event.preventDefault()
  window.location.reload()
})

const options = {
  api_host: import.meta.env.VITE_ENVIRONMENT === 'prod' ? import.meta.env.VITE_PUBLIC_POSTHOG_HOST : null,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An unexpected error has occurred.</p>}>
      {import.meta.env.VITE_PUBLIC_POSTHOG_HOST && import.meta.env.VITE_ENVIRONMENT === 'prod' ? (
        <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PostHogProvider>
      ) : (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )}
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)
