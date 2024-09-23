import { Routes, Route, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import GlobalStyle from './styles/globalStyles.js'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import mermaidMuiThemeConfig from './styles/mermaidMuiThemeConfig.js'
import MermaidDash from './components/MermaidDash/MermaidDash.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import { FilterProjectsProvider } from './context/FilterProjectsContext'
import { MapProvider } from 'react-map-gl'
import { useState } from 'react'

const App = () => {
  const navigateTo = useNavigate()
  const theme = createTheme(mermaidMuiThemeConfig)
  const location = useLocation()
  const [isApiDataLoaded, setIsApiDataLoaded] = useState(false) // storing this state here ensures dev server hot reloading doesnt cause us to fetch the data again

  const onRedirectCallback = (appState) => {
    navigateTo(appState && appState.returnTo ? appState.returnTo : location.pathname)
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
        <MapProvider>
          <FilterProjectsProvider>
            <GlobalStyle />
            <Routes>
              <Route
                path="/"
                element={
                  <MermaidDash
                    isApiDataLoaded={isApiDataLoaded}
                    setIsApiDataLoaded={setIsApiDataLoaded}
                  />
                }
              />
            </Routes>
          </FilterProjectsProvider>
        </MapProvider>
      </Auth0Provider>
    </ThemeProvider>
  )
}

export default App
