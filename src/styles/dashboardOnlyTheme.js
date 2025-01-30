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

  sampleEventCharts: {
    fishTropicGroupCover: {
      marker: {
        color: ['#80cdc1', '#377eb8', '#bebada', '#fcae61', '#fdd92f', '#4d9221', '#d9ed8b'],
        line: { color: 'black', width: 1 },
      },
    },
    bleaching: {
      marker: {
        colors: ['#498fc9', '#b4b4b4', '#9ce5fa', '#b6b400'],
      },
    },
    bleachBenthicColorMap: {
      percent_hard_avg_avg: '#498fc9',
      other: '#b4b4b4',
      percent_soft_avg_avg: '#9ce5fa',
      percent_algae_avg_avg: '#b6b400',
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

    showLegend: false,
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
