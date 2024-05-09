import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { StyledEngineProvider } from '@mui/material'
import GlobalStyle from './styles/globalStyles.js'

import MermaidDash from './components/MermaidDash'
import { Auth0Provider } from '@auth0/auth0-react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
// import { HistogramProvider } from './context/histogramContext'

function App() {
  const navigateTo = useNavigate()

  const mermaidTheme = createTheme({
    typography: {
      fontFamily: "'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'",
    },
  })

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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={mermaidTheme}>
        <Auth0Provider {...authConfig}>
          {/* <HistogramProvider> */}
          <GlobalStyle />
          <Routes>
            <Route path="/" element={<MermaidDash />} />
          </Routes>
          {/* </HistogramProvider> */}
        </Auth0Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
