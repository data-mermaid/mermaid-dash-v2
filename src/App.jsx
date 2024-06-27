import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import GlobalStyle from './styles/globalStyles.js'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import mermaidThemeConfig from './styles/mermaidThemeConfig.js'
import MermaidDash from './components/MermaidDash'
import { Auth0Provider } from '@auth0/auth0-react'

function App() {
  const navigateTo = useNavigate()
  const theme = createTheme(mermaidThemeConfig)

  const onRedirectCallback = (appState) => {
    navigateTo(appState && appState.returnTo ? appState.returnTo : window.location.pathname)
  }

  const authConfig = {
    domain: import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID,
    onRedirectCallback,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE,
    },
  }

  return (
    <ThemeProvider theme={theme}>
      <Auth0Provider {...authConfig}>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<MermaidDash />} />
        </Routes>
      </Auth0Provider>
    </ThemeProvider>
  )
}

export default App
