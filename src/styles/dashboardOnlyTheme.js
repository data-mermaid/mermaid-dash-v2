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
        color: ['#b6b400', '#9ce5fa', '#b4b4b4', '#498fc9'],
      },
    },
    benthic: {
      'Hard coral': '#498fc9',
      'Bare substrate': '#f2f3f3',
      'Crustose coralline algae': '#fbd7d5',
      Rubble: '#f5f6af',
      Cyanobacteria: '#870e00',
      Seagrass: '#4d4d4d',
      Sand: '#c1b180',
      Macroalgae: '#b2b000',
      'Turf algae': '#d9eea8',
      'Soft coral': '#9ce5fa',
      'Other invertebrates': '#4e4e4e',
    },
    bleachingSeverity: {
      percent_normal_avg: '#3c6e9a',
      percent_pale_avg: '#6288ad',
      percent_20_avg: '#85a3c1',
      percent_50_avg: '#a8bed5',
      percent_80_avg: '#cbdaea',
      percent_100_avg: '#eff7ff',
      percent_dead_avg: '#b4b4b4',
    },
  },

  timeseriesCharts: {
    managementRuleColorMap: {
      'Open Access': '#77b4c5',
      Restrictions: '#70aae6',
    },
    benthicCoverColorMap: {
      'Hard coral': '#498fc9',
      'Bare substrate': '#f2f3f3',
      'Crustose coralline algae': '#fbd7d5',
      Rubble: '#f5f6af',
      Cyanobacteria: '#870e00',
      Seagrass: '#4d4d4d',
      Sand: '#c1b180',
      Macroalgae: '#b2b000',
      'Turf algae': '#d9eea8',
      'Soft coral': '#9ce5fa',
      'Other invertebrates': '#4e4e4e',
    },
    habitatComplexityColorMap: {
      0: '#eff7ff',
      1: '#cbdaea',
      2: '#a8bed5',
      3: '#85a3c1',
      4: '#6288ad',
      5: '#3c6e9a',
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
    height: 370,
    autosize: true,
    margin: {
      l: 50,
      r: 30,
      b: 40,
      t: 50,
    },
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

  horizontalLegend: {
    orientation: 'h',
    xanchor: 'center',
    x: 0.5,
    y: -0.2,
    font: {
      size: 9,
    },
  },
}
const dashboardOnlyTheme = { color, plotlyChart }

export default dashboardOnlyTheme
