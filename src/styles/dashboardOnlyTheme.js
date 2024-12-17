import colorHelper from 'color'

const yellow = colorHelper('#FFFAE0')

const color = {
  yellow,
}

const plotlyChart = {
  fishBiomass: { marker: { color: '#769fca' } },
  hardCoralCover: { marker: { low: '#d13823', medium: '#f3a224', high: '#277d1d' } },
  layout: {
    bargap: 0.1,
    height: 270,
    margin: {
      l: 50,
      r: 30,
      b: 40,
      t: 50,
    },

    showLegend: false,
    xaxis: { linecolor: 'black', linewidth: 2, title: { standoff: 5 } },
    yaxis: { linecolor: 'black', linewidth: 2, title: { standoff: 5 } },
    modebar: {
      orientation: 'v',
    },
  },
  config: {
    modeBarButtonsToRemove: [
      'zoom2d',
      'pan2d',
      'select2d',
      'lasso2d',
      'zoomIn2d',
      'zoomOut2d',
      'autoScale2d',
      'resetScale2d',
    ],
    displaylogo: false,
  },
}
const dashboardOnlyTheme = { color, plotlyChart }

export default dashboardOnlyTheme
