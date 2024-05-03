import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/material'
import { theme } from './constants/theme.js'

import MermaidDash from './components/MermaidDash'
// import { HistogramProvider } from './context/histogramContext'

function App() {
  const mermaidTheme = createTheme({
    palette: {
      ...theme,
    },
  })

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={mermaidTheme}>
        <Router>
          {/* <HistogramProvider> */}
          <Routes>
            <Route path="/" element={<MermaidDash />} />
          </Routes>
          {/* </HistogramProvider> */}
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
