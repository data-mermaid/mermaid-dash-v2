import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import React from 'react'
import { PostHogProvider } from 'posthog-js/react'

const options = {
  api_host: import.meta.env.VITE_ENVIRONMENT === 'prod' ? import.meta.env.VITE_PUBLIC_POSTHOG_HOST : null,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {import.meta.env.VITE_PUBLIC_POSTHOG_HOST && import.meta.env.VITE_ENVIRONMENT === 'prod'? (
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
  </React.StrictMode>,
)
