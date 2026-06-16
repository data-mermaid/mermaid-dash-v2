import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) {
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_ENVIRONMENT ?? 'local',
    release: import.meta.env.VITE_APP_VERSION ?? 'unknown',
    integrations: [Sentry.browserTracingIntegration()],
    // Sample 10% of transactions in prod; 100% elsewhere for visibility
    tracesSampleRate: import.meta.env.VITE_ENVIRONMENT === 'prod' ? 0.1 : 1.0,
  })
}

export { Sentry }
