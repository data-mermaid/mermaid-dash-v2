import colorHelper from 'color'

const yellow = colorHelper('#FFFAE0')

const color = {
  yellow,
}

const plotlyChart = {
  aggregateCharts: {
    default: { marker: { color: '#769fca' } },
    hardCoralCover: { marker: { low: '#d13823', medium: '#f3a224', high: '#277d1d' } },
    bleaching: {
      marker: {
        color: ['#3c6e9a', '#6288ad', '#85a3c1', '#a8bed5', '#cbdaea', '#eff7ff', '#b4b4b4'],
      },
    },
  },

  timeseriesCharts: {
    managementRulesColorMap: {
      'Open Access': '#77b4c5',
      Restrictions: '#70aae6',
    },
    benthicCoverColor: [
      '#498fc9',
      '#f2f3f3',
      '#fbd7d5',
      '#f5f6af',
      '#870e00',
      '#4d4d4d',
      '#c1b180',
      '#b2b000',
      '#d9eea8',
      '#9ce5fa',
      '#4e4e4e',
    ],
    habitatComplexityColorMap: {
      1: '#eff7ff',
      2: '#cbdaea',
      3: '#a8bed5',
      4: '#85a3c1',
      5: '#6288ad',
      6: '#3c6e9a',
    },
    bleachingColor: {
      Normal: '#3c6e9a',
      Pale: '#6288ad',
      '0-20%': '#85a3c1',
      '20-50%': '#a8bed5',
      '50-80%': '#cbdaea',
      '80-100%': '#eff7ff',
      Dead: '#b4b4b4',
    },
  },

  layout: {
    bargap: 0.1,
    dragmode: false,
    height: 270,
    autosize: true,
    margin: {
      l: 50,
      r: 30,
      b: 40,
      t: 50,
    },

    showlegend: false,
    xaxis: {
      fixedrange: true,
      linecolor: 'black',
      linewidth: 2,
      title: { standoff: 5 },
    },
    yaxis: {
      fixedrange: true,
      linecolor: 'black',
      linewidth: 2,
      title: { standoff: 5 },
    },
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
    responsive: true,
  },
}
const dashboardOnlyTheme = { color, plotlyChart }

export default dashboardOnlyTheme
