import { createGlobalStyle, css } from 'styled-components'
import theme from './theme'
import { hoverState } from './mediaQueries'
import '@fontsource/open-sans'
import '@fontsource/open-sans/700.css'

// Different from webapp - static ?inline import because this app uses vite.
// A static import keeps the CSS in the main bundle, so no separate chunk has to load at startup.
import toastifyCss from 'react-toastify/dist/ReactToastify.css?inline'

const GlobalStyle = createGlobalStyle`
  ${toastifyCss}
  :root {
      font-size: 62.5%;
  }
  body {
      background-color: ${theme.color.backgroundColor};
  }
  body, select, input, textarea, button, a{
      font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif' !important; 
      font-size: ${theme.typography.defaultFontSize};
      color: ${theme.color.textColor};
      -webkit-font-smoothing: antialiased;
  
    }
    select, input, textarea, p, a, button{
        line-height: ${theme.typography.lineHeight};
    }
    *,*::before,*::after {
        box-sizing: border-box;
    } 
    a{
        text-decoration: underline;
        ${hoverState(css`
          text-decoration: none;
        `)}
    }
`

export default GlobalStyle
