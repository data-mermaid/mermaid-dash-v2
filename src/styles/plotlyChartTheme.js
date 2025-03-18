const plotlyChartTheme = {
  aggregateCharts: {
    default: { marker: { color: '#769fca' } },
    hardCoralCover: { marker: { low: '#d13823', medium: '#f3a224', high: '#277d1d' } },
    bleaching: {
      marker: {
        color: ['#3c6e9a', '#6288ad', '#85a3c1', '#a8bed5', '#cbdaea', '#eff7ff', '#b4b4b4'],
      },
    },
  },
  chartCategoryType: {
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
    bleachingColorMap: {
      Normal: '#3c6e9a',
      Pale: '#6288ad',
      '0-20%': '#85a3c1',
      '20-50%': '#a8bed5',
      '50-80%': '#cbdaea',
      '80-100%': '#eff7ff',
      Dead: '#b4b4b4',
    },
    fishTropicGroupColorMap: {
      Omnivore: '#80cdc1',
      Piscivore: '#377eb8',
      Planktivore: '#bebada',
      'Invertivore mobile': '#fcae61',
      'Invertivore sessile': '#fdd92f',
      'Herbivore macroalgae': '#4d9221',
      'Herbivore detritivore': '#d9ed8b',
    },
    bleachingBenthicColorMap: {
      'Avg Hard Coral Cover': '#498fc9',
      'Other Cover': '#b4b4b4',
      'Avg Soft Coral Cover': '#9ce5fa',
      'Avg Macroalgae Cover': '#b6b400',
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
      t: 55,
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

export default plotlyChartTheme
