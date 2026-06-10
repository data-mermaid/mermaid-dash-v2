import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import i18nextLoader from 'vite-plugin-i18next-loader'
import { sentryVitePlugin } from '@sentry/vite-plugin'

const sentryEnabled = !!process.env.SENTRY_AUTH_TOKEN

if (sentryEnabled) {
  const missing = ['SENTRY_ORG', 'SENTRY_PROJECT'].filter((k) => !process.env[k])
  if (missing.length) {
    throw new Error(
      `Sentry source map upload is enabled (SENTRY_AUTH_TOKEN is set) but the following required variables are missing: ${missing.join(', ')}`,
    )
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
  plugins: [
    react(),
    svgr(),
    i18nextLoader({ paths: ['./src/locales'] }),
    ...(sentryEnabled
      ? [
          sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
          }),
        ]
      : []),
  ],
  build: {
    // 'hidden' emits .map files for Sentry upload without exposing references in JS bundles;
    // false skips source maps entirely in local/dev builds
    sourcemap: sentryEnabled ? 'hidden' : false,
  },
})
