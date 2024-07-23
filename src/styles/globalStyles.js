import { createGlobalStyle, css } from 'styled-components'
import theme from './theme'
import { hoverState } from './mediaQueries'
import '@fontsource/open-sans'
import '@fontsource/open-sans/700.css'

// Different from webapp - inline import because this app uses vite
const toastifyCssPromise = import('react-toastify/dist/ReactToastify.css').then(
  (module) => module.default,
)

const GlobalStyle = createGlobalStyle`
  ${await toastifyCssPromise} // different from Collect - add await
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
    svg {
        width: ${theme.typography.defaultIconSize}; // different from Collect - removed props parameter
        height: ${theme.typography.defaultIconSize}; // different from Collect - removed props parameter
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
