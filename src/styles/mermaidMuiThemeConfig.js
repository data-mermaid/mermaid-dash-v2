import theme from './theme'

export default {
  palette: {
    primary: {
      main: `${theme.color.primaryColor}`,
    },
    secondary: {
      main: `${theme.color.secondaryColor}`,
    },
    callout: {
      main: `${theme.color.callout}`,
    },
  },
  typography: {
    htmlFontSize: 10, // This is because in globalStyles.js we set font-size to 62.5%
  },
}
